import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCampaign, deleteCampaign } from '../api/client'
import ProgressBar from '../components/ProgressBar'

function getMyCampaignIds() {
  try { return JSON.parse(localStorage.getItem('my_campaign_ids') || '[]') } catch { return [] }
}

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [creatorUid, setCreatorUid] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['username'], () => {})
        .then(r => setCreatorUid(r?.user?.uid || ''))
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    const ids = getMyCampaignIds()
    if (ids.length === 0) { setLoading(false); return }

    Promise.allSettled(ids.map(id => getCampaign(id)))
      .then(results => {
        setCampaigns(results.filter(r => r.status === 'fulfilled').map(r => r.value))
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(campaign) {
    const hasDonors = campaign.donorCount > 0
    const confirmMsg = hasDonors
      ? `This campaign has ${campaign.donorCount} donor(s). It will be archived (hidden from public) — existing Pi donations cannot be refunded. Are you sure?`
      : 'Delete this campaign permanently? This cannot be undone.'
    if (!window.confirm(confirmMsg)) return

    setDeletingId(campaign._id)
    try {
      const result = await deleteCampaign(campaign._id, creatorUid)
      if (result.action === 'deleted') {
        // Remove from local storage
        try {
          const ids = JSON.parse(localStorage.getItem('my_campaign_ids') || '[]')
          localStorage.setItem('my_campaign_ids', JSON.stringify(ids.filter(x => x !== campaign._id)))
        } catch {}
        setCampaigns(prev => prev.filter(c => c._id !== campaign._id))
      } else {
        // Archived — mark it visually
        setCampaigns(prev => prev.map(c =>
          c._id === campaign._id ? { ...c, isActive: false, isApproved: false } : c
        ))
        window.alert(`Campaign archived and hidden from public. Donor records preserved.`)
      }
    } catch {
      window.alert('Could not delete campaign. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-12">Loading...</div>

  const totalRaised = campaigns.reduce((s, c) => s + (c.raised || 0), 0)
  const totalDonors = campaigns.reduce((s, c) => s + (c.donorCount || 0), 0)
  const activeCampaigns = campaigns.filter(c => c.isActive && new Date(c.deadline) > new Date()).length

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
        <>
          {/* Aggregate stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card text-center py-4">
              <p className="text-yellow-400 font-extrabold text-xl">π {totalRaised.toFixed(1)}</p>
              <p className="text-gray-500 text-xs mt-1">Total Raised</p>
            </div>
            <div className="card text-center py-4">
              <p className="text-yellow-400 font-extrabold text-xl">{totalDonors}</p>
              <p className="text-gray-500 text-xs mt-1">Total Donors</p>
            </div>
            <div className="card text-center py-4">
              <p className="text-yellow-400 font-extrabold text-xl">{activeCampaigns}</p>
              <p className="text-gray-500 text-xs mt-1">Active</p>
            </div>
          </div>

          <div className="space-y-4">
            {campaigns.map(c => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100))
              const daysLeft = Math.max(0, Math.ceil((new Date(c.deadline) - Date.now()) / 86400000))
              const isActive = c.isActive && daysLeft > 0

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
                      : !isActive
                        ? <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-500 shrink-0">Ended</span>
                        : <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400 shrink-0">{daysLeft}d left</span>
                    }
                  </div>
                  <ProgressBar current={c.raised} goal={c.goal} />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">👥 {c.donorCount} donors · π {c.raised} raised</span>
                    <div className="flex gap-3 items-center">
                      {isActive && (
                        <Link to={`/campaign/${c._id}/edit`} className="text-xs text-gray-500 hover:text-yellow-400 transition-colors">
                          ✏️ Edit
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c._id}
                        className="text-xs text-red-600 hover:text-red-400 transition-colors disabled:opacity-50"
                        title={c.donorCount > 0 ? 'Archive campaign' : 'Delete campaign'}
                      >
                        {deletingId === c._id ? '…' : c.donorCount > 0 ? '🗄️' : '🗑️'}
                      </button>
                      <Link to={`/campaign/${c._id}`} className="text-xs text-yellow-400 hover:underline">
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
