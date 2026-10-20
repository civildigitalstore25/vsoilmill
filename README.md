# VS OilMill

Modern ecommerce storefront for VS OilMill — wooden-pressed oils & A2 ghee.

## Stack

- Next.js (App Router) + TypeScript
- MongoDB (Mongoose)
- Tailwind CSS 4 + shadcn/ui + Lucide
- NextAuth v5
- PhonePe Payment Gateway
- Zustand cart + TanStack Query

## Getting started

```bash
npm install
cp .env.example .env.local
# set MONGODB_URI, AUTH_SECRET, and Google OAuth keys
npm run seed
npm run dev
```

Admin: `/admin` (seed credentials from `.env.local`)

### Auth

- Email/password and Google sign-in are both enabled
- Google button is hidden when `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are unset
- Forgot/reset password: `/forgot-password` and `/reset-password`
- Public registration always creates a **user** role
- Admins can add users and change roles at `/admin/users`
- Google redirect URI: `{AUTH_URL}/api/auth/callback/google`

## Product images

In **Admin → Products → Add/Edit**, paste Cloudinary/ImageKit (or any public) image URLs.
URL paste is intentional — no cloud upload API keys are required.

## Production (Vercel + external MongoDB)

Set these in Vercel project env (Production + Preview as needed):

| Variable | Notes |
|----------|--------|
| `MONGODB_URI` | e.g. `mongodb://USER:PASS@mongo.vsoilmill.com:27017/VSoilMill?authSource=admin&tls=true` |
| `AUTH_SECRET` | strong random secret |
| `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` | your production HTTPS origin |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | optional |
| `PHONEPE_ENV` | `SANDBOX` (PG V2 Client Id/Secret) or `PRODUCTION` (PG V1 Merchant Id/API Key) |
| `PHONEPE_CLIENT_ID` / `PHONEPE_CLIENT_SECRET` / `PHONEPE_CLIENT_VERSION` | Sandbox only — Test Mode Developer Settings |
| `PHONEPE_MERCHANT_ID` / `PHONEPE_API_KEY` / `PHONEPE_KEY_INDEX` | Production only — live dashboard API credentials |
| `PHONEPE_CALLBACK_USERNAME` / `PHONEPE_CALLBACK_PASSWORD` | Webhook SHA auth (same values as PhonePe webhook config) |
| `EMAIL_FROM` / `BREVO_API_KEY` | optional order/reset emails via [Brevo](https://app.brevo.com/settings/keys/api) |

Seed against production only when intentional:

```bash
npx tsx --env-file=.env.local scripts/seed.ts
```

## Scripts

- `npm run dev` — local Next.js
- `npm run build` / `npm start` — production build
- `npm run seed` — loads `.env.local` and seeds MongoDB
- `npm test` — unit tests (coupons/pricing)
