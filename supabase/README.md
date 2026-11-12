# Supabase backend setup

## What is included

- One shared PostgreSQL schema for profiles, published paper metadata, verified questions, private answer keys, attempts, exam sessions/responses, planner tasks/goals, collections and notes.
- Row-level security (RLS) for all user-owned data.
- Public/anonymous reads are limited to verified question statements and published verified paper metadata.
- Answer keys have RLS enabled and intentionally have no browser-facing policy. Practice answer reveal is through an authenticated RPC; CBT answer keys must remain server-only.
- Browser client is optional and only initializes when both public environment variables are present.

## Setup required by the repository owner

1. Create a Supabase project.
2. Install Supabase CLI locally and link the project.
3. Apply migration: `supabase db push`.
4. In Supabase Auth, configure email OTP and the production site URL plus localhost redirect URLs.
5. Add GitHub Actions repository secrets/variables:
   - `VITE_SUPABASE_URL` (repository variable)
   - `VITE_SUPABASE_ANON_KEY` (repository variable; publishable/anon key only)
6. Add the same values to local `.env.local` for development. Do not commit real values.
7. Never add `service_role` or database passwords to frontend variables. Use server/Edge Functions for privileged imports and CBT scoring.

## Question import rules

- Import only after a human review confirms question text, options, paper date/shift, subject/chapter/topic, source document and final answer-key mapping.
- `verification_status='verified'` is required for public display and analytics.
- Keep answer key and solutions in `question_answer_keys`, not in the public question table.
- Each imported question needs a stable unique ID and both paper and answer-key provenance.
- Do not treat the existence of a linked NTA PDF as proof that its questions have been transcribed or checked.

## Current limits

No Supabase project credentials have been supplied or configured in this repository, and no question-level PYQ records have passed review. This migration is a ready-to-apply foundation, not a claim that a live database has already been provisioned. CBT start/submit/scoring should be implemented in trusted Edge Functions before enabling exam mode.
