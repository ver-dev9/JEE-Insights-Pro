# Question-bank schema and import policy

The app supports single-correct MCQs and numerical-answer questions in Practice and CBT modes. The importer accepts only reviewed, source-traceable records. It does not scrape or infer question text or answers.

## Required question fields

Each row in the JSON array must include:
- `id`: stable unique ID.
- `paperId`: stable paper ID shared by all questions in one shift.
- `year`: 2022–2026; `session`, `date` (YYYY-MM-DD), `shift`.
- `subject`: Physics, Chemistry or Mathematics; `chapter`; optional `topic`.
- `type`: `mcq` or `numeric`; `prompt`; `options` for MCQs; `answer`.
- `sourceUrl`, `answerKeySourceUrl`: HTTPS references to the exact paper and final answer key.
- `verification`: exactly `verified`; `answerKeyVerifiedBy` and `answerKeyVerifiedAt`.
- `paperDurationMinutes`, `paperMarkingScheme`, `paperSourceUrl` for paper metadata.
- `expectedQuestionCount`, `expectedSubjectCounts` (object with Physics/Chemistry/Mathematics counts), and `paperComplete: true` only after the entire shift has been checked.
- Optional `solution`, `shortSolution`, `formula`, `difficulty`, `imageUrl`.

The expected subject counts must match the specific exam year's paper pattern. Do not assume every year has the same number of questions.

## Two-stage QA and import

1. Validate each row:
   `node scripts/validate-question-import.mjs path/to/reviewed-questions.json`
2. Audit whole paper batches:
   `node scripts/audit-paper-batches.mjs path/to/reviewed-questions.json`
   or `npm run audit:papers -- path/to/reviewed-questions.json`
3. Import from a trusted local machine only:
   `node scripts/import-verified-questions.mjs path/to/reviewed-questions.json`
   Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in an untracked local `.env.local`. Never put the service-role key in frontend variables or commit it.
4. Paper rows remain unpublished until a separate paper-level QA and release review is completed.

## CBT and practice behaviour

- Practice filters by subject, year and chapter.
- CBT selects one paper batch and keeps all its questions together; practice filters cannot silently shrink a CBT paper.
- A CBT paper must be a complete shift batch, not a mixed set of questions.
- Answer keys are revealed after submission through the protected database function.
- Do not count a partial batch as a full paper or show derived shift statistics from incomplete coverage.

## Copyright and source integrity

NTA's public document archive is the primary source for locating papers and final answer keys. Public availability does not automatically grant redistribution rights. This repository contains application code and metadata; only import question text when you have permission or a licence that allows the intended storage and display. Otherwise keep official links and paper metadata and let users open the original source.

## Current honest status

`src/data/questions.json` currently has zero imported official question records. Original examples in `src/data/demoQuestions.ts` are not PYQs. The UI and importer are infrastructure, not proof that the 2022–2026 question archive is complete.
