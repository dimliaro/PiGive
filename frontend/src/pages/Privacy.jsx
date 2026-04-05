import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto pb-16">
      <Link to="/" className="text-gray-500 hover:text-white text-sm mb-6 inline-block">← Back to Rippl</Link>
      <h1 className="text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: April 2026</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-white font-bold text-lg mb-2">1. Who we are</h2>
          <p>Rippl is a micro-donation platform built on the Pi Network, allowing Pioneers to support local social causes using Pi cryptocurrency. We operate as an independent Pi app accessible through the Pi Browser.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">2. What data we collect</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li><span className="text-gray-300">Pi UID</span> — provided by the Pi Network SDK when you authenticate. Used to identify campaign creators and link donations.</li>
            <li><span className="text-gray-300">Pi Username</span> — displayed publicly on donations and campaign pages if you choose to donate or create a campaign.</li>
            <li><span className="text-gray-300">Donation data</span> — amount, campaign, Pi transaction ID, and optional message you write when donating.</li>
            <li><span className="text-gray-300">Campaign data</span> — title, description, goal, organizer name, and image URL you provide when creating a campaign.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">3. What we do NOT collect</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Email addresses</li>
            <li>Phone numbers</li>
            <li>Real names (unless you enter them voluntarily as an organizer name)</li>
            <li>Location data</li>
            <li>Cookies or tracking pixels</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">4. How we use your data</h2>
          <p>Data is used solely to operate the platform: displaying campaigns, processing Pi payments, and showing donor counts. We do not sell, share, or monetise any user data.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">5. Data storage</h2>
          <p>Campaign and donation data is stored in MongoDB Atlas (cloud, EU region). Pi authentication is handled entirely by the Pi Network — we never see your Pi wallet credentials.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">6. Third parties</h2>
          <p>Rippl uses the Pi Network SDK (minepi.com) for authentication and payments. Please review Pi Network's own privacy policy at <a href="https://minepi.com/privacy-policy" className="text-yellow-400 hover:underline" target="_blank" rel="noreferrer">minepi.com/privacy-policy</a>.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">7. Your rights</h2>
          <p>You may request deletion of your data at any time by contacting us. Campaign creators can delete their campaigns via the app. Donation records may be retained for blockchain reconciliation purposes.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">8. Contact</h2>
          <p>For any privacy-related questions, reach out through the Pi Browser in-app chat or via our Pi profile.</p>
        </section>
      </div>
    </div>
  )
}
