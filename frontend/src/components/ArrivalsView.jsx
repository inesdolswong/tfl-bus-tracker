import { useArrivals } from '../hooks/useArrivals'

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  return mins < 2 ? 'due' : `${mins} min`
}

function isDue(seconds) {
  return Math.floor(seconds / 60) < 2
}

export function ArrivalsView({ label }) {
  const { data, loading, error } = useArrivals()

  // Pre-number every arrival row sequentially across all stops
  const stops = data
    ? data.map((stop, si) => {
        const offset = data
          .slice(0, si)
          .reduce((sum, s) => sum + s.arrivals.length, 0)
        return {
          ...stop,
          arrivals: stop.arrivals.map((a, i) => ({ ...a, rowNum: offset + i + 1 })),
        }
      })
    : []

  return (
    <div className="board">
      {label && (
        <div className="board__title">{label.toUpperCase()}</div>
      )}

      {loading && (
        <div className="board__status">Connecting to TfL…</div>
      )}

      {error && (
        <div className="board__status board__status--error">No signal</div>
      )}

      {stops.map((stop) => (
        <div key={stop.stopId} className="board__group">
          {/* Stop name header — like the section dividers on real boards */}
          <div className="board__stop-header">
            <span>{stop.name.toUpperCase()}</span>
            <span>{stop.walkMinutes} MIN WALK</span>
          </div>

          {stop.arrivals.length === 0 ? (
            <div className="board__row">
              <span className="board__index" />
              <span className="board__route">—</span>
              <span className="board__destination">No buses predicted</span>
              <span className="board__time">—</span>
            </div>
          ) : (
            stop.arrivals.map((arrival) => (
              <div className="board__row" key={arrival.id}>
                <span className="board__index">{arrival.rowNum}</span>
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
