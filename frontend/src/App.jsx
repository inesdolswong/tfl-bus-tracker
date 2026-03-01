import { useState } from 'react'
import { RoundelButton } from './components/RoundelButton'
import { ArrivalsView } from './components/ArrivalsView'

/**
 * Add future destinations here — each gets its own roundel button automatically.
 * id    : unique slug (used internally + SVG clip-path namespace)
 * label : text shown on the navy bar
 */
const DESTINATIONS = [
  { id: 'work', label: 'Work' },
  // { id: 'home', label: 'Home' },
  // { id: 'gym',  label: 'Gym'  },
]

function BackButton({ onClick }) {
  return (
    <button className="header-back-btn" onClick={onClick} aria-label="Back">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M12.5 15L7.5 10L12.5 5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default function App() {
  const [activeDestination, setActiveDestination] = useState(null)

  return (
    <div className="app-shell">
      <header className="site-header">
        {activeDestination && (
          <BackButton onClick={() => setActiveDestination(null)} />
        )}
      </header>

      <main className="site-main">
        {activeDestination ? (
          <ArrivalsView key={activeDestination.id} label={activeDestination.label} />
        ) : (
          <div className="destinations">
            {DESTINATIONS.map((dest) => (
              <RoundelButton
                key={dest.id}
                id={dest.id}
                label={dest.label}
                onClick={() => setActiveDestination(dest)}
              />
            ))}
          </div>
        )}
      </main>

    </div>
  )
}
