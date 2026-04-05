import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCampaign, getDonors, postCampaignUpdate } from '../api/client'
import ProgressBar from '../components/ProgressBar'
import DonateButton from '../components/DonateButton'
import DonorAvatarWall from '../components/DonorAvatarWall'
import { useDonationFeed, useConfetti } from '../context/AppContext'

const now = Date.now()
const MOCK = {
  '1': {
    _id: '1',
    title: 'School Supplies for Kifisia Primary School',
    description: 'We need pencils, notebooks and art supplies for 120 students. Every donation counts! Our school has no budget for basic supplies this year and the parents association is stepping up to make a difference.',
    category: 'school', goal: 200, raised: 172, donorCount: 344,
    deadline: new Date(now + 12 * 86400000).toISOString(),
    organizer: 'Parents & Guardians Association',
  },
  '2': {
    _id: '2', title: 'Food for Stray Animals in Athens',
    description: 'Our association cares for 80+ stray animals. We need food supplies for this month.',
    category: 'animal', goal: 150, raised: 97.5, donorCount: 195,
    deadline: new Date(now + 2 * 86400000).toISOString(),
    organizer: 'Athens Animal Welfare Society',
  },
}

export default function CampaignDetail() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [updateText, setUpdateText] = useState('')
  const [postingUpdate, setPostingUpdate] = useState(false)
  const [creatorUid, setCreatorUid] = useState('')
  const { pushDonation } = useDonationFeed()
  const { triggerConfetti } = useConfetti()

  useEffect(() => {
    // Try to get current user's Pi UID to check if they're the creator
    if (window.Pi) {
      window.Pi.authenticate(['username'], () => {})
        .then(r => setCreatorUid(r?.user?.uid || ''))
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    getCampaign(id)
      .then(setCampaign)
      .catch(() => setCampaign(MOCK[id] || null))
      .finally(() => setLoading(false))

    // Fetch real donors (non-critical — silently ignore failures)
    getDonors(id).then(setDonors).catch(() => {})
  }, [id])

  function handleDonationSuccess(amount, donorUsername) {
    setCampaign(prev => ({
      ...prev,
      raised: +(prev.raised + amount).toFixed(2),
      donorCount: prev.donorCount + 1,
    }))
    if (donorUsername) {
      setDonors(prev => [{ donorUsername, amount, createdAt: new Date().toISOString() }, ...prev])
    }
    pushDonation(donorUsername || 'you', amount, campaign.title)
    triggerConfetti()
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handlePostUpdate(e) {
    e.preventDefault()
    if (!updateText.trim()) return
    setPostingUpdate(true)
    try {
      const update = await postCampaignUpdate(id, updateText, creatorUid)
      setCampaign(prev => ({ ...prev, updates: [...(prev.updates || []), update] }))
      setUpdateText('')
    } catch {
      // silently fail
    } finally {
      setPostingUpdate(false)
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-12">Loading...</div>
  if (!campaign) return (
    <div className="text-center py-12">
      <p className="text-gray-400 mb-4">Campaign not found.</p>
      <Link to="/" className="text-yellow-400 hover:underline">← Back to campaigns</Link>
    </div>
  )

  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - Date.now()) / 86400000))
  const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
  const isCreator = campaign.creatorPiUid && creatorUid && campaign.creatorPiUid === creatorUid
  const isVerified = !!campaign.creatorPiUid

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-gray-500 hover:text-white text-sm transition-colors group">
          <span className="group-hover:-translate-x-1 inline-block transition-transform">←</span> Back
        </Link>
        <button
          onClick={handleShare}
          className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-colors"
        >
          {copied ? '✓ Copied!' : '🔗 Share'}
        </button>
      </div>

      {campaign.imageUrl && (
        <div className="mb-5 overflow-hidden rounded-2xl h-48">
          <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" onError={e => e.target.parentElement.style.display = 'none'} />
        </div>
      )}

      <div className="card mb-5">
        <h1 className="text-2xl font-extrabold text-white mb-2 leading-snug">{campaign.title}</h1>

        {campaign.organizer && (
          <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
            Organized by <span className="text-gray-300 font-medium">{campaign.organizer}</span>
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
                ✓ Verified Pioneer
              </span>
            )}
          </p>
        )}

        <p className="text-gray-300 mb-6 leading-relaxed">{campaign.description}</p>

        <ProgressBar current={campaign.raised} goal={campaign.goal} />

        <div className="flex gap-5 mt-4 text-sm text-gray-500">
          <span>👥 {campaign.donorCount.toLocaleString()} donors</span>
          <span>{daysLeft > 0 ? `⏳ ${daysLeft} days left` : '🔒 Ended'}</span>
          <span>📊 {pct}% funded</span>
        </div>

        <DonorAvatarWall donorCount={campaign.donorCount} donors={donors} />
      </div>

      {daysLeft > 0 ? (
        <div className="card mb-5">
          <h2 className="font-bold text-lg mb-4 text-white">Donate with Pi</h2>
          <DonateButton campaign={campaign} onSuccess={handleDonationSuccess} />
        </div>
      ) : (
        <div className="card text-center text-gray-500 py-6 mb-5">
          This campaign has ended. Thank you to all {campaign.donorCount} donors! 🎉
        </div>
      )}

      {/* Campaign Updates */}
      {((campaign.updates && campaign.updates.length > 0) || isCreator) && (
        <div className="card">
          <h2 className="font-bold text-lg mb-4 text-white">Updates</h2>

          {isCreator && (
            <form onSubmit={handlePostUpdate} className="mb-4">
              <textarea
                value={updateText}
                onChange={e => setUpdateText(e.target.value)}
                placeholder="Share a progress update with your donors..."
                rows={2}
                maxLength={300}
                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 text-sm resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">{updateText.length}/300</span>
                <button
                  type="submit"
                  disabled={postingUpdate || !updateText.trim()}
                  className="text-sm bg-yellow-400 text-gray-900 font-semibold px-4 py-1.5 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
                >
                  {postingUpdate ? 'Posting...' : 'Post Update'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {[...(campaign.updates || [])].reverse().map((u, i) => (
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
    </div>
  )
}
