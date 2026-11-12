# Verified JEE Main Paper 1 data collection

## Current import status

- User-supplied archive indexed: **104 PDFs** (37 Physics, 36 Chemistry, 31 Mathematics).
- Chapter/year analysis available in the site: **8,366 question appearances for 2022–2026** and **11,593 for 2020–2026**.
- Verified question rows in Supabase/static question JSON: **0**.
- Complete 2022–2026 shift papers imported and QA-approved: **0**.
- Final answer-key mappings reviewed in the database: **0**.

The user stated that they own the uploaded PDFs and explicitly authorized their use in JEE Insights Pro. The repository currently contains the archive's chapter/year metadata, not the full PDF binaries or verified question text.

## What is live now

- The Chapter Heatmap page displays all current syllabus units.
- Each mapped unit shows its source chapter-PDF coverage and year-wise question appearances for 2022–2026.
- Historical Chemistry PDFs outside the current syllabus mapping are shown separately.
- The dashboard labels counts as PDF appearances because a question may occur in more than one chapter/topic PDF.

## Remaining question-bank import work

The Practice and CBT components intentionally query only `verification_status='verified'` rows from Supabase. Do not mark extracted text as verified automatically. For each question, visually check the complete statement, mathematical notation, diagrams, options, year/date/shift, chapter/topic and final answer. Then use the existing import pipeline:

1. Prepare reviewed records using `docs/verified-question-import-template.json`.
2. Run `node scripts/validate-question-import.mjs path/to/reviewed.json`.
3. Configure local untracked `.env.local` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. Run `node scripts/import-verified-questions.mjs path/to/reviewed.json`.
5. Keep paper batches unpublished until their complete question count, subject counts, marking scheme and final answer key have been audited.

Never put the Supabase service-role key in frontend variables or commit it.
