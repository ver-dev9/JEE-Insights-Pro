# Integrated feature suite

This release adds five integrated navigation sections to the existing JEE Insights Pro React/Vite application.

## Shared data contract

All historical question insights read `src/data/questions.json`. The stable question ID is the intended join key for question discovery, practice attempts, CBT response events, performance summaries and chapter recommendations. The current data file contains **zero verified records**; the UI intentionally renders empty states and does not infer historical frequencies, difficulty distributions, annual averages or weightage.

## Feature status

| Feature | Implemented in this release | Requires verified data / backend |
|---|---|---|
| Chapter Heatmap | Subject/year filters; derives chapter list and counts from shared records; empty-state guard | Real chapter/topic/difficulty/shift distributions, historical consistency, weightage, comparison/export charts |
| CBT Simulator | Paper verification gate and explanatory state | Full paper packages, year-specific marking rules, hidden answer keys, timed autosaving, secure session backend, result engine |
| Personal Analytics | Optional Supabase email OTP sign-in entry point; local demo attempts remain labelled | Question-attempt event tracking, synced reports, mock history and performance metrics |
| Study Planner | Editable tasks; local persistence; authenticated Supabase task load/upsert/delete after migration | Automatic priority generation, revision engine, calendar and goals UI |
| Question Explorer | Reads verified question statements from Supabase when configured; subject/year/search filters; CSV export; question cards | Solutions/notes/bookmarks/collections and richer search indexing |

## Supabase foundation\n\n- Added \\`supabase/migrations/202611120001_initial_schema.sql\\` with profiles, papers, verified questions, isolated answer keys, attempts, exam sessions/responses, planner tasks/goals, collections and notes.\n- RLS policies scope personal records to \\`auth.uid()\\`; public reads are limited to verified question statements and published verified papers.\n- Direct client access to answer keys is intentionally blocked. The practice reveal RPC is authenticated; CBT scoring must be server-authoritative.\n- Added a browser-safe optional Supabase client and GitHub Pages build variables. Configure \\`VITE_SUPABASE_URL\\` and \\`VITE_SUPABASE_ANON_KEY\\` as GitHub repository variables after creating a Supabase project.\n- Added \\`scripts/import-verified-questions.mjs\\` for reviewed data import using a local service-role key. Never expose the service-role key to the browser or commit it.\n\n## Data integrity

- Demo questions in `src/data/demoQuestions.ts` remain explicitly separate from verified PYQs.
- No statistics are generated from the empty PYQ bank.
- The current GitHub Pages app is a static frontend. It does not have Supabase credentials, an authentication provider, server-side session handling or database RLS configured.
- Do not expose answer keys to client exam mode. A production CBT needs a server-authoritative exam session and scoring endpoint.

## Local verification

```bash
npm install
npm run typecheck
npm run build
npx playwright test
```

## Next implementation gates

1. Import reviewed official paper questions with stable IDs and final-answer-key provenance.
2. Add Supabase Auth + PostgreSQL migrations and RLS policies before user-specific analytics sync.
3. Add server-side exam-session APIs and year/paper-specific marking configurations.
4. Expand Playwright coverage for filter state, planner persistence, CSV export, timer, submission and mobile layouts.
