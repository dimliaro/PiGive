import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCampaign, getDonors } from '../api/client'
import { useConfetti } from '../context/AppContext'

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500',
  'bg-emerald-500', 'bg-blue-500', 'bg-pink-500', 'bg-indigo-500',
]

export default function CampaignFunded() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const { triggerConfetti } = useConfetti()

  useEffect(() => {
    Promise.all([
      getCampaign(id).catch(() => null),
      getDonors(id).catch(() => []),
    ]).then(([c, d]) => {
      setCampaign(c)
      setDonors(d)
      // Fire confetti on load
      setTimeout(triggerConfetti, 400)
    }).finally(() => setLoading(false))
  }, [id])

  function handleShare() {
    const text = `🎉 "${campaign.title}" just reached its goal on Rippl! π${campaign.raised} raised by ${campaign.donorCount} Pioneers.`
    if (navigator.share) {
      navigator.share({ title: campaign.title, text, url: window.location.href })
    } else {
      navigator.clipboard.writeText(`${text}\n${window.location.origin}/campaign/${id}`)
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-16">Loading...</div>
  if (!campaign) return (
    <div className="text-center py-12">
      <Link to="/" className="text-yellow-400 hover:underline">← Back to campaigns</Link>
    </div>
  )

  const pct = Math.round((campaign.raised / campaign.goal) * 100)
  const donorsWithMessages = donors.filter(d => d.donorMessage?.trim())
  const completedDate = donors.length > 0
    ? new Date(donors[donors.length - 1]?.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="max-w-2xl mx-auto pb-16">
      {/* Back */}
      <Link to={`/campaign/${id}`} className="text-gray-500 hover:text-white text-sm mb-8 inline-block">
        ← Back to campaign
      </Link>

      {/* Hero celebration banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 text-center">
        {campaign.imageUrl && (
          <>
            <img src={campaign.imageUrl} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
          </>
        )}
        <div className={`relative px-6 py-12 ${!campaign.imageUrl ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/20' : ''}`}>
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
            Goal Reached!
          </h1>
          <p className="text-yellow-400 font-bold text-xl mb-1">{campaign.title}</p>
          {completedDate && (
            <p className="text-gray-400 text-sm">Funded on {completedDate}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card text-center py-5">
          <p className="text-yellow-400 font-extrabold text-2xl">π {campaign.raised}</p>
          <p className="text-gray-500 text-xs mt-1">Total Raised</p>
        </div>
        <div className="card text-center py-5">
          <p className="text-yellow-400 font-extrabold text-2xl">{campaign.donorCount}</p>
          <p className="text-gray-500 text-xs mt-1">Pioneers</p>
        </div>
        <div className="card text-center py-5">
          <p className="text-yellow-400 font-extrabold text-2xl">{pct}%</p>
          <p className="text-gray-500 text-xs mt-1">of Goal</p>
        </div>
      </div>

      {/* Donor wall — large avatars */}
      {donors.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-bold text-white text-lg mb-4">
            🙌 The Pioneers who made it happen
          </h2>
          <div className="flex flex-wrap gap-3 mb-3">
            {donors.slice(0, 24).map((d, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm`}
                title={d.donorUsername ? `@${d.donorUsername} · π${d.amount}` : `π${d.amount}`}
              >
                {d.donorUsername ? d.donorUsername[0].toUpperCase() : '?'}
              </div>
            ))}
            {donors.length > 24 && (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs font-bold">
                +{donors.length - 24}
              </div>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {donors.length} Pioneer{donors.length !== 1 ? 's' : ''} donated a total of{' '}
            <span className="text-yellow-400 font-semibold">π {campaign.raised}</span>
          </p>
        </div>
      )}

      {/* Donor messages */}
      {donorsWithMessages.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-bold text-white text-lg mb-4">💬 What supporters said</h2>
          <div className="space-y-3">
            {donorsWithMessages.slice(0, 6).map((d, i) => (
              <div key={i} className="bg-white/[0.04] rounded-xl px-4 py-3 border border-white/[0.06]">
                <p className="text-gray-300 text-sm italic">"{d.donorMessage}"</p>
                <p className="text-xs text-gray-600 mt-1.5">
                  — {d.donorUsername ? `@${d.donorUsername}` : 'Anonymous Pioneer'} · π{d.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creator updates */}
      {campaign.updates?.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-bold text-white text-lg mb-4">📣 From the organizer</h2>
          <div className="space-y-3">
            {[...campaign.updates].reverse().map((u, i) => (
              <div key={i} className="bg-white/[0.04] rounded-xl px-4 py-3 border border-white/[0.06]">
                <p className="text-gray-300 text-sm leading-relaxed">{u.text}</p>
                <p className="text-xs text-gray-600 mt-1.5">
                  {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share CTA */}
      <div className="card text-center py-8">
        <p className="text-white font-bold text-lg mb-1">Spread the word 🌍</p>
        <p className="text-gray-500 text-sm mb-5">
          Share this win and inspire more Pioneers to give locally.
        </p>
        <button
          onClick={handleShare}
          className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
        >
          🔗 Share this campaign
        </button>
      </div>
    </div>
  )
}
