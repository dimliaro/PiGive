export default function ProgressBar({ current, goal, glowing }) {
  const pct = Math.min(100, Math.round((current / goal) * 100))
  const isGlowing = glowing ?? pct >= 85

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>
          <span className="text-yellow-400 font-bold">π {current.toFixed(1)}</span> raised
        </span>
        <span><span className="text-white font-semibold">{pct}%</span> of π {goal}</span>
      </div>
      <div className="w-full bg-gray-800/60 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
            isGlowing
              ? 'bg-gradient-to-r from-yellow-400 to-amber-300 progress-glow'
              : 'bg-yellow-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
