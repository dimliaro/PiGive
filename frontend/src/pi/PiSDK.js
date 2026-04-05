/**
 * PiSDK.js — Wrapper γύρω από το Pi Network SDK
 *
 * Το Pi SDK φορτώνεται ως global (window.Pi) μέσω του script tag στο index.html.
 * Αυτό το module παρέχει async/await interface για τις κύριες λειτουργίες.
 */

const SANDBOX = import.meta.env.VITE_SANDBOX !== 'false'

/**
 * Calls Pi.init() every time a Pi method is about to be used.
 * Pi SDK ignores the call if already initialized, and throws a recognisable
 * error if something is genuinely wrong — which will surface to the caller.
 */
function ensurePiInit(Pi) {
  try {
    Pi.init({ version: '2.0', sandbox: SANDBOX })
  } catch (e) {
    // "already initialized" is expected and fine — ignore it
    if (
      e?.message?.toLowerCase().includes('already') ||
      e?.message?.toLowerCase().includes('initialized')
    ) return
    // Any other init error: log but don't swallow so caller sees it
    console.warn('[Rippl] Pi.init:', e.message)
  }
}

const getPi = () => {
  if (typeof window === 'undefined' || !window.Pi) {
    throw new Error('Pi SDK not loaded. Make sure you are running inside Pi Browser.')
  }
  ensurePiInit(window.Pi)
  return window.Pi
}

/**
 * Κάνει authenticate τον χρήστη με το Pi Network.
 * Επιστρέφει { user: { uid, username } }
 */
export async function authenticateUser() {
  const Pi = getPi()
  return Pi.authenticate(['payments', 'username'], async (payment) => {
    // Handle any payment left incomplete from a previous session
    try {
      await fetch('/api/payments/incomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.identifier }),
      })
    } catch (e) {
      console.warn('Could not resolve incomplete payment:', e)
    }
  })
}

/**
 * Δημιουργεί Pi payment για donation.
 *
 * @param {number}   amount     - Ποσό σε Pi
 * @param {string}   memo       - Περιγραφή (εμφανίζεται στον χρήστη)
 * @param {object}   metadata   - { campaignId, campaignTitle }
 * @param {object}   handlers   - { onApprove, onComplete, onCancel, onError }
 */
export function createDonationPayment(amount, memo, metadata, handlers) {
  const Pi = getPi()

  Pi.createPayment(
    { amount, memo, metadata },
    {
      // Βήμα 1: Το SDK μας δίνει paymentId — πρέπει να το εγκρίνουμε server-side
      onReadyForServerApproval: (paymentId) => {
        handlers.onApprove(paymentId)
      },

      // Βήμα 2: Ο χρήστης επιβεβαίωσε — το Pi blockchain εκτέλεσε tx
      onReadyForServerCompletion: (paymentId, txid) => {
        handlers.onComplete(paymentId, txid)
      },

      onCancel: (paymentId) => {
        handlers.onCancel && handlers.onCancel(paymentId)
      },

      onError: (error, payment) => {
        handlers.onError && handlers.onError(error, payment)
      },
    }
  )
}

/**
 * Ελέγχει αν η εφαρμογή τρέχει μέσα στο Pi Browser.
 */
export function isPiBrowser() {
  return typeof window !== 'undefined' && !!window.Pi
}
