import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto pb-16">
      <Link to="/" className="text-gray-500 hover:text-white text-sm mb-6 inline-block">← Back to Rippl</Link>
      <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: April 2026</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-white font-bold text-lg mb-2">1. Acceptance</h2>
          <p>By using Rippl you agree to these Terms. If you do not agree, please do not use the app. Rippl is accessible through the Pi Browser and is intended for Pi Network users (Pioneers).</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">2. What Rippl is</h2>
          <p>Rippl is a platform for creating and funding local social causes using Pi cryptocurrency. It is a community tool — not a financial institution, charity, or non-profit. Rippl does not hold funds; all transactions are processed directly through the Pi Network blockchain.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">3. Campaign creators</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>You are responsible for the accuracy of your campaign information.</li>
            <li>Campaigns must be for genuine social causes. Fraudulent or misleading campaigns are prohibited.</li>
            <li>You agree to use funds raised for the stated purpose of the campaign.</li>
            <li>Rippl reserves the right to deactivate campaigns that violate these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">4. Donors</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Donations are final and non-refundable once confirmed on the Pi blockchain.</li>
            <li>A 0.01π network fee applies to each transaction — this is a Pi Network fee, not retained by Rippl.</li>
            <li>Rippl does not guarantee that campaign goals will be reached or that funds will be used as described.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">5. Prohibited use</h2>
          <p>You may not use Rippl for: fraudulent fundraising, political campaigns, illegal activities, spam, or any purpose that violates Pi Network's own Terms of Service.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">6. Disclaimers</h2>
          <p>Rippl is provided "as is" without warranty of any kind. We are not liable for any losses, including loss of Pi, resulting from use of the platform, smart contract bugs, or Pi Network downtime.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">7. Changes to terms</h2>
          <p>We may update these terms at any time. Continued use of the app after changes constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-2">8. Governing law</h2>
          <p>These terms are governed by applicable law. Disputes shall be resolved in good faith between the parties.</p>
        </section>
      </div>
    </div>
  )
}
