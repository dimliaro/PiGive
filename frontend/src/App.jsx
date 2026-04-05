import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ImpactStatsBar from './components/ImpactStatsBar'
import ActivityTicker from './components/ActivityTicker'
import Confetti from './components/Confetti'
import Home from './pages/Home'
import CampaignDetail from './pages/CampaignDetail'
import CreateCampaign from './pages/CreateCampaign'
import MyCampaigns from './pages/MyCampaigns'

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
        </Routes>
      </main>
      <ActivityTicker />
    </div>
  )
}
