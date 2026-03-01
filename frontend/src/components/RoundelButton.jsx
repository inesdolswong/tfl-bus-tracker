/**
 * RoundelButton
 * A full-width tappable button with amber text on a dark background.
 * Add future destinations in App.jsx's DESTINATIONS array — no changes needed here.
 *
 * Props:
 *   id       – unique string (unused visually but kept for keying)
 *   label    – destination name (e.g. "Work")
 *   onClick  – callback when the button is pressed
 */
export function RoundelButton({ id, label, onClick }) {
  return (
    <button
      className="roundel-btn"
      onClick={onClick}
      aria-label={label}
      type="button"
    >
      {label.toUpperCase()}
    </button>
  )
}
