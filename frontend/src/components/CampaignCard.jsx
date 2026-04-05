import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar'

const CATEGORY_EMOJI = {
  school: '🏫', animal: '🐾', sports: '⚽', neighborhood: '🏘️', other: '💛',
}

const CATEGORY_LABELS = {
  school: 'Schools', animal: 'Animal Welfare', sports: 'Sports',
  neighborhood: 'Neighborhood', other: 'Other',
}

function UrgencyBadge({ daysLeft, pct, isNew }) {
  if (pct >= 100) {
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400">🎉 FUNDED!</span>
  }
  if (daysLeft <= 3 && daysLeft > 0) {
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full badge-ending">🔥 ENDING SOON</span>
  }
  if (pct >= 85) {
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full badge-funded">⚡ ALMOST FUNDED</span>
  }
  if (isNew) {
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full badge-new">✨ NEW</span>
  }
  return null
}

function shareCampaign(id, title) {
  const url = `${window.location.origin}/campaign/${id}`
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {})
  } else {
    navigator.clipboard.writeText(url).catch(() => {})
  }
}

export default function CampaignCard({ campaign, onQuickDonate }) {
  const { _id, title, description, category, goal, raised, donorCount, deadline, createdAt, imageUrl } = campaign

  const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - Date.now()) / 86400000))
  const pct      = Math.min(100, Math.round((raised / goal) * 100))
  const isNew    = createdAt ? (Date.now() - new Date(createdAt)) < 48 * 3600000 : false
  const isFunded = pct >= 100

  return (
    <div className={`card card-glow group flex flex-col gap-3 cursor-default hover:-translate-y-1 transition-transform duration-200 ${isFunded ? 'border-green-500/30' : ''}`}>

      {/* Image */}
      {imageUrl && (
        <div className="-mx-5 -mt-5 mb-1 overflow-hidden rounded-t-2xl h-36">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" onError={e => e.target.parentElement.style.display = 'none'} />
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400">
          {CATEGORY_EMOJI[category]} {CATEGORY_LABELS[category]}
        </span>
        <UrgencyBadge daysLeft={daysLeft} pct={pct} isNew={isNew} />
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-bold text-base text-white leading-snug line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
      </div>

      {/* Progress */}
      <ProgressBar current={raised} goal={goal} />

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>👥 {donorCount.toLocaleString()} donors</span>
        <span>{daysLeft > 0 ? `⏳ ${daysLeft}d left` : '🔒 Ended'}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
        {!isFunded && (
          <button
            onClick={() => onQuickDonate && onQuickDonate(campaign)}
            className="btn-gold flex-1 text-gray-900 font-bold py-2 rounded-xl text-sm"
          >
            Quick Donate π
          </button>
        )}
        <Link
          to={`/campaign/${_id}`}
          className="flex-1 px-4 py-2 rounded-xl text-sm text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-colors text-center"
          onClick={e => e.stopPropagation()}
        >
          Details →
        </Link>
        <button
          onClick={() => shareCampaign(_id, title)}
          className="px-3 py-2 rounded-xl text-sm text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
          title="Share"
        >
          🔗
        </button>
      </div>
    </div>
  )
}
