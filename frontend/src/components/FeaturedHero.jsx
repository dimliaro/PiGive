import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar'

const CATEGORY_GRADIENTS = {
  school:       'from-blue-900/40 to-transparent',
  animal:       'from-emerald-900/40 to-transparent',
  sports:       'from-orange-900/40 to-transparent',
  neighborhood: 'from-violet-900/40 to-transparent',
  other:        'from-yellow-900/30 to-transparent',
}

const CATEGORY_EMOJI = {
  school: '🏫', animal: '🐾', sports: '⚽', neighborhood: '🏘️', other: '💛',
}

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function FeaturedHero({ campaign, onQuickDonate }) {
  if (!campaign) return null

  const pct      = Math.min(100, (campaign.raised / campaign.goal) * 100)
  const offset   = CIRCUMFERENCE * (1 - pct / 100)
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - Date.now()) / 86400000))
  const gradient = CATEGORY_GRADIENTS[campaign.category] || CATEGORY_GRADIENTS.other

  return (
    <div className={`card card-glow hero-shimmer mb-6 bg-gradient-to-r ${gradient}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full badge-funded">
              ⭐ FEATURED
            </span>
            <span className="text-xs text-gray-500">
              {CATEGORY_EMOJI[campaign.category]} {campaign.category}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white mb-2 leading-snug">
            {campaign.title}
          </h2>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>

          <ProgressBar current={campaign.raised} goal={campaign.goal} />

          <div className="flex items-center gap-4 mt-3 mb-4 text-xs text-gray-500">
            <span>👥 {campaign.donorCount} donors</span>
            <span>⏳ {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onQuickDonate(campaign)}
              className="btn-gold text-gray-900 font-bold px-5 py-2 rounded-xl text-sm"
            >
              Donate Now π
            </button>
            <Link
              to={`/campaign/${campaign._id}`}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 px-3 py-2"
            >
              Full details →
            </Link>
          </div>
        </div>

        {/* Right: SVG ring */}
        <div className="hidden sm:flex flex-col items-center justify-center flex-shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130">
            {/* Track */}
            <circle
              cx="65" cy="65" r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="65" cy="65" r={RADIUS}
              fill="none"
              stroke="#f0c040"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="ring-circle"
            />
            <text x="65" y="62" textAnchor="middle" fill="#f0c040" fontSize="20" fontWeight="800">
              {Math.round(pct)}%
            </text>
            <text x="65" y="78" textAnchor="middle" fill="#6b7280" fontSize="10">
              funded
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
