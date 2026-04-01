export default function PiLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="pgBg" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#2e1065" />
        </radialGradient>
        <linearGradient id="pgHeart" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Circle background */}
      <circle cx="24" cy="24" r="23" fill="url(#pgBg)" />
      <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* π — white, left half */}
      {/* horizontal bar */}
      <rect x="5" y="16" width="18" height="3.5" rx="1.75" fill="white" />
      {/* left leg */}
      <rect x="6.5" y="16" width="3.5" height="15" rx="1.75" fill="white" />
      {/* right leg */}
      <rect x="18" y="16" width="3.5" height="15" rx="1.75" fill="white" />

      {/* ♥ — gold, right half */}
      <path
        d="M35 34
           C29.5 30, 25 26, 25 22
           C25 18, 28 16, 31 18
           C33 19, 34 21, 35 20
           C36 21, 37 19, 39 18
           C42 16, 45 18, 45 22
           C45 26, 40.5 30, 35 34 Z"
        fill="url(#pgHeart)"
      />
    </svg>
  )
}
