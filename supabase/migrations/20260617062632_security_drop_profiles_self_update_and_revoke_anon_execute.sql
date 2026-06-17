-- Security fixes #1, #2, #3 (audit 2026-06-16)
--
-- #1 (CRITICAL): remove privilege-escalation path on public.profiles.
-- The "Users update own profile" policy let any authenticated user UPDATE their
-- own profiles row, including the `role` column, allowing self-promotion to admin
-- via a single PATCH /rest/v1/profiles?id=eq.<own-uuid> {"role":"admin"}.
-- There is no self-service profile-edit feature in the app, and admin role
-- management is preserved by the separate "Admin update profiles" policy
-- (USING/WITH CHECK get_my_role() = 'admin').
DROP POLICY "Users update own profile" ON public.profiles;

-- #2 (HIGH): get_push_subscriptions_for_email() is an admin-only SECURITY DEFINER
-- function (guarded internally) only ever called from authenticated admin sessions.
-- Remove the explicit anon EXECUTE grant. (NOTE: the PUBLIC grant is removed in the
-- follow-up migration 20260617062734 — revoking from anon alone is insufficient
-- because anon also inherits EXECUTE via PUBLIC.)
REVOKE EXECUTE ON FUNCTION public.get_push_subscriptions_for_email(text) FROM anon;

-- #3 (HIGH): get_users_with_roles() is an admin-only SECURITY DEFINER function
-- (guarded internally) only ever called from authenticated admin sessions.
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM anon;
