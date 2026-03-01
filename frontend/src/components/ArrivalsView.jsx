import { useArrivals } from '../hooks/useArrivals'

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  return mins < 2 ? 'due' : `${mins} min`
}

function isDue(seconds) {
  return Math.floor(seconds / 60) < 2
}

function getRecommendation(stops) {
  if (!stops.length) return null

  // For each stop, find the first bus that arrives after you could walk there
  const candidates = stops.flatMap((stop) =>
    stop.arrivals
      .filter((a) => a.timeToStation >= stop.walkMinutes * 60)
      .slice(0, 1)
      .map((a) => ({ stop, arrival: a }))
  )

  if (!candidates.length) {
    return { text: 'No catchable buses right now — check back soon.', urgent: false }
  }

  // Pick the stop where you catch a bus soonest
  candidates.sort((a, b) => a.arrival.timeToStation - b.arrival.timeToStation)
  const { stop, arrival } = candidates[0]
  const mins = Math.floor(arrival.timeToStation / 60)
  const waitAtStop = mins - stop.walkMinutes

  let text
  if (waitAtStop === 0) {
    text = `Leave now for ${stop.name} — ${arrival.lineName} arrives in ${mins} min (${stop.walkMinutes} min walk, no wait).`
  } else {
    text = `Head to ${stop.name} in ${waitAtStop} min — ${arrival.lineName} arrives in ${mins} min (${stop.walkMinutes} min walk).`
  }

  return { text, urgent: waitAtStop === 0 }
}

export function ArrivalsView({ label }) {
  const { data, loading, error } = useArrivals()

  const stops = data ?? []
  const recommendation = data ? getRecommendation(stops) : null

  return (
    <div className="board">
      {label && (
        <div className="board__title">{label.toUpperCase()}</div>
      )}

      {recommendation && (
        <div className={`board__recommendation${recommendation.urgent ? ' board__recommendation--urgent' : ''}`}>
          <div className="board__recommendation-label">NEXT BUS</div>
          <div className="board__recommendation-text">{recommendation.text}</div>
        </div>
      )}

      {loading && (
        <div className="board__status">Connecting to TfL…</div>
      )}

      {error && (
        <div className="board__status board__status--error">No signal</div>
      )}

      {stops.map((stop) => (
        <div key={stop.stopId} className="board__group">
          <div className="board__stop-header">
            <span>{stop.name.toUpperCase()}</span>
            <span>{stop.walkMinutes} MIN WALK</span>
          </div>

          {stop.disruptions?.length > 0 && (
            <div className="board__disruption">
              <span className="board__disruption-icon">!</span>
              <span>{stop.disruptions[0]}</span>
            </div>
          )}

          {stop.arrivals.length === 0 ? (
            <div className="board__row">
              <span className="board__route">—</span>
              <span className="board__destination">No buses predicted</span>
              <span className="board__time">—</span>
            </div>
          ) : (
            stop.arrivals.map((arrival) => (
              <div className="board__row" key={arrival.id}>
                <span className="board__route">{arrival.lineName}</span>
                <span className="board__destination">{arrival.destinationName}</span>
                <span className={`board__time${isDue(arrival.timeToStation) ? ' board__time--due' : ''}`}>
                  {formatTime(arrival.timeToStation)}
                </span>
              </div>
            ))
          )}
        </div>
      ))}

    </div>
  )
}
