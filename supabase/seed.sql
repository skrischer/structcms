-- Local development seed (applied on `supabase start` / `supabase db reset`).
-- NOT pushed to remote via `supabase db push` — local convenience only.

-- Recent Supabase CLI versions no longer auto-grant DML on new public tables to the
-- anon/authenticated/service_role roles, so the service_role key (used by the API for
-- writes) gets "permission denied". Re-grant the privileges the framework assumes.
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

-- Storage buckets (cms = test-app default, media = SupabaseMediaAdapter default) are
-- provisioned declaratively from [storage.buckets.*] in supabase/config.toml.
