import { useState } from 'react'
import { authenticateUser, createDonationPayment, isPiBrowser } from '../pi/PiSDK'
import { approvePayment, completePayment } from '../api/client'

const PRESET_AMOUNTS = [0.5, 1, 2, 5]

export default function DonateButton({ campaign, onSuccess }) {
  const [amount, setAmount] = useState(1)
  const [customAmount, setCustomAmount] = useState('')
  const [status, setStatus] = useState('idle') // idle | auth | waiting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const finalAmount = customAmount ? parseFloat(customAmount) : amount

  async function handleDonate() {
    if (!isPiBrowser()) {
      setErrorMsg('Please open this app inside the Pi Browser.')
      setStatus('error')
      return
    }

    if (!finalAmount || finalAmount <= 0) {
      setErrorMsg('Please enter a valid amount.')
      setStatus('error')
      return
    }

    try {
      setStatus('auth')
      const authResult = await authenticateUser()
      const donorUsername = authResult?.user?.username || ''

      setStatus('waiting')

      createDonationPayment(
        finalAmount,
        `Donation to "${campaign.title}"`,
        { campaignId: campaign._id, campaignTitle: campaign.title },
        {
          onApprove: async (paymentId) => {
            await approvePayment(paymentId)
          },
          onComplete: async (paymentId, txid) => {
            await completePayment(paymentId, txid, campaign._id, finalAmount, donorUsername)
            setStatus('success')
            onSuccess && onSuccess(finalAmount, donorUsername)
          },
          onCancel: () => {
            setStatus('idle')
          },
          onError: (err) => {
            setErrorMsg(err.message || 'Something went wrong.')
            setStatus('error')
          },
        }
      )
    } catch (err) {
      setErrorMsg(err.message || 'Connection failed.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🎉</div>
        <p className="text-green-400 font-bold text-lg">Thank you!</p>
        <p className="text-gray-400 text-sm">π {finalAmount} donated successfully.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Preset amounts */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Select amount (π)</p>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustomAmount('') }}
              className={`py-2 rounded-xl text-sm font-bold border transition-colors ${
                amount === a && !customAmount
                  ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                  : 'border-gray-700 text-gray-300 hover:border-yellow-400/50'
              }`}
            >
              π {a}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div>
        <input
          type="number"
          placeholder="Or enter custom amount..."
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setAmount(null) }}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          min="0.1"
          step="0.1"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      <button
        onClick={handleDonate}
        disabled={status === 'auth' || status === 'waiting'}
        className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'auth' && 'Connecting to Pi...'}
        {status === 'waiting' && 'Waiting for confirmation...'}
        {(status === 'idle' || status === 'error') && `Donate π ${finalAmount || '—'}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        0.01π network fee applies. Rest goes to the cause.
      </p>
    </div>
  )
}
