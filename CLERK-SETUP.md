# Clerk setup — real login with Google (10 min)

Do this to turn on real login. At the end you paste me **3 keys** and it goes live.

## 1. Create the Clerk app
1. Go to **https://clerk.com** → **Sign up** (free).
2. **Create application** → name it `Verity`.
3. Under **"Sign in options"**, turn ON:
   - Email (email + password)
   - Google
   - GitHub (optional)
   - LinkedIn (optional — may need review; skip if it asks)
4. Click **Create application**.

## 2. Get the two API keys
On the "API Keys" screen (Next.js is pre-selected), copy:

| Key | Looks like |
|---|---|
| Publishable key | `pk_test_xxxx` |
| Secret key | `sk_test_xxxx` |

## 3. Set up the webhook (syncs users into our database)
1. Left sidebar → **Webhooks** → **Add Endpoint**.
2. Endpoint URL: `https://verity-gold.vercel.app/api/webhooks/clerk`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`.
4. Create, then copy the **Signing Secret** → `whsec_xxxx`.

## 4. Redirect paths
Left sidebar → **Paths**:
- After sign-in: `/dashboard`
- After sign-up: `/dashboard`

## 5. Send me these 3 values
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_...
CLERK_SECRET_KEY                  = sk_test_...
CLERK_WEBHOOK_SECRET              = whsec_...
```

Then I flip V1 live with real Google login.

---
Notes:
- Google login works on Clerk's free tier with Clerk's shared credentials — no Google Cloud project needed.
- Free tier = 10,000 monthly active users.
