# Import the supplied PrepWiser question PDFs

The archive contains chapter PDFs across Physics, Chemistry and Mathematics. This pipeline extracts the question text and answer-key entries, retains the source PDF/page/question number, and imports rows with `verification_status='needs-review'`.

## Run locally

1. Install Python 3.10+ and dependencies:
   `python -m pip install pymupdf`
2. Extract candidates:
   `python scripts/extract-prepwiser-pdfs.py "PrepWiser-JEE-Main-PYQ-PDFs.zip"`
3. Install Node dependencies:
   `npm install`
4. Put the Supabase project URL and service-role key in an untracked `.env.local`:
   ```env
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
   ```
5. Import candidates:
   `node scripts/import-prepwiser-candidates.mjs data/prepwiser-question-candidates.json`

## Important

- The supplied PDFs contain text-extraction limitations: formulas, mathematical notation, diagrams and some options may be incomplete.
- Every imported row remains `needs-review`; answer keys are not exposed by the current practice-answer function until a question is explicitly verified.
- Chapter PDFs are partial collections, not complete shift papers. No CBT paper is created or published.
- Review the `sourcePdf`, `sourcePage`, `sourceQuestionNumber` and `extractionFlags` fields in the candidate JSON before promoting any question.
- Never commit `.env.local` or expose the service-role key in frontend code.
