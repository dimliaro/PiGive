import { useState, useEffect } from 'react'
import CampaignCard from '../components/CampaignCard'
import FeaturedHero from '../components/FeaturedHero'
import QuickDonateModal from '../components/QuickDonateModal'
import { getCampaigns, getLocalCampaigns } from '../api/client'
import { useGlobalStats } from '../context/AppContext'

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
  const [search, setSearch] = useState('')
  const [smartFilter, setSmartFilter] = useState('')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(false)
  const [quickDonateCampaign, setQuickDonateCampaign] = useState(null)
  const { setCampaignCount } = useGlobalStats()

  useEffect(() => {
    getCampaigns()
      .then(data => { setCampaigns(data); setCampaignCount(data.filter(c => new Date(c.deadline) > Date.now()).length) })
      .catch(() => setCampaigns([...getLocalCampaigns(), ...MOCK_CAMPAIGNS]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = campaigns.filter(c => {
    if (filter && c.category !== filter) return false
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false
    if (smartFilter === 'new') return c.createdAt && (Date.now() - new Date(c.createdAt)) < 48 * 3600000
    if (smartFilter === 'almost') return (c.raised / c.goal) >= 0.85
    return true
  }).sort((a, b) => {
    if (sort === 'funded') return (b.raised / b.goal) - (a.raised / a.goal)
    if (sort === 'ending') return new Date(a.deadline) - new Date(b.deadline)
    return new Date(b.createdAt) - new Date(a.createdAt) // newest
  })

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
          <span>Rip<span className="text-yellow-400">pl</span></span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Micro-donations for local social causes.<br />
          <span className="text-white font-semibold">0.01π network fee. No banks. 100% on-chain.</span>
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <span className="text-gray-500">⚡ 0.01π fee</span>
          <span className="text-gray-500">🔗 Blockchain transparency</span>
          <span className="text-gray-500">📍 Hyper-local</span>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="🔍 Search campaigns..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 text-sm"
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2.5 text-gray-400 focus:outline-none focus:border-yellow-400/50 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="funded">Most Funded</option>
          <option value="ending">Ending Soon</option>
        </select>
      </div>

      {/* Smart filters */}
      <div className="flex gap-2 mb-3">
        {[
          { key: '', label: '⭐ All' },
          { key: 'new', label: '✨ New' },
          { key: 'almost', label: '⚡ Almost Funded' },
        ].map(sf => (
          <button
            key={sf.key}
            onClick={() => setSmartFilter(sf.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              smartFilter === sf.key
                ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                : 'border-white/[0.08] bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white'
            }`}
          >
            {sf.label}
          </button>
        ))}
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
