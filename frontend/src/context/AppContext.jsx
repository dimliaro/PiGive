import { createContext, useContext, useState, useCallback } from 'react'

const AppCtx = createContext(null)

const MOCK_NAMES = [
  'pioneer42', 'alice_pi', 'node_runner', 'pi_builder', 'cryptomike',
  'sunflower99', 'delta_user', 'galaxy_pi', 'blockwave', 'pi_curious',
]

const SEED_DONATIONS = [
  { id: 1, donor: 'pioneer42',   amount: 2,   campaign: 'School Supplies for Kifisia' },
  { id: 2, donor: 'alice_pi',    amount: 0.5, campaign: 'Food for Stray Animals in Athens' },
  { id: 3, donor: 'node_runner', amount: 5,   campaign: 'New Benches for Exarchia Square' },
  { id: 4, donor: 'pi_builder',  amount: 1,   campaign: 'Peristeri Youth Football Academy' },
]

export function AppProvider({ children }) {
  const [recentDonations, setRecentDonations] = useState(SEED_DONATIONS)
  const [nextId, setNextId] = useState(100)
  const [globalStats, setGlobalStats] = useState({
    totalRaised:    1284.5,
    totalDonors:    2571,
    totalCampaigns: 0,
  })
  const [confettiActive, setConfettiActive] = useState(false)

  const setCampaignCount = useCallback((count) => {
    setGlobalStats(prev => ({ ...prev, totalCampaigns: count }))
  }, [])

  const pushDonation = useCallback((donor, amount, campaign) => {
    const entry = { id: nextId, donor, amount, campaign }
    setNextId(n => n + 1)
    setRecentDonations(prev => [entry, ...prev].slice(0, 12))
    setGlobalStats(prev => ({
      ...prev,
      totalRaised:  +(prev.totalRaised + amount).toFixed(2),
      totalDonors:  prev.totalDonors + 1,
    }))
  }, [nextId])

  const triggerConfetti = useCallback(() => {
    setConfettiActive(true)
    setTimeout(() => setConfettiActive(false), 3800)
  }, [])

  return (
    <AppCtx.Provider value={{ recentDonations, pushDonation, globalStats, setCampaignCount, confettiActive, triggerConfetti }}>
      {children}
    </AppCtx.Provider>
  )
}

export const useDonationFeed  = () => { const ctx = useContext(AppCtx); return { recentDonations: ctx.recentDonations, pushDonation: ctx.pushDonation } }
export const useGlobalStats   = () => { const ctx = useContext(AppCtx); return { ...ctx.globalStats, setCampaignCount: ctx.setCampaignCount } }
export const useConfetti      = () => { const ctx = useContext(AppCtx); return { confettiActive: ctx.confettiActive, triggerConfetti: ctx.triggerConfetti } }
