# JEE Main question-bank import status

## Archive inventory

- User-supplied archive: **104 PDFs** (37 Physics, 36 Chemistry, 31 Mathematics).
- Indexed chapter/year appearances: **8,366 for 2022–2026** and **11,593 for 2020–2026**.
- These are PDF question appearances, not deduplicated unique questions or official weightage.

## Import pipeline added

- `scripts/extract-prepwiser-pdfs.py` extracts question candidates, date/shift metadata, available options and answer-key entries.
- Each candidate retains its source PDF, page number and original question number.
- `scripts/import-prepwiser-candidates.mjs` imports records into Supabase with `verification_status='needs-review'`.
- `supabase/migrations/202611130001_reviewable_questions.sql` allows the practice page to display these clearly labelled review candidates.
- Practice mode disables answer reveal for unreviewed candidates. CBT continues to use verified, published complete papers only.

## What is not complete yet

- The Supabase database has **not yet received these candidate rows**.
- The extraction and import scripts are committed, but they require the user's local Supabase URL and service-role key in an untracked `.env.local`. Those credentials are not available to this repository automation and must never be pasted into chat or committed.
- Extracted formulas, diagrams, some options and answer keys may be incomplete. Candidates must remain `needs-review` until checked against the source PDF and final answer key.
- No partial chapter PDF is represented as a complete shift paper.

## Run the import locally

1. From the repository root, install the extractor dependency: `python -m pip install pymupdf`.
2. Extract the uploaded ZIP: `python scripts/extract-prepwiser-pdfs.py "PrepWiser-JEE-Main-PYQ-PDFs.zip"`.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to local `.env.local`.
4. Apply database migrations: `supabase db push`.
5. Import candidates: `node scripts/import-prepwiser-candidates.mjs data/prepwiser-question-candidates.json`.

Never expose the service-role key in frontend variables or commit it. Only promote a question to `verified` after checking its full statement, options, diagrams, chapter, exam metadata and answer key.
