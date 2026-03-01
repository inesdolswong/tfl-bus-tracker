from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import httpx

TFL_BASE_URL = "https://api.tfl.gov.uk"

app = FastAPI(title="TFL Bus Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stops of interest with the routes to surface and walking time from home
STOPS = [
    {"stopId": "490003601W", "name": "Baring Street",  "routes": ["141", "76"],       "walkMinutes": 1},
    {"stopId": "490003601S", "name": "New North Road", "routes": ["21"],              "walkMinutes": 1},
    {"stopId": "490006289S", "name": "Eagle Wharf",    "routes": ["21", "76", "141"], "walkMinutes": 3},
]


async def fetch_arrivals_for_stop(client: httpx.AsyncClient, stop: dict) -> dict:
    response = await client.get(
        f"{TFL_BASE_URL}/StopPoint/{stop['stopId']}/Arrivals"
    )
    response.raise_for_status()

    all_arrivals = response.json()

    relevant = [
        a for a in all_arrivals
        if a.get("lineName") in stop["routes"]
    ]
    relevant.sort(key=lambda a: a.get("timeToStation", 0))
    relevant = relevant[:3]

    return {
        "stopId": stop["stopId"],
        "name": stop["name"],
        "walkMinutes": stop["walkMinutes"],
        "routes": stop["routes"],
        "arrivals": relevant,
    }


@app.get("/api/arrivals")
async def get_arrivals():
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            results = await asyncio.gather(
                *[fetch_arrivals_for_stop(client, stop) for stop in STOPS]
            )
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"TFL API error: {e.response.status_code}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"TFL API unreachable: {str(e)}")

    return {"stops": list(results)}


@app.get("/api/health")
def health():
    return {"status": "ok"}
