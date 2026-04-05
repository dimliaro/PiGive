import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCampaign, editCampaign } from '../api/client'

export default function EditCampaign() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ description: '', imageUrl: '', extraDays: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [creatorUid, setCreatorUid] = useState('')

  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['username'], () => {})
        .then(r => setCreatorUid(r?.user?.uid || ''))
        .catch(() => {})
    }
    getCampaign(id)
      .then(c => {
        setCampaign(c)
        setForm({ description: c.description, imageUrl: c.imageUrl || '', extraDays: '' })
      })
      .catch(() => navigate('/my-campaigns'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      await editCampaign(id, {
        creatorPiUid: creatorUid,
        description: form.description,
        imageUrl: form.imageUrl,
        extraDays: form.extraDays ? parseInt(form.extraDays) : undefined,
      })
      navigate(`/campaign/${id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed.')
      setStatus('error')
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-12">Loading...</div>
  if (!campaign) return null

  return (
    <div className="max-w-xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/campaign/${id}`} className="text-gray-500 hover:text-white text-sm transition-colors">← Back</Link>
        <h1 className="text-2xl font-extrabold text-white">Edit Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <p className="text-sm text-gray-500 mb-1">Title <span className="text-gray-600">(cannot be changed)</span></p>
          <p className="text-white font-semibold">{campaign.title}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={4}
            maxLength={500}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none"
          />
          <p className="text-xs text-gray-600 text-right mt-1">{form.description.length}/500</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Image URL</label>
          <input
            value={form.imageUrl}
            onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" className="mt-2 w-full h-36 object-cover rounded-xl opacity-80" onError={e => e.target.style.display = 'none'} />
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Extend deadline by (days) <span className="text-gray-600">optional, max 30</span></label>
          <input
            type="number"
            value={form.extraDays}
            onChange={e => setForm(p => ({ ...p, extraDays: e.target.value }))}
            min="1"
            max="30"
            placeholder="e.g. 7"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
