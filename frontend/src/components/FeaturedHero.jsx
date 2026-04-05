import { Link } from 'react-router-dom'

const CATEGORY_BG = {
  school:       'from-blue-950 via-blue-900 to-indigo-900',
  animal:       'from-emerald-950 via-emerald-900 to-teal-900',
  sports:       'from-orange-950 via-orange-900 to-amber-900',
  neighborhood: 'from-violet-950 via-violet-900 to-purple-900',
  other:        'from-yellow-950 via-yellow-900 to-amber-900',
}

const CATEGORY_EMOJI = {
  school: '🏫', animal: '🐾', sports: '⚽', neighborhood: '🏘️', other: '💛',
}

export default function FeaturedHero({ campaign, onQuickDonate }) {
  if (!campaign) return null

  const pct      = Math.min(100, (campaign.raised / campaign.goal) * 100)
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - Date.now()) / 86400000))
  const bgClass  = CATEGORY_BG[campaign.category] || CATEGORY_BG.other
  const emoji    = CATEGORY_EMOJI[campaign.category] || '💛'

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 h-[400px] sm:h-[460px] group">

      {/* Background — image or gradient */}
      {campaign.imageUrl ? (
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={e => e.target.style.display = 'none'}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${bgClass}`} />
      )}

      {/* Gradient overlay — bottom-heavy for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

      {/* Top badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400 text-gray-900">
          ⭐ FEATURED
        </span>
        <span className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
          {emoji} {campaign.category}
        </span>
      </div>

      {/* Content pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow">
          {campaign.title}
        </h2>

        <p className="text-gray-300 text-sm mb-5 line-clamp-2 max-w-lg leading-relaxed">
          {campaign.description}
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className="text-white font-semibold">π {campaign.raised} raised</span>
            <span>{Math.round(pct)}% of π {campaign.goal}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-4 text-xs text-gray-400">
            <span>👥 {campaign.donorCount.toLocaleString()} donors</span>
            <span>{daysLeft > 0 ? `⏳ ${daysLeft} days left` : '🔒 Ended'}</span>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onQuickDonate(campaign)}
              className="bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-300 transition-colors"
            >
              Donate π
            </button>
            <Link
              to={`/campaign/${campaign._id}`}
              className="text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2.5 rounded-xl transition-colors backdrop-blur-sm"
            >
              Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
