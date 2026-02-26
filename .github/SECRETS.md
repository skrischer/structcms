# Required GitHub Secrets

For the CI/CD pipeline to run E2E tests, configure these repository secrets:

## Secrets

Navigate to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 1. SUPABASE_URL
- **Description:** Your Supabase project URL
- **Example:** `https://xxxxxxxxxxxxx.supabase.co`
- **Where to find:** Supabase Dashboard → Project Settings → API

### 2. SUPABASE_SECRET_KEY  
- **Description:** Your Supabase service role key (secret)
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find:** Supabase Dashboard → Project Settings → API → service_role key
- **⚠️ Warning:** This is a sensitive key, never commit it to git

### 3. SUPABASE_STORAGE_BUCKET
- **Description:** Name of your Supabase Storage bucket for media
- **Example:** `cms`
- **Where to find:** Supabase Dashboard → Storage → Your bucket name

## Optional: Skip E2E Tests

If you don't want to run E2E tests in CI (e.g., no Supabase setup yet), you can:

1. Remove the `e2e` job from `.github/workflows/ci.yml`
2. Or add a condition: `if: github.event_name != 'pull_request'`

## Local Development

For local E2E tests, create `examples/test-app/.env`:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SECRET_KEY=your_service_role_key_here
SUPABASE_STORAGE_BUCKET=cms
NEXT_PUBLIC_DISABLE_AUTH=true
```

**Note:** `.env` is gitignored - never commit sensitive credentials.
