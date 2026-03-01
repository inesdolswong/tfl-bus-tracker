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

function Roundel() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TFL Bus Tracker"
    >
      <defs>
        <clipPath id="header-roundel-clip">
          <circle cx="60" cy="60" r="54" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="54" fill="white" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="#E1251B" strokeWidth="11" />
      <rect x="0" y="43" width="120" height="34" fill="#003688" clipPath="url(#header-roundel-clip)" />
      <text
        x="60" y="60"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="13"
        fontWeight="700"
        fontFamily="Johnston100, Johnston, Arial, sans-serif"
        letterSpacing="1.5"
      >
        BUS TRACKER
      </text>
    </svg>
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
        <Roundel />
      </header>

      <main className="site-main">
        {activeDestination ? (
          <ArrivalsView key={activeDestination.id} />
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

      <footer className="site-footer">
        Powered by TfL Open Data
      </footer>
    </div>
  )
}
