-- Security fix #5 (audit 2026-06-16): submitted_by attribution integrity
--
-- The public INSERT policies on user_submissions and reports used
-- WITH CHECK (true), letting any caller set `submitted_by` to an arbitrary
-- email. That allowed:
--   * forging attribution (spam blamed on an innocent user),
--   * polluting another user's "My submissions" view — the SELECT policy
--     "Users read own submissions" matches submitted_by = the caller's JWT
--     email, so a forged row would surface in the victim's account,
--   * misdirecting the admin push-notification flow on approve/reject/resolve.
--
-- Bind submitted_by to the caller's own identity: NULL for anonymous callers
-- (anon JWTs carry no email, so only the NULL branch passes), or exactly the
-- signed-in user's email. The app already populates submitted_by from the auth
-- session email (AuthProvider -> store.userEmail -> submit/report forms), so
-- legitimate submissions are unaffected.
--
-- This also clears the Supabase advisor "RLS Policy Always True" warnings
-- (lint 0024) on both tables. The (select auth.jwt() ...) wrapper matches the
-- existing "Users read own submissions" policy and lets Postgres cache the
-- value once per statement (initplan) rather than per row.

drop policy "Public insert submissions" on public.user_submissions;
create policy "Public insert submissions" on public.user_submissions
  for insert
  with check (
    submitted_by is null
    or submitted_by = (select auth.jwt() ->> 'email')
  );

drop policy "Public insert reports" on public.reports;
create policy "Public insert reports" on public.reports
  for insert
  with check (
    submitted_by is null
    or submitted_by = (select auth.jwt() ->> 'email')
  );
