import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDonationReceipt } from '../api/client'

export default function DonationReceipt() {
  const { paymentId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getDonationReceipt(paymentId)
      .then(setData)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [paymentId])

  if (loading) return <div className="text-center text-gray-500 py-12">Loading receipt...</div>

  if (notFound) return (
    <div className="text-center py-12 max-w-sm mx-auto">
      <p className="text-4xl mb-4">🔍</p>
      <p className="text-gray-400 mb-4">Receipt not found.</p>
      <Link to="/" className="text-yellow-400 hover:underline">← Back to campaigns</Link>
    </div>
  )

  const { donation, campaign } = data
  const date = new Date(donation.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="max-w-sm mx-auto pb-12">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎉</div>
        <h1 className="text-2xl font-extrabold text-white">Donation Receipt</h1>
        <p className="text-gray-500 text-sm mt-1">Thank you for your contribution</p>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
          <span className="text-gray-500 text-sm">Amount</span>
          <span className="text-yellow-400 font-bold text-lg">π {donation.amount}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
          <span className="text-gray-500 text-sm">Campaign</span>
          <span className="text-white font-medium text-sm text-right max-w-[180px]">
            {campaign?.title || 'Unknown Campaign'}
          </span>
        </div>

        {donation.donorUsername && (
          <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
            <span className="text-gray-500 text-sm">Donor</span>
            <span className="text-white text-sm">@{donation.donorUsername}</span>
          </div>
        )}

        {donation.donorMessage && (
          <div className="py-2 border-b border-white/[0.06]">
            <p className="text-gray-500 text-sm mb-1">Message</p>
            <p className="text-gray-300 text-sm italic">"{donation.donorMessage}"</p>
          </div>
        )}

        <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
          <span className="text-gray-500 text-sm">Date</span>
          <span className="text-gray-400 text-xs text-right">{date}</span>
        </div>

        <div className="py-2">
          <p className="text-gray-500 text-xs mb-1">Transaction ID</p>
          <p className="text-gray-600 text-xs font-mono break-all">{donation.txid || donation.paymentId}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {campaign && (
          <Link
            to={`/campaign/${donation.campaignId}`}
            className="flex-1 text-center text-sm bg-yellow-400 text-gray-900 font-bold py-2.5 rounded-xl hover:bg-yellow-300 transition-colors"
          >
            View Campaign
          </Link>
        )}
        <Link
          to="/"
          className="flex-1 text-center text-sm border border-white/[0.1] text-gray-400 hover:text-white py-2.5 rounded-xl transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
