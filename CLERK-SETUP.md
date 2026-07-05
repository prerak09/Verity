# Clerk setup — real login with Google (10 min)

Do this while I build V1. At the end you'll paste me **3 keys** and it goes live.

## 1. Create the Clerk app
1. Go to **https://clerk.com** → **Sign up** (free).
2. **Create application** → name it `Verity`.
3. Under **"Sign in options"**, turn ON:
   - ✅ **Email** (email + password)
   - ✅ **Google**
   - ✅ **GitHub** (optional)
   - ✅ **LinkedIn** (optional — LinkedIn needs extra approval; skip if it asks for review)
4. Click **Create application**.

## 2. Get the two API keys
On the next screen ("API Keys"), Next.js is pre-selected. Copy these two:

| Key | Looks like |
|---|---|
| **Publishable key** | `pk_test_xxxxxxxx` |
| **Secret key** | `sk_test_xxxxxxxx` |

## 3. Set up the webhook (syncs users into our database)
1. Left sidebar → **Webhooks** → **Add Endpoint**.
2. **Endpoint URL:** `https://verity-gold.vercel.app/api/webhooks/clerk`
3. **Subscribe to events:** check `user.created`, `user.updated`, `user.deleted`.
4. **Create**. Then copy the **Signing Secret** — looks like `whsec_xxxxxxxx`.

## 4. Set the redirect URLs (so login lands back on the app)
Left sidebar → **Paths** (or **Account Portal**), set:
- After sign-in: `/dashboard`
- After sign-up: `/dashboard`
- Home/unauthorized fallback: `/`

## 5. Send me these 3 values
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_...
CLERK_SECRET_KEY                  = sk_test_...
CLERK_WEBHOOK_SECRET              = whsec_...
```

That's it — paste those three and I flip V1 live with real Google login.

---

### Notes
- **Google login "just works"** on Clerk's free tier using Clerk's shared Google credentials — no Google Cloud project needed for dev/launch. (You can add your own Google OAuth branding later.)
- Free tier = 10,000 monthly active users. Plenty for launch.
- I'll add all three keys to Vercel's env vars for you once you paste them (or you can paste them into Vercel yourself under Settings → Environment Variables).
