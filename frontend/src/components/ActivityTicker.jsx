import { useDonationFeed } from '../context/AppContext'

export default function ActivityTicker() {
  const { recentDonations } = useDonationFeed()

  if (recentDonations.length === 0) return null

  const items = [...recentDonations, ...recentDonations] // double for seamless loop

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden" style={{ height: '36px', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(90deg, #08080f 0%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(270deg, #08080f 0%, transparent 100%)' }} />

      <div className="h-full flex items-center"
           style={{ background: 'rgba(8,8,15,0.85)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="ticker-inner"
          key={recentDonations.length} /* restarts animation when new donation arrives */
        >
          {items.map((d, i) => (
            <span key={`${d.id}-${i}`} className="flex items-center gap-1 px-6 text-xs text-gray-400">
              <span className="text-yellow-400 font-semibold">@{d.donor}</span>
              <span>donated</span>
              <span className="text-yellow-400 font-bold">π {d.amount}</span>
              <span>to</span>
              <span className="text-white">"{d.campaign}"</span>
              <span className="text-gray-700 mx-3">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
