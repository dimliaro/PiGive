import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// --- Local campaign storage (fallback when backend is offline) ---

export function getLocalCampaigns() {
  try {
    return JSON.parse(localStorage.getItem('rippl_campaigns') || '[]')
  } catch {
    return []
  }
}

function saveLocalCampaign(campaign) {
  const existing = getLocalCampaigns()
  existing.unshift(campaign)
  localStorage.setItem('rippl_campaigns', JSON.stringify(existing.slice(0, 50)))
}

// --- Campaigns ---

export const getCampaigns = () => api.get('/campaigns').then(r => {
  if (!Array.isArray(r.data)) throw new Error('Invalid response')
  return [...getLocalCampaigns(), ...r.data]
})

export const getCampaign = (id) => {
  // Check local storage first
  const local = getLocalCampaigns().find(c => c._id === id)
  if (local) return Promise.resolve(local)
  return api.get(`/campaigns/${id}`).then(r => r.data)
}

export const createCampaign = async (data) => {
  try {
    return await api.post('/campaigns', data).then(r => r.data)
  } catch {
    // Backend unavailable — store locally
    const campaign = {
      _id: 'local_' + Date.now(),
      ...data,
      raised: 0,
      donorCount: 0,
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + (data.durationDays || 30) * 86400000).toISOString(),
    }
    saveLocalCampaign(campaign)
    return campaign
  }
}

// --- Pi Payments ---

export const approvePayment = (paymentId) =>
  api.post('/payments/approve', { paymentId }).then(r => r.data)

export const completePayment = (paymentId, txid, campaignId) =>
  api.post('/payments/complete', { paymentId, txid, campaignId }).then(r => r.data)
