const AVATAR_COLORS = [
  'bg-violet-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500',
  'bg-emerald-500', 'bg-blue-500', 'bg-pink-500', 'bg-indigo-500',
]

function getInitial(username) {
  if (username && username.trim()) return username.trim()[0].toUpperCase()
  return '?'
}

export default function DonorAvatarWall({ donorCount, donors = [], maxVisible = 12 }) {
  if (!donorCount) return null

  const visible = Math.min(donorCount, maxVisible)
  const remainder = donorCount - visible

  return (
    <div className="mt-4">
      <div className="flex items-center">
        {Array.from({ length: visible }, (_, i) => {
          const donor = donors[i]
          const label = donor?.donorUsername ? donor.donorUsername : `Pioneer ${i + 1}`
          const initial = donor?.donorUsername ? getInitial(donor.donorUsername) : '?'
          return (
            <div
              key={i}
              className={`donor-avatar ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white`}
              style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: visible - i }}
              title={label}
            >
              {initial}
            </div>
          )
        })}
        {remainder > 0 && (
          <div
            className="donor-avatar text-gray-300"
            style={{ marginLeft: '-10px', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', zIndex: 0 }}
          >
            +{remainder > 99 ? '99' : remainder}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        <span className="text-white font-semibold">{donorCount.toLocaleString()}</span> Pioneers have supported this cause
      </p>
    </div>
  )
}
