# PiGive — Micro-Donation Platform για Pi Network

Micro-δωρεές σε τοπικούς κοινωνικούς σκοπούς. Χωρίς fees, χωρίς τράπεζες.

## Setup

### 1. Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Συμπλήρωσε PI_API_KEY και MONGODB_URI στο .env
npm run dev   # http://localhost:3001
```

### 3. Pi Developer Account
1. Πήγαινε στο https://developers.minepi.com
2. Δημιούργησε νέα εφαρμογή
3. Αντέγραψε το **Server API Key** στο `.env` ως `PI_API_KEY`
4. Αντέγραψε το **App ID** ως `PI_APP_ID`

## Pi Payment Flow

```
Client                      Server                    Pi API
  |                            |                          |
  |-- createPayment() -------->|                          |
  |<-- onReadyForServerApproval(paymentId)                |
  |-- POST /api/payments/approve -->|                     |
  |                            |-- POST /approve -------->|
  |                            |<-- 200 OK               |
  |   [User confirms in Pi Wallet]                        |
  |<-- onReadyForServerCompletion(paymentId, txid)        |
  |-- POST /api/payments/complete -->|                    |
  |                            |-- POST /complete ------->|
  |                            |<-- 200 OK               |
  |                            |-- Update DB             |
  |<-- success                 |                          |
```

## Υποβολή στο Pi App Store
1. Deploy frontend (Vercel/Netlify) + backend (Railway/Render)
2. Πήγαινε στο developers.minepi.com → Submit App
3. Χρειάζεσαι: HTTPS URL, screenshots, description
