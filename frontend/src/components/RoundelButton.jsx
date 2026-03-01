/**
 * RoundelButton
 * A large tappable button styled as a TfL-inspired roundel.
 * Add future destinations in App.jsx's DESTINATIONS array — no changes needed here.
 *
 * Props:
 *   id       – unique string used to namespace the SVG clipPath
 *   label    – destination name displayed on the navy bar (e.g. "Work")
 *   onClick  – callback when the button is pressed
 */
export function RoundelButton({ id, label, onClick }) {
  const clipId = `roundel-btn-clip-${id}`

  return (
    <button
      className="roundel-btn"
      onClick={onClick}
      aria-label={label}
      type="button"
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="100" cy="100" r="92" />
          </clipPath>
        </defs>

        {/* White circle fill */}
        <circle cx="100" cy="100" r="92" fill="white" />

        {/* Red ring */}
        <circle
          cx="100" cy="100" r="92"
          fill="none"
          stroke="#E1251B"
          strokeWidth="18"
        />

        {/* Navy bar — clipped so its ends follow the inner curve of the ring */}
        <rect
          x="0" y="74"
          width="200" height="52"
          fill="#003688"
          clipPath={`url(#${clipId})`}
        />

        {/* Destination label */}
        <text
          x="100" y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="21"
          fontWeight="700"
          fontFamily="Johnston100, Johnston, Arial, sans-serif"
          letterSpacing="2"
        >
          {label.toUpperCase()}
        </text>
      </svg>
    </button>
  )
}
