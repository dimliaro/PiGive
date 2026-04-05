import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ImpactStatsBar from './components/ImpactStatsBar'
import ActivityTicker from './components/ActivityTicker'
import Confetti from './components/Confetti'
import Home from './pages/Home'
import CampaignDetail from './pages/CampaignDetail'
import CreateCampaign from './pages/CreateCampaign'
import MyCampaigns from './pages/MyCampaigns'
import EditCampaign from './pages/EditCampaign'
import DonationReceipt from './pages/DonationReceipt'
import Admin from './pages/Admin'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen">
      <Confetti />
      <Navbar />
      <ImpactStatsBar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/create" element={<CreateCampaign />} />
          <Route path="/my-campaigns" element={<MyCampaigns />} />
          <Route path="/campaign/:id/edit" element={<EditCampaign />} />
          <Route path="/donation/:paymentId" element={<DonationReceipt />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <footer className="text-center py-6 text-xs text-gray-600 space-x-4">
        <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
      </footer>
      <ActivityTicker />
    </div>
  )
}
