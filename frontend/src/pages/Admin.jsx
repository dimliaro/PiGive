import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const api = (password) => axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
})

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [stats, setStats] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [donations, setDonations] = useState([])
  const [tab, setTab] = useState('campaigns')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setAuthError('')
    try {
      const res = await api(password).get('/admin/stats')
      setStats(res.data)
      setAuthed(true)
      loadData()
    } catch {
      setAuthError('Wrong password.')
    }
  }

  async function loadData() {
    setLoading(true)
    try {
      const [c, d] = await Promise.all([
        api(password).get('/admin/campaigns'),
        api(password).get('/admin/donations'),
      ])
      setCampaigns(c.data)
      setDonations(d.data)
    } catch {}
    setLoading(false)
  }

  async function toggleFeature(id) {
    const res = await api(password).patch(`/admin/campaigns/${id}/feature`)
    setCampaigns(prev => prev.map(c => c._id === id ? { ...c, isFeatured: res.data.isFeatured } : c))
  }

  async function toggleActive(id) {
    const res = await api(password).patch(`/admin/campaigns/${id}/toggle`)
    setCampaigns(prev => prev.map(c => c._id === id ? { ...c, isActive: res.data.isActive } : c))
  }

  if (!authed) return (
    <div className="max-w-sm mx-auto pt-16">
      <h1 className="text-2xl font-extrabold text-white mb-2 text-center">Admin Panel</h1>
      <p className="text-gray-500 text-sm text-center mb-6">Rippl internal tools</p>
      <form onSubmit={handleLogin} className="card space-y-4">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />
        {authError && <p className="text-red-400 text-sm">{authError}</p>}
        <button type="submit" className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors">
          Enter
        </button>
      </form>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
        <Link to="/" className="text-xs text-gray-500 hover:text-white">← App</Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Campaigns', value: stats.totalCampaigns },
            { label: 'Active Campaigns', value: stats.activeCampaigns },
            { label: 'Total Raised', value: `π ${(stats.totalRaised || 0).toFixed(1)}` },
            { label: 'Total Donations', value: stats.totalDonations },
          ].map(s => (
            <div key={s.label} className="card text-center py-4">
              <p className="text-yellow-400 font-extrabold text-xl">{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['campaigns', 'donations'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${tab === t ? 'bg-yellow-400 text-gray-900 border-yellow-400' : 'border-white/[0.1] text-gray-400 hover:text-white'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="text-gray-500 text-sm py-4">Loading...</div>}

      {tab === 'campaigns' && !loading && (
        <div className="space-y-3">
          {campaigns.map(c => {
            const pct = Math.round((c.raised / c.goal) * 100)
            const daysLeft = Math.max(0, Math.ceil((new Date(c.deadline) - Date.now()) / 86400000))
            return (
              <div key={c._id} className="card flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm truncate">{c.title}</p>
                    {c.isFeatured && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/30">⭐ Pinned</span>}
                    {!c.isActive && <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/30">Inactive</span>}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">π{c.raised}/{c.goal} · {pct}% · {daysLeft}d left · {c.donorCount} donors</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleFeature(c._id)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-colors">
                    {c.isFeatured ? 'Unpin' : '⭐ Pin'}
                  </button>
                  <button onClick={() => toggleActive(c._id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${c.isActive ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}`}>
                    {c.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'donations' && !loading && (
        <div className="space-y-3">
          {donations.map((d, i) => (
            <div key={i} className="card flex items-center justify-between gap-4">
              <div>
                <p className="text-white text-sm font-semibold">π {d.amount} — @{d.donorUsername || 'Anonymous'}</p>
                {d.donorMessage && <p className="text-gray-500 text-xs mt-0.5 italic">"{d.donorMessage}"</p>}
                <p className="text-gray-600 text-xs mt-0.5">{new Date(d.createdAt).toLocaleString()}</p>
              </div>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">completed</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
