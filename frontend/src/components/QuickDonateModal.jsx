import { useEffect, useRef, useState } from 'react'
import DonateButton from './DonateButton'
import ProgressBar from './ProgressBar'
import { useDonationFeed, useConfetti } from '../context/AppContext'

export default function QuickDonateModal({ campaign, onClose, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false)
  const { pushDonation } = useDonationFeed()
  const { triggerConfetti } = useConfetti()
  const panelRef = useRef(null)

  // Animate in
  useEffect(() => {
    if (campaign) {
      requestAnimationFrame(() => setIsOpen(true))
      document.body.style.overflow = 'hidden'
    } else {
      setIsOpen(false)
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [campaign])

  // Escape key + focus trap
  useEffect(() => {
    if (!campaign) return
    const handler = (e) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last  = focusable[focusable.length - 1]
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault()
          ;(e.shiftKey ? last : first)?.focus()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [campaign])

  function handleClose() {
    setIsOpen(false)
    setTimeout(onClose, 250)
  }

  function handleSuccess(amount) {
    pushDonation('you', amount, campaign.title)
    triggerConfetti()
    onSuccess && onSuccess(amount)
    setTimeout(handleClose, 2500)
  }

  if (!campaign) return null

  const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div
        ref={panelRef}
        className={`modal-panel ${isOpen ? 'open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-xs text-yellow-400 font-semibold mb-1 uppercase tracking-wide">Donate with Pi</p>
            <h2 className="text-lg font-extrabold text-white leading-snug line-clamp-2">
              {campaign.title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Mini progress */}
        <div className="mb-5">
          <ProgressBar current={campaign.raised} goal={campaign.goal} />
          <p className="text-xs text-gray-500 mt-2">{pct}% funded · {campaign.donorCount} donors</p>
        </div>

        <DonateButton campaign={campaign} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
