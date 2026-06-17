-- Security fixes #2 / #3 (corrective) — audit 2026-06-16
--
-- The preceding migration revoked EXECUTE from `anon`, but that did not actually
-- remove anon's access: both functions were also granted EXECUTE to PUBLIC at
-- creation time, and anon inherits EXECUTE via PUBLIC. Revoke the PUBLIC grant.
--
-- `authenticated` and `service_role` hold *explicit* EXECUTE grants on both
-- functions, so revoking PUBLIC does not affect them — only anon/unauthenticated
-- callers lose access. (Same pattern as 20260529064458_harden_handle_new_user_revoke_public_execute.)
REVOKE EXECUTE ON FUNCTION public.get_push_subscriptions_for_email(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM PUBLIC;
