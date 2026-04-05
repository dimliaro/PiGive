# Rippl — Micro-Donations with Pi

> Fund local social causes with Pi cryptocurrency. No banks, no middlemen — just Pioneers helping their communities.

**Live app:** https://pi-give.vercel.app
**Backend API:** https://pigive-production.up.railway.app
**Pi App Store:** developers.minepi.com

---

## What it is

Rippl lets Pi Network users (Pioneers) create and fund hyper-local campaigns — school supplies, animal shelters, youth sports, neighbourhood projects. Every donation is processed directly on the Pi blockchain. A 0.01π network fee applies per transaction (Pi Network's fee, not Rippl's).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Frontend hosting | Vercel |
| Backend hosting | Railway |
| Payments | Pi Network SDK (`window.Pi`) |

---

## Project Structure

```
PiNetworkApp/
├── frontend/               # React app (Vite)
│   ├── public/
│   │   ├── rippl-logo.png  # App icon (transparent PNG)
│   │   └── manifest.json   # PWA manifest
│   ├── src/
│   │   ├── api/client.js   # All API calls (axios)
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AppContext (stats, confetti, feed)
│   │   ├── pages/          # Route-level page components
│   │   └── pi/PiSDK.js     # Pi SDK wrapper (authenticate, createPayment)
│   ├── .env.development    # VITE_SANDBOX=true  (local dev)
│   ├── .env.production     # VITE_SANDBOX=false (Vercel build)
│   └── vite.config.js      # Injects __VITE_SANDBOX__ into Pi.init()
│
└── backend/                # Express API
    ├── models/
    │   ├── Campaign.js     # Campaign schema
    │   └── Donation.js     # Donation + payment record schema
    └── routes/
        ├── campaigns.js    # Campaign CRUD + donors + updates
        ├── payments.js     # Pi payment approve / complete / receipt
        └── admin.js        # Password-protected admin endpoints
```

---

## Environment Variables

### Backend (Railway)

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/rippl` |
| `PI_API_KEY` | Pi Network Server API Key from developers.minepi.com | `abc123...` |
| `FRONTEND_URL` | Exact Vercel URL for CORS | `https://pi-give.vercel.app` |
| `ADMIN_PASSWORD` | Password for the `/admin` panel | `choose-something-strong` |
| `PORT` | Set automatically by Railway | `3001` |

### Frontend (Vercel)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Full backend URL **including `/api`** | `https://pigive-production.up.railway.app/api` |
| `VITE_SANDBOX` | Pi sandbox mode toggle | `true` (dev) / `false` (production) |

> ⚠️ `VITE_API_URL` must end in `/api`. Without it, all payment calls 404.

---

## Pi Payment Flow

Every donation goes through a 4-step server-confirmed flow required by the Pi Network:

```
Pioneer (Pi Browser)          Rippl Backend              Pi Network API
        |                           |                           |
        |-- Pi.createPayment() ---->|                           |
        |<-- onReadyForServerApproval(paymentId)                |
        |-- POST /api/payments/approve -----------------------> |
        |                           |-- approve paymentId ----> |
        |                           |<-- 200 OK                 |
        |                                                       |
        |   [Pioneer confirms in Pi Wallet]                     |
        |                                                       |
        |<-- onReadyForServerCompletion(paymentId, txid)        |
        |-- POST /api/payments/complete ----------------------> |
        |                           |-- complete + txid ------> |
        |                           |<-- 200 OK                 |
        |                           |-- save Donation to DB     |
        |                           |-- update Campaign.raised  |
        |<-- success ✓              |                           |
```

**Why this exists:** Pi requires server-side approval before a user can confirm a payment. This prevents client-side manipulation of amounts.

**Sandbox caveat:** In sandbox mode, Pi API returns `amount: 0`. The frontend passes the real amount as a fallback (`paymentData.amount || clientAmount`).

---

## API Endpoints

