# Verified JEE Main Paper 1 data collection

## Official NTA entry points checked 12 November 2026

- NTA JEE Main homepage and current question-paper links: https://jeemain.nta.nic.in/
- NTA Documents archive: https://jeemain.nta.nic.in/documents/
- 2025 document archive, page 5: https://jeemain.nta.nic.in/documents/page/5/
- 2025 public notices: https://jeemain.nta.nic.in/document-category/2025-public-notices/
- 2025 public notices, page 2: https://jeemain.nta.nic.in/document-category/2025-public-notices/page/2/

NTA currently exposes the 2026 Paper 1 Session 2 question-paper links from the homepage and lists a 2026 Paper 1 session document and final answer-key documents in the documents archive. The 2025 archive includes final-answer-key records for Paper 1 sessions. The existence of these PDFs does not mean every shift's question text, answer mapping, topic classification or worked solution has been imported into this repository.

## Current import status

- Verified question records in the committed static JSON: **0**
- Reviewed 2022–2026 complete shift papers imported: **0**
- Question-level final answer mappings reviewed: **0**
- No chapter-frequency, difficulty or weightage statistics should be inferred from source-link counts.

## Required human verification

For each question, verify exact question statement/options, year/session/date/shift, subject, chapter/topic, question type, and final answer key. Record the exact source URLs and reviewer/time. Use `docs/verified-question-import-template.json` as the record shape. Only records with `verification: "verified"` pass the production validator.

## Import path

1. Prepare a JSON array from source documents and manually review every record.
2. Run `node scripts/validate-question-import.mjs path/to/reviewed.json`.
3. Configure local untracked `.env.local` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. Run `node scripts/import-verified-questions.mjs path/to/reviewed.json`.
5. The script stores question statements in `questions` and answers/solutions in `question_answer_keys`. It never writes the service-role key into the frontend.
6. Imported paper records are deliberately unpublished; verify the complete paper and marking scheme, then publish through a controlled admin workflow.

Do not copy complete question papers from unofficial sources into production without checking rights and official provenance. NTA's candidate response sheets and recorded-response materials may require candidate login and are not public question-bank datasets.
