import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCampaign } from '../api/client'
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
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { pushDonation } = useDonationFeed()
  const { triggerConfetti } = useConfetti()

  useEffect(() => {
    getCampaign(id)
      .then(setCampaign)
      .catch(() => setCampaign(MOCK[id] || null))
      .finally(() => setLoading(false))
  }, [id])

  function handleDonationSuccess(amount) {
    setCampaign(prev => ({
      ...prev,
      raised: +(prev.raised + amount).toFixed(2),
      donorCount: prev.donorCount + 1,
    }))
    pushDonation('you', amount, campaign.title)
    triggerConfetti()
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
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

      <div className="card mb-5">
        <h1 className="text-2xl font-extrabold text-white mb-2 leading-snug">{campaign.title}</h1>

        {campaign.organizer && (
          <p className="text-sm text-gray-500 mb-4">
            Organized by <span className="text-gray-300 font-medium">{campaign.organizer}</span>
          </p>
        )}

        <p className="text-gray-300 mb-6 leading-relaxed">{campaign.description}</p>

        <ProgressBar current={campaign.raised} goal={campaign.goal} />

        <div className="flex gap-5 mt-4 text-sm text-gray-500">
          <span>👥 {campaign.donorCount.toLocaleString()} donors</span>
          <span>{daysLeft > 0 ? `⏳ ${daysLeft} days left` : '🔒 Ended'}</span>
          <span>📊 {pct}% funded</span>
        </div>

        <DonorAvatarWall donorCount={campaign.donorCount} />
      </div>

      {daysLeft > 0 ? (
        <div className="card">
          <h2 className="font-bold text-lg mb-4 text-white">Donate with Pi</h2>
          <DonateButton campaign={campaign} onSuccess={handleDonationSuccess} />
        </div>
      ) : (
        <div className="card text-center text-gray-500 py-6">
          This campaign has ended. Thank you to all {campaign.donorCount} donors! 🎉
        </div>
      )}
    </div>
  )
}
