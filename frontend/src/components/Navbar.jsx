import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50 relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span
            style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', lineHeight: 1 }}
            className="text-yellow-400 drop-shadow-[0_0_8px_rgba(240,192,64,0.6)] group-hover:drop-shadow-[0_0_14px_rgba(240,192,64,0.9)] transition-all"
          >
            π
          </span>
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
