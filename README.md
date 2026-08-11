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

## Owner Admin

The owner admin area now uses database-backed NextAuth credentials with registration, email verification, and password reset.

- Sign in: `/admin/artists`
- Register: `/admin/register`
- Forgot password: `/admin/forgot-password`
- Access is still restricted to emails listed in `OWNER_ADMIN_EMAILS`

Create a `.env.local` file with:

```bash
OWNER_ADMIN_EMAILS=owner1@gmail.com,owner2@gmail.com
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/studio?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/studio?schema=public"
EMAIL_FROM="Nexo Tattoo <no-reply@example.com>"
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000
```

In development, if SMTP is not configured, verification and reset links are logged to the server console. In production, SMTP configuration is required.

After setting your env vars, create the database tables locally:

```powershell
npm run db:push
```

For production, set `NEXTAUTH_URL` to your live domain, for example:

```bash
NEXTAUTH_URL=https://your-domain.com
```

For production, use a hosted Postgres database and set `DATABASE_URL` in your hosting platform to that connection string. On deployment, run:

```bash
npm run db:deploy
```

Recommended production stack:

- Database: Neon, Supabase Postgres, Railway Postgres, Render Postgres, or managed Postgres from your host
- App hosting: Vercel or similar
- Email: SMTP credentials from Resend, Postmark, SendGrid, Brevo, Zoho, or your domain mail provider

### Vercel Production Setup

The simplest production path for this repo is:

1. Create a Vercel project from this repository.
2. Create a hosted Postgres database, preferably Neon if you want the quickest Vercel-friendly setup.
3. Paste the Postgres connection string into Vercel as `DATABASE_URL`.
4. Add these Vercel environment variables:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@POOLER_HOST/DBNAME?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://USER:PASSWORD@DIRECT_HOST/DBNAME?sslmode=require&channel_binding=require
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=replace-with-a-long-random-secret
EMAIL_FROM=Nexo Tattoo <no-reply@yourdomain.com>
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_xxxxxxxxxxxxxxxxx
OWNER_ADMIN_EMAILS=nexostudiosltd@gmail.com,ridneygbs@gmail.com
```

5. Redeploy the project.

This repo now includes [vercel.json](vercel.json), and Vercel will use `npm run vercel-build`, which runs:

- `prisma generate`
- `prisma migrate deploy`
- `next build`

That means production deploys will generate the Prisma client and apply committed migrations automatically.

### Neon Notes

If you use Neon:

- Create a database and copy both connection strings:
- Use the pooled connection as `DATABASE_URL`
- Use the direct connection as `DIRECT_URL`
- Keep `?sslmode=require` and `channel_binding=require` if Neon includes them
- Use a separate Neon branch for development if you want to avoid mixing local and production data

### SMTP Notes

For the fewest delivery problems in production, use a transactional provider instead of personal Gmail SMTP.

Good options:

- Resend
- Postmark
- SendGrid
- Brevo

For the fastest Vercel setup, Resend via SMTP is the simplest choice:

```bash
EMAIL_FROM=Nexo Tattoo <no-reply@yourdomain.com>
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_xxxxxxxxxxxxxxxxx
```

Your sending domain or sender identity must be verified in Resend before production email will deliver successfully.

Use this endpoint to test your NextAuth configuration in both local and production:

```text
/api/auth/test
```

It returns which required variables are missing without exposing secrets.

## Deploy

- Push this repository to GitHub.
- Connect the repo to Vercel.
- Use the default Next.js settings and let Vercel run `npm run build`.
