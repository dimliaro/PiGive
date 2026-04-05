import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCampaign } from '../api/client'
import ProgressBar from '../components/ProgressBar'

function getMyCampaignIds() {
  try { return JSON.parse(localStorage.getItem('my_campaign_ids') || '[]') } catch { return [] }
}

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = getMyCampaignIds()
    if (ids.length === 0) { setLoading(false); return }

    Promise.allSettled(ids.map(id => getCampaign(id)))
      .then(results => {
        setCampaigns(results.filter(r => r.status === 'fulfilled').map(r => r.value))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center text-gray-500 py-12">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">My Campaigns</h1>
        <Link to="/create" className="btn-glow text-white text-sm font-semibold px-4 py-2 rounded-xl">
          + New
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 mb-4">You haven't created any campaigns yet.</p>
          <Link to="/create" className="text-yellow-400 hover:underline font-semibold">
            Create your first campaign →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map(c => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100))
            const daysLeft = Math.max(0, Math.ceil((new Date(c.deadline) - Date.now()) / 86400000))
            return (
              <div key={c._id} className="card">
                {c.imageUrl && (
                  <div className="-mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl h-32">
                    <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" onError={e => e.target.parentElement.style.display = 'none'} />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-bold text-white leading-snug">{c.title}</h2>
                  {pct >= 100
                    ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 shrink-0">🎉 Funded!</span>
                    : <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400 shrink-0">{daysLeft > 0 ? `${daysLeft}d left` : 'Ended'}</span>
                  }
                </div>
                <ProgressBar current={c.raised} goal={c.goal} />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">👥 {c.donorCount} donors</span>
                  <Link to={`/campaign/${c._id}`} className="text-xs text-yellow-400 hover:underline">
                    View campaign →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
