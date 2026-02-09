# Baseline Access & Equity Ledger v2

Two-stage assessment workflow with email notifications.

## Setup Required

### 1. Run SQL in Supabase

Go to your Supabase project → SQL Editor → New Query

Copy and paste the contents of `supabase-schema.sql` and click "Run"

### 2. Set Environment Variables in Netlify

In Netlify dashboard → Site settings → Environment variables → Add these:

```
SUPABASE_URL = https://lnlfbyjrpoflhomoumsr.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubGZieWpycG9mbGhvbW91bXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTMwMTAsImV4cCI6MjA4NjE4OTAxMH0.fbaB9S0goodvndpOLEIwJPN1i6D7hEHEnUEtHVYq_74
RESEND_API_KEY = re_LjKTRpPK_HqK2qQf911BKusKRn66GtMSc
FROM_EMAIL = onboarding@resend.dev
```

Note: Change FROM_EMAIL to `noreply@neurodivergentempowered.com` once you verify your domain in Resend.

### 3. Deploy to Netlify

**Option A: GitHub (Recommended)**
1. Push this folder to a GitHub repo
2. In Netlify → Add new site → Import from Git → Select repo
3. Build settings should auto-detect (build command: `npm run build`, publish: `dist`)

**Option B: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Workflow

1. **Practitioner** goes to your-site.netlify.app
2. Enters client name, email, and their own details
3. Clicks "Send Assessment Link"
4. **Client** receives email with unique link
5. Client completes assessment and submits
6. **Practitioner** receives email notification
7. Practitioner clicks link, reviews responses, makes decision
8. **Both** receive final results by email

## URLs

- `/` — Practitioner portal (send new assessments)
- `/client/:token` — Client assessment form
- `/practitioner/:token` — Practitioner review
- `/demo` — Original standalone tool (for testing)

## Files

- `netlify/functions/` — Serverless backend functions
- `src/` — React frontend
- `supabase-schema.sql` — Database schema
- `netlify.toml` — Netlify configuration
