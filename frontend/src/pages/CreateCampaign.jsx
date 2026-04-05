import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCampaign } from '../api/client'

const CATEGORIES = [
  { value: 'school', label: '🏫 Schools' },
  { value: 'animal', label: '🐾 Animal Welfare' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'neighborhood', label: '🏘️ Neighborhood' },
  { value: 'other', label: '💛 Other' },
]

function saveMyCampaignId(id) {
  try {
    const ids = JSON.parse(localStorage.getItem('my_campaign_ids') || '[]')
    if (!ids.includes(id)) ids.unshift(id)
    localStorage.setItem('my_campaign_ids', JSON.stringify(ids.slice(0, 50)))
  } catch {}
}

export default function CreateCampaign() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'school',
    goal: '',
    organizer: '',
    durationDays: 30,
    imageUrl: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.title || !form.description || !form.goal || !form.organizer) {
      setError('Please fill in all required fields.')
      return
    }

    if (parseFloat(form.goal) <= 0) {
      setError('Goal must be a positive number.')
      return
    }

    setStatus('loading')
    try {
      const authResult = window.Pi ? await window.Pi.authenticate(['username'], () => {}).catch(() => null) : null
      const creatorPiUid = authResult?.user?.uid || ''
      const creatorUsername = authResult?.user?.username || ''
      const campaign = await createCampaign({
        ...form,
        goal: parseFloat(form.goal),
        durationDays: parseInt(form.durationDays),
        creatorPiUid,
        creatorUsername,
      })
      saveMyCampaignId(campaign._id)
      navigate(`/campaign/${campaign._id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Creation failed. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-extrabold text-white mb-6">New Campaign</h1>

      <form onSubmit={handleSubmit} className="card space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Title <span className="text-yellow-400">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. School supplies for Kifisia Primary School..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Description <span className="text-yellow-400">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Explain what you need and why..."
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-gray-600 text-right mt-1">{form.description.length}/500</p>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Image URL <span className="text-gray-600">(optional)</span></label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://... paste a photo link"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              className="mt-2 w-full h-36 object-cover rounded-xl opacity-80"
              onError={e => e.target.style.display = 'none'}
            />
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Goal & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Goal (π) <span className="text-yellow-400">*</span>
            </label>
            <input
              name="goal"
              type="number"
              value={form.goal}
              onChange={handleChange}
              placeholder="e.g. 200"
              min="1"
              step="0.5"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Duration (days)</label>
            <input
              name="durationDays"
              type="number"
              value={form.durationDays}
              onChange={handleChange}
              min="1"
              max="90"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Organization Name <span className="text-yellow-400">*</span>
          </label>
          <input
            name="organizer"
            value={form.organizer}
            onChange={handleChange}
            placeholder="e.g. Kifisia Parents Association"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  )
}
