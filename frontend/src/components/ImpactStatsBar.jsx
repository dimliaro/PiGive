import { useEffect, useRef, useState } from 'react'
import { useGlobalStats } from '../context/AppContext'

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const prev = useRef(0)
  const raf  = useRef(null)

  useEffect(() => {
    const start  = prev.current
    const delta  = target - start
    const t0     = performance.now()

    const tick = (now) => {
      const elapsed = now - t0
      const p = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(+(start + delta * eased).toFixed(1))
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else prev.current = target
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

export default function ImpactStatsBar() {
  const stats = useGlobalStats()
  const raised    = useCountUp(stats.totalRaised, 1400)
  const donors    = useCountUp(stats.totalDonors, 1200)
  const campaigns = useCountUp(stats.totalCampaigns, 900)

  return (
    <div className="w-full px-4 mb-6">
      <div className="max-w-6xl mx-auto">
        <div className="card hero-shimmer grid grid-cols-3 gap-0 text-center py-3"
             style={{ padding: '0.75rem 1rem' }}>
          <Stat value={`π ${raised.toLocaleString()}`} label="Total Raised" />
          <Stat value={donors.toLocaleString()} label="Pioneers Donated" divider />
          <Stat value={campaigns} label="Active Campaigns" divider />
        </div>
      </div>
    </div>
  )
}

function Stat({ value, label, divider }) {
  return (
    <div className={`flex flex-col items-center justify-center ${divider ? 'border-l border-white/[0.06]' : ''}`}>
      <span className="text-yellow-400 font-extrabold text-lg leading-tight">{value}</span>
      <span className="text-gray-500 text-xs mt-0.5">{label}</span>
    </div>
  )
}