### Campaigns
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/campaigns` | List active, approved, non-expired campaigns |
| `GET` | `/api/campaigns/:id` | Single campaign detail |
| `POST` | `/api/campaigns` | Create new campaign (auto-approved) |
| `PUT` | `/api/campaigns/:id` | Edit description / image / extend deadline (creator only) |
| `PATCH` | `/api/campaigns/:id/close` | Close campaign early (creator only) |
| `GET` | `/api/campaigns/:id/donors` | Recent donors with messages |
| `POST` | `/api/campaigns/:id/updates` | Post creator update (creator only) |

### Payments
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/payments/approve` | Step 1: approve paymentId with Pi API |
| `POST` | `/api/payments/complete` | Step 2: complete with txid, save donation |
| `POST` | `/api/payments/incomplete` | Handle leftover incomplete payments |
| `GET` | `/api/payments/receipt/:paymentId` | Get donation receipt |

### Admin (requires `Authorization: Bearer <ADMIN_PASSWORD>`)
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Total campaigns, donations, Pi raised |
| `GET` | `/api/admin/campaigns` | All campaigns (no filter) |
| `PATCH` | `/api/admin/campaigns/:id/feature` | Toggle ⭐ pin |
| `PATCH` | `/api/admin/campaigns/:id/toggle` | Activate / deactivate |
| `GET` | `/api/admin/donations` | 30 most recent completed donations |

---

## Frontend Routes

| Path | Page |
|---|---|
| `/` | Home — featured campaign hero + campaign grid |
| `/campaign/:id` | Campaign detail — donate, donor wall, updates |
| `/campaign/:id/edit` | Edit campaign (creator only) |
| `/create` | Create new campaign |
| `/my-campaigns` | Creator dashboard — your campaigns + stats |
| `/donation/:paymentId` | Donation receipt |
| `/admin` | Admin panel (password protected) |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/dimliaro/PiGive.git
cd PiGive

# 2. Backend
cd backend
npm install
# Create .env with MONGODB_URI, PI_API_KEY, FRONTEND_URL, ADMIN_PASSWORD
npm run dev        # → http://localhost:3001

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

The frontend proxies `/api` to `localhost:3001` in dev (configured in `vite.config.js`).

---

## Going Live Checklist

- [ ] Set `VITE_SANDBOX=false` in Vercel environment variables
- [ ] Get production `PI_API_KEY` from developers.minepi.com (after app approval)
- [ ] Set `ADMIN_PASSWORD` in Railway variables
- [ ] Verify `FRONTEND_URL` in Railway matches exact Vercel URL
- [ ] Verify `VITE_API_URL` in Vercel ends with `/api`
- [ ] Test a real Pi payment end-to-end in Pi Browser
- [ ] Submit to Pi App Store at developers.minepi.com

---

## Key Design Decisions

**Why server listens before MongoDB connects**
Railway's healthcheck hits the server immediately on deploy. If `app.listen()` waits for Mongoose, the healthcheck fails and the deploy is killed. The server starts instantly; MongoDB connects asynchronously after.

**Why `isApproved: true` is hardcoded**
Originally campaigns required moderation. This was simplified — all campaigns are auto-approved. The field is kept in the schema for future moderation if needed. Use the admin panel to deactivate bad campaigns.

**Why campaign amounts fall back to `clientAmount`**
Pi's sandbox API returns `amount: 0` for all test payments. The frontend passes the user-selected amount as a fallback. In production with `sandbox: false`, the Pi API returns the real amount.

**Why localStorage tracks "My Campaigns"**
Rippl has no traditional login system — authentication is Pi-only. Campaign IDs are stored in `localStorage` under `my_campaign_ids` so creators can find their campaigns without a server query. Creator identity is verified by `creatorPiUid` when editing.

---

## Legal

- Privacy Policy: https://pi-give.vercel.app/privacy
- Terms of Service: https://pi-give.vercel.app/terms
