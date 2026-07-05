# Deploying Verity (free)

The app is deploy-ready. Two ways — the **browser route is easiest and needs no CLI**.

## Option A — Vercel via GitHub (recommended, 100% free, ~2 min)

1. Go to **https://vercel.com/new** and sign in with **GitHub**.
2. **Import** the repo `prerak09/Verity`.
3. Framework preset auto-detects **Next.js** — leave build settings default.
4. Under **Environment Variables**, add these (this is what makes it a
   credential-free public demo — no Clerk/DB needed to browse the retro UI):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_DEMO_MODE` | `true` |
   | `MOCK_AUTH_ROLE` | `ADMIN` |
   | `DATABASE_URL` | `postgresql://user:pass@localhost:5432/db` (dummy — demo uses mock data, but Prisma's client needs the var to exist at build) |

5. Click **Deploy**. In ~90s you get a live URL like `https://verity-xxxx.vercel.app`.

Every push to `main` auto-redeploys after that.

### Making it a REAL (non-demo) deployment later
Remove `NEXT_PUBLIC_DEMO_MODE`, then add the real secrets from `.env.example`:
`DATABASE_URL` + `DIRECT_URL` (Supabase), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`,
`CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `CLOUDINARY_*`, `RESEND_API_KEY`,
`CRON_SECRET`. Point the Clerk webhook at `https://<your-domain>/api/webhooks/clerk`.

## Option B — Vercel CLI

```bash
npm i -g vercel
vercel login                       # opens browser
vercel link                        # link to the repo
vercel env add NEXT_PUBLIC_DEMO_MODE   # → true
vercel env add MOCK_AUTH_ROLE          # → ADMIN
vercel env add DATABASE_URL            # → any dummy postgres URL
vercel --prod                      # deploy
```

## Notes
- **Free tier:** crons run once/day (already configured that way in `vercel.json`).
- Demo mode defaults the mock user to **ADMIN**, so every portal is browsable.
- Alternative free hosts that also work: **Netlify** (same flow) or **Render**.
