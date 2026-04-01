import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// --- Campaigns ---

export const getCampaigns = () => api.get('/campaigns').then(r => {
  if (!Array.isArray(r.data)) throw new Error('Invalid response')
  return r.data
})

export const getCampaign = (id) => api.get(`/campaigns/${id}`).then(r => r.data)

export const createCampaign = (data) => api.post('/campaigns', data).then(r => r.data)

// --- Pi Payments ---

export const approvePayment = (paymentId) =>
  api.post('/payments/approve', { paymentId }).then(r => r.data)

export const completePayment = (paymentId, txid, campaignId) =>
  api.post('/payments/complete', { paymentId, txid, campaignId }).then(r => r.data)
