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
# set MONGODB_URI and AUTH_SECRET
npm run seed
npm run dev
```

Admin: `/admin` (seed credentials from `.env.local`)
