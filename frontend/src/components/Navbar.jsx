import { Link } from 'react-router-dom'
import PiLogo from './PiLogo'

export default function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50 relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="group-hover:scale-110 transition-transform inline-flex">
            <PiLogo size={30} />
          </span>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Pi<span className="text-yellow-400">Give</span>
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
