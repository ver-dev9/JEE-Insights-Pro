# PrepWiser PYQ repair audit — 13 November 2026

## Source archive and extraction
- Source archive: `PrepWiser-JEE-Main-PYQ-PDFs (1)(1).zip`
- PDFs: 104
- PDF pages: 2,186
- Question candidates: 11,593
- Physics: 3,980; Chemistry: 3,659; Mathematics: 3,954
- Source answer entries extracted: 11,585
- Missing source answer entries: 8

## Page-faithful image repair completed
- Individual WebP question crops rendered: 11,593
- Unique question IDs: 11,593
- Missing image files in the generated bundle: 0
- Total image asset size: approximately 84.6 MB
- Sample checked: the Chemistry reaction question crop preserves the chemical structure, reaction arrow, statements and all four answer choices.
- Each image is based on the original PrepWiser PDF page; images are visual evidence, not independent answer verification.

## Automated quality flags
Flags overlap; they are not all confirmed errors.

| Flag | Candidates |
|---|---:|
| Blank extracted option text | 3,314 |
| MCQ option count other than four | 379 |
| Visual content reference (figure/diagram/reaction etc.) | 1,207 |
| Empty or short extracted prompt | 8 |
| Missing source answer entry | 8 |

The image crops preserve original layout when the text parser loses formulas or diagrams. The extracted text and option strings are still retained for audit; use the original page crop as the visual source of truth.

## Database preparation
Applied additive columns to `public.questions`:
- `source_pdf`, `source_page`, `source_question_number`
- `source_answer_value`, `answer_provenance`, `quality_flags`

Added a service-role-only RPC, `public.apply_question_source_metadata(jsonb)`, to batch-update existing question rows without accidentally inserting partial records. Added a migration file in the repository for both schema changes and the RPC.

The Practice workspace now selects and displays `image_url` when present. The uploader creates a public `question-assets` Storage bucket if needed, uploads WebP files, then calls the restricted RPC to set image URLs and provenance.

## Production safety
- Production currently remains unchanged: 11,593 questions, 0 image URLs, 0 source metadata rows, 11,593 `needs-review`, 0 verified.
- No question rows were deleted or replaced.
- No answer was marked verified.
- PrepWiser PDF answer entries are recorded as source provenance only. They are not independent verification of the official NTA final answer key.
- The image bundle has been generated and validated locally. It must be extracted into the local repository and uploaded with the service-role script before production questions display the images.

## Local upload step
Download `jee-pyq-repair-assets-2026-11-13.zip` from the ChatGPT conversation, extract it into the repository root (preserve `public/` and `data/` paths), pull the latest `main`, then run:

```powershell
git pull origin main
npm install
node scripts/upload-prepwiser-repair-assets.mjs data/prepwiser-repair-manifest.json public/question-pages
```

The repository's `.env.local` must contain `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never commit or share that file. The script is resumable at the asset level through Storage upsert and does not change verification status.

After upload, verify counts for `image_url` and `source_pdf`, then test subject and chapter practice. Keep answer reveal disabled for all `needs-review` rows until independent answer validation is completed.
