-- Security fix #4 (audit 2026-06-16): length CHECK constraints
--
-- public.user_submissions and public.reports accept public INSERTs
-- (the "Public insert ..." policies). The app caps field lengths client-side
-- via src/lib/validation.ts MAXLEN, but the database itself had no length
-- limits, so a scripted insert bypassing the UI could store arbitrarily large
-- text and bloat the (free-tier) database. These CHECK constraints mirror the
-- MAXLEN caps as a server-side backstop.
--
-- Verified before applying that existing rows already fit (longest value was a
-- 257-char description vs the 1000 cap; reports was empty), so the constraints
-- validate cleanly against current data.

alter table public.user_submissions
  add constraint user_submissions_name_len         check (char_length(name) <= 120),
  add constraint user_submissions_category_len     check (category is null or char_length(category) <= 80),
  add constraint user_submissions_city_len         check (city is null or char_length(city) <= 80),
  add constraint user_submissions_area_len         check (area is null or char_length(area) <= 80),
  add constraint user_submissions_description_len  check (description is null or char_length(description) <= 1000),
  add constraint user_submissions_address_len      check (address is null or char_length(address) <= 300),
  add constraint user_submissions_hours_len        check (hours is null or char_length(hours) <= 120),
  add constraint user_submissions_submitted_by_len check (submitted_by is null or char_length(submitted_by) <= 120);

alter table public.reports
  add constraint reports_place_slug_len   check (char_length(place_slug) <= 80),
  add constraint reports_place_name_len   check (place_name is null or char_length(place_name) <= 120),
  add constraint reports_message_len      check (char_length(message) <= 1000),
  add constraint reports_contact_len      check (contact is null or char_length(contact) <= 120),
  add constraint reports_submitted_by_len check (submitted_by is null or char_length(submitted_by) <= 120);
