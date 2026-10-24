# SuperBase — social app starter

A responsive React + TypeScript web app starter with Supabase authentication, shared database-backed real-time global chat, a dark/light theme switch, and English / Simplified Chinese / Bahasa Melayu UI strings.

## What works after setup

- Email/password sign-up and sign-in via Supabase Auth
- User profiles and unique usernames
- Shared messages stored in Postgres and delivered live via Supabase Realtime
- Theme switching and language switching
- Responsive layout for phones and desktop browsers

## Important: what is not implemented yet

- Voice/video calling (requires WebRTC signaling, TURN configuration and call UI)
- Social feed, likes, follows and comments
- Real donations or person-to-person money transfers
- Touch 'n Go eWallet integration

The payment cards are intentionally informational. **This project does not accept or move money.** Real payments require a supported provider/merchant account, server-side payment creation, signed webhook verification, reconciliation, fraud controls and compliance checks. Person-to-person transfers may require additional regulated-provider approval. Never store card details or payment secrets in the browser. Do not claim TNG integration until the provider confirms your eligibility and supplies integration documentation.

## 1. Create the online database

1. Create a project at https://supabase.com/ (you may need an adult to help manage billing and provider accounts).
2. In the Supabase dashboard, open **SQL Editor**.
3. Open `supabase/schema.sql` from this project, copy all of it into the SQL Editor and run it.
4. In **Project Settings → API** (or the project's Connect dialog), copy the project URL and the publishable/anon key. Do not copy the `service_role` secret.

## 2. Configure the app

1. Install Node.js LTS from https://nodejs.org/.
2. Copy `.env.example` to a new file named `.env` in the project root.
3. Replace the example values:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   ```
4. In a terminal in this folder, run:
   ```
   npm install
   npm run dev
   ```
5. Open the local URL printed by Vite.

Never commit `.env` to GitHub. The browser publishable/anon key is designed for client use only when Row Level Security is correctly configured; never expose a service-role key.

## 3. Enable Google sign-in

1. In Supabase, open **Authentication → Providers → Google** and enable it.
2. Create OAuth credentials in the Google Cloud console and enter the client ID and secret into Supabase.
3. Configure the authorized redirect/callback URL shown by Supabase and add your deployed site URL to Supabase's allowed redirect URLs.
4. Test sign-in on the deployed domain as well as locally.

## 4. Put the code on GitHub

1. On GitHub, create a new **empty** repository named `SuperBase` (do not add a README if you are uploading this project's README).
2. Download and extract this ZIP.
3. Upload the extracted project files and folders to the repository, or use Git:
   ```
   git init
   git add .
   git commit -m "Create SuperBase starter"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/SuperBase.git
   git push -u origin main
   ```
4. Deploy the repository using a host such as Vercel or Netlify and add the two environment variables in that host's project settings.

## 5. Test the database connection

- Register a test account.
- If email confirmation is enabled, confirm the email before signing in.
- Set a username.
- Open the deployed site in another browser/device, sign in with a second test account, and send messages.
- Verify that messages appear on both devices and are visible in Supabase Table Editor.

## Security and launch checklist

- Keep RLS enabled; test policies before launch.
- Add rate limits, abuse reporting, blocking, moderation, privacy policy and terms before opening to the public.
- Restrict profile edits and validate all user-generated content.
- Use HTTPS in deployment.
- For calling, use WebRTC with a signaling channel and TURN service; don't expose provider secrets.
- For money, implement only after payment provider approval. Use a server/edge function for checkout, verify provider-signed webhooks, and never update balances based only on browser requests.
- Have an experienced adult review payment and privacy decisions before accepting money or launching publicly.

## Stack

- Vite + React + TypeScript
- Supabase Auth, Postgres, Row Level Security and Realtime
- Lucide icons
