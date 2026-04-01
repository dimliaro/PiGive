export default function PiLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Purple background */}
      <circle cx="50" cy="50" r="50" fill="#4f2882" />

      {/* Gold outer ring */}
      <circle cx="50" cy="50" r="43" fill="none" stroke="#d4920e" strokeWidth="5" />

      {/* Pi symbol in gold */}
      {/* Horizontal bar */}
      <rect x="22" y="30" width="56" height="8" rx="4" fill="#d4920e" />

      {/* Left leg — straight down */}
      <rect x="26" y="30" width="8" height="40" rx="4" fill="#d4920e" />

      {/* Right leg — curves outward at bottom (the Pi Network style) */}
      <path
        d="M58 30 h8 v26 q0 14 -12 14 q-5 0 -7 -3"
        fill="none"
        stroke="#d4920e"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
