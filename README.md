# ForeScore

Golf games scorecard and tournament tracker. This is the same app you built
as a Claude artifact, packaged as a normal deployable web app.

## What changed from the artifact version

The artifact version used `window.storage`, an API that only exists inside
Claude.ai. This version uses a small polyfill (`src/storage-polyfill.js`)
that provides the exact same `get`/`set`/`delete` interface, so **none of
the app's own code (`src/App.jsx`) had to change** - it still calls
`window.storage` exactly as before. The polyfill just routes calls to real
storage instead:

- **Personal data** (active round pointer, finished-round archive, last
  tournament pointer, local course fallback) -> **browser localStorage**.
  This data was only ever meant to live on one device, so no backend is
  needed for it.
- **Shared data** (a round or tournament accessed by a code from multiple
  devices, saved courses) -> **Supabase**, so joining a round/tournament
  from a different phone still works.

## 1. Create a Supabase project (free tier is fine)

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once it's up, open the **SQL Editor** and run:

```sql
create table kv_store (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table kv_store enable row level security;

-- No login system in this app (rounds/tournaments are shared purely by
-- code, same as the original artifact version) - so allow open read/write
-- via the anon key. Anyone with a round or tournament code could already
-- view/edit it in the artifact version; this preserves that same model.
create policy "public read" on kv_store for select using (true);
create policy "public write" on kv_store for insert with check (true);
create policy "public update" on kv_store for update using (true);
create policy "public delete" on kv_store for delete using (true);
```

3. Go to **Project Settings -> API** and copy:
   - **Project URL** -> `VITE_SUPABASE_URL`
   - **anon public key** -> `VITE_SUPABASE_ANON_KEY`

> **Security note:** this uses Supabase's anon key with open policies -
> identical in spirit to how the artifact's shared storage worked (no
> login, access via a code). Don't put sensitive personal data in this
> app. If you want real access control later, that's a bigger change
> (auth + per-row policies) - happy to help with that separately.

## 2. Local development

```bash
npm install
cp .env.example .env.local
# edit .env.local with your Supabase URL + anon key
npm run dev
```

## 3. Deploy to Vercel

**Option A - GitHub (recommended):**
1. Push this folder to a new GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import that repo.
3. Vercel auto-detects Vite - no build settings to change.
4. Under **Environment Variables**, add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (same values as your `.env.local`).
5. Click **Deploy**.

**Option B - Vercel CLI:**
```bash
npm install -g vercel
vercel login
vercel
# then add env vars when prompted, or via:
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

## 4. After deploying

Test the full loop: create a round, open it on a second device/browser
with the round code, create a tournament, add a foursome from another
tab. If anything shared doesn't sync, double check the two env vars are
set correctly in Vercel and that the SQL above ran without errors.
