# Integrated feature suite

This release adds five integrated navigation sections to the existing JEE Insights Pro React/Vite application.

## Shared data contract

All historical question insights read `src/data/questions.json`. The stable question ID is the intended join key for question discovery, practice attempts, CBT response events, performance summaries and chapter recommendations. The current data file contains **zero verified records**; the UI intentionally renders empty states and does not infer historical frequencies, difficulty distributions, annual averages or weightage.

## Feature status

| Feature | Implemented in this release | Requires verified data / backend |
|---|---|---|
| Chapter Heatmap | Subject/year filters; derives chapter list and counts from shared records; empty-state guard | Real chapter/topic/difficulty/shift distributions, historical consistency, weightage, comparison/export charts |
| CBT Simulator | Paper verification gate and explanatory state | Full paper packages, year-specific marking rules, hidden answer keys, timed autosaving, secure session backend, result engine |
| Personal Analytics | Reads existing browser-local demo attempts and labels them as demo | Auth, PostgreSQL, RLS, event tracking, mock history, subject/chapter metrics |
| Study Planner | Editable daily tasks, duration, subject, completion, deletion; local persistence | Personalized automatic scheduling, revision engine, account sync |
| Question Explorer | Shared-bank search, subject/year filters, CSV export of matching verified records | Question cards, solutions, collections, notes, bookmarks, indexed backend search |

## Data integrity

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
