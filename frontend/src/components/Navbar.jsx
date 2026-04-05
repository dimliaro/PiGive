import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50 relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/rippl-logo.png"
            alt="Rippl"
            className="w-8 h-8 rounded-lg object-cover group-hover:opacity-90 transition-opacity"
          />
          <span className="font-extrabold text-xl text-white tracking-tight">
            Rip<span className="text-yellow-400">pl</span>
          </span>
        </Link>

        <Link
          to="/create"
          className="btn-glow text-white font-semibold px-4 py-2 rounded-xl text-sm"
        >
          + New Campaign
        </Link>
      </div>
    </nav>
  )
}
