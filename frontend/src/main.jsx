import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import App from './App'
import './index.css'

// ---------------------------------------------------------------------------
// Pi SDK initialisation — must happen before any Pi.authenticate() or
// Pi.createPayment() call.  Pi Browser injects window.Pi before page scripts
// run, so this fires at the right time.  The window 'load' listener catches
// the rare case where the CDN sdk.js script finishes after main.jsx.
// ---------------------------------------------------------------------------
function _tryInitPi() {
  if (!window.Pi) return
  try {
    window.Pi.init({ version: '2.0', sandbox: import.meta.env.VITE_SANDBOX !== 'false' })
  } catch (e) {
    // "already initialized" is fine — any other error is logged
    if (!e?.message?.toLowerCase().includes('already')) {
      console.warn('[Rippl] Pi.init (main):', e.message)
    }
  }
}
_tryInitPi()
window.addEventListener('load', _tryInitPi)
// ---------------------------------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
