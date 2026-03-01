import { useArrivals } from '../hooks/useArrivals'

function ArrivalCountdown({ seconds }) {
  const mins = Math.floor(seconds / 60)
  const imminent = mins < 2
  return (
    <div className="departure-board">
      <span className={`departure-board__time${imminent ? ' departure-board__time--imminent' : ''}`}>
        {imminent ? 'Due' : mins}
      </span>
      <span className="departure-board__label">{imminent ? 'now' : 'min'}</span>
    </div>
  )
}

function StopGroup({ stop }) {
  return (
    <section>
      <header className="stop-group__header">
        <h2 className="stop-group__name">{stop.name}</h2>
        <span className="stop-group__walk">{stop.walkMinutes} min walk</span>
      </header>

      {stop.arrivals.length === 0 ? (
        <p className="status-message">No arrivals in the next 30 minutes</p>
      ) : (
        stop.arrivals.map((arrival) => (
          <article className="arrival-card" key={arrival.id}>
            <span className="arrival-card__route">{arrival.lineName}</span>
            <span className="arrival-card__destination">{arrival.destinationName}</span>
            <ArrivalCountdown seconds={arrival.timeToStation} />
          </article>
        ))
      )}
    </section>
  )
}

export function ArrivalsView() {
  const { data, loading, error } = useArrivals()

  return (
    <div className="arrivals-view">
      {loading && <p className="status-message">Loading arrivals…</p>}

      {error && (
        <p className="status-message status-message--error">
          Could not load arrivals: {error}
        </p>
      )}

      {data && (
        <div className="stops-list">
          {data.map((stop) => (
            <StopGroup key={stop.stopId} stop={stop} />
          ))}
        </div>
      )}
    </div>
  )
}
