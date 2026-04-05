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

export const completePayment = (paymentId, txid, campaignId, amount, donorUsername, donorMessage) =>
  api.post('/payments/complete', { paymentId, txid, campaignId, amount, donorUsername, donorMessage }).then(r => r.data)

export const editCampaign = (id, data) =>
  api.put(`/campaigns/${id}`, data).then(r => r.data)

export const closeCampaign = (id, creatorPiUid) =>
  api.patch(`/campaigns/${id}/close`, { creatorPiUid }).then(r => r.data)

export const getDonationReceipt = (paymentId) =>
  api.get(`/payments/receipt/${paymentId}`).then(r => r.data)

// --- Donors & Updates ---

export const getDonors = (campaignId) =>
  api.get(`/campaigns/${campaignId}/donors`).then(r => r.data)

export const postCampaignUpdate = (campaignId, text, creatorPiUid) =>
  api.post(`/campaigns/${campaignId}/updates`, { text, creatorPiUid }).then(r => r.data)

export const deleteCampaign = (id, creatorPiUid) =>
  api.delete(`/campaigns/${id}`, { data: { creatorPiUid } }).then(r => r.data)
