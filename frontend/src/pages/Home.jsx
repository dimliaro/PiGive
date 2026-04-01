import { useState, useEffect } from 'react'
import CampaignCard from '../components/CampaignCard'
import FeaturedHero from '../components/FeaturedHero'
import QuickDonateModal from '../components/QuickDonateModal'
import { getCampaigns } from '../api/client'

const CATEGORIES = [
  { value: '',             label: 'All' },
  { value: 'school',       label: '🏫 Schools' },
  { value: 'animal',       label: '🐾 Animal Welfare' },
  { value: 'sports',       label: '⚽ Sports' },
  { value: 'neighborhood', label: '🏘️ Neighborhood' },
  { value: 'other',        label: '💛 Other' },
]

const now = Date.now()
const MOCK_CAMPAIGNS = [
  {
    _id: '1',
    title: 'School Supplies for Kifisia Primary School',
    description: 'We need pencils, notebooks and art supplies for 120 students. Every donation counts!',
    category: 'school', goal: 200, raised: 172, donorCount: 344,
    deadline: new Date(now + 12 * 86400000).toISOString(),
    createdAt: new Date(now - 5 * 86400000).toISOString(),
  },
  {
    _id: '2',
    title: 'Food for Stray Animals in Athens',
    description: 'Our association cares for 80+ stray animals. We need food supplies for this month.',
    category: 'animal', goal: 150, raised: 97.5, donorCount: 195,
    deadline: new Date(now + 2 * 86400000).toISOString(),
    createdAt: new Date(now - 10 * 86400000).toISOString(),
  },
  {
    _id: '3',
    title: 'New Jerseys for Peristeri Youth Football Academy',
    description: 'Our kids (ages 8–12) need new jerseys for the local championship season.',
    category: 'sports', goal: 100, raised: 23, donorCount: 46,
    deadline: new Date(now + 20 * 86400000).toISOString(),
    createdAt: new Date(now - 2 * 3600000).toISOString(), // new today
  },
  {
    _id: '4',
    title: 'New Benches for Exarchia Square',
    description: "Our square lacks enough seating. Together we can improve our neighborhood.",
    category: 'neighborhood', goal: 300, raised: 78, donorCount: 156,
    deadline: new Date(now + 30 * 86400000).toISOString(),
    createdAt: new Date(now - 8 * 86400000).toISOString(),
  },
  {
    _id: '5',
    title: 'Community Library Book Drive — Piraeus',
    description: 'Help us restock the shelves of our community library with new books for all ages.',
    category: 'neighborhood', goal: 80, raised: 71, donorCount: 142,
    deadline: new Date(now + 4 * 86400000).toISOString(),
    createdAt: new Date(now - 15 * 86400000).toISOString(),
  },
  {
    _id: '6',
    title: 'Rescue Shelter Winter Equipment',
    description: 'Our animal shelter needs heating equipment for the winter. 40 rescued animals need warmth.',
    category: 'animal', goal: 120, raised: 34, donorCount: 68,
    deadline: new Date(now + 22 * 86400000).toISOString(),
    createdAt: new Date(now - 1 * 3600000).toISOString(), // new today
  },
]

export default function Home() {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [quickDonateCampaign, setQuickDonateCampaign] = useState(null)

  useEffect(() => {
    getCampaigns()
      .then(setCampaigns)
      .catch(() => setCampaigns(MOCK_CAMPAIGNS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter ? campaigns.filter(c => c.category === filter) : campaigns

  // Featured = highest funded % that isn't ended
  const featured = [...filtered]
    .filter(c => new Date(c.deadline) > Date.now())
    .sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal))[0] || null

  const rest = filtered.filter(c => c._id !== featured?._id)

  function handleQuickDonateSuccess(amount) {
    if (!quickDonateCampaign) return
    setCampaigns(prev => prev.map(c =>
      c._id === quickDonateCampaign._id
        ? { ...c, raised: +(c.raised + amount).toFixed(2), donorCount: c.donorCount + 1 }
        : c
    ))
  }

  return (
    <div className="pb-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black mb-3 tracking-tight flex items-center justify-center gap-3">
          <span
            style={{ fontFamily: "'Cinzel', serif", fontSize: '3.5rem', lineHeight: 1 }}
            className="text-yellow-400 drop-shadow-[0_0_16px_rgba(240,192,64,0.7)]"
          >
            π
          </span>
          Pi<span className="text-yellow-400">Give</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Micro-donations for local social causes.<br />
          <span className="text-white font-semibold">No fees. No banks. 100% on-chain.</span>
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <span className="text-gray-500">⚡ Zero fees</span>
          <span className="text-gray-500">🔗 Blockchain transparency</span>
          <span className="text-gray-500">📍 Hyper-local</span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              filter === cat.value
                ? 'bg-yellow-400 text-gray-900 border-yellow-400 shadow-gold-glow'
                : 'border-white/[0.08] bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured hero */}
      {!loading && featured && (
        <FeaturedHero campaign={featured} onQuickDonate={setQuickDonateCampaign} />
      )}

      {/* Campaign grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : rest.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No campaigns found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map(c => (
            <CampaignCard key={c._id} campaign={c} onQuickDonate={setQuickDonateCampaign} />
          ))}
        </div>
      )}

      {/* Quick donate modal */}
      <QuickDonateModal
        campaign={quickDonateCampaign}
        onClose={() => setQuickDonateCampaign(null)}
        onSuccess={handleQuickDonateSuccess}
      />
    </div>
  )
}
