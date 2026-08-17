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
or 
npx tsx --env-file=.env.local scripts/seed.ts

npm run dev
```

Admin: `/admin` (seed credentials from `.env.local`)

### Auth

- Email/password and Google sign-in are both enabled
- Public registration always creates a **user** role
- Admins can add users and change roles at `/admin/users`
- Google redirect URI: `{AUTH_URL}/api/auth/callback/google`

## Product images

In **Admin → Products → Add/Edit**, paste Cloudinary/ImageKit (or any public) image URLs. No cloud API keys are required in env.
