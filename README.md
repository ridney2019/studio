# Studio Tattoo

A Next.js tattoo studio website inspired by the Bang Bang homepage layout.

## Setup

1. Install dependencies:
   ```powershell
   cd "C:\Users\ridne\Documents\studio"
   npm install --legacy-peer-deps
   ```
2. Start the development server:
   ```powershell
   npm run dev
   ```
3. Open the site at `http://localhost:3000`.

## Contact page

- Visit `/contact` to see the booking and contact form page.

## Owner Admin (Google Login)

The artist admin route is protected with Google OAuth and owner email allowlist:

- Route: `/admin/artists`
- Sign in provider: Google
- Access is allowed only for emails listed in `OWNER_ADMIN_EMAILS`

Create a `.env.local` file with:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OWNER_ADMIN_EMAILS=owner1@gmail.com,owner2@gmail.com
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000
```

For production, set `NEXTAUTH_URL` to your live domain, for example:

```bash
NEXTAUTH_URL=https://your-domain.com
```

Also add this redirect URI in Google Cloud OAuth app settings:

```text
http://localhost:3000/api/auth/callback/google
```

## Deploy

- Push this repository to GitHub.
- Connect the repo to Vercel.
- Use the default Next.js settings and let Vercel run `npm run build`.
