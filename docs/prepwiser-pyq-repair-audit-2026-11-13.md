# PrepWiser PYQ repair audit — 13 November 2026

## Scope
- Source archive: `PrepWiser-JEE-Main-PYQ-PDFs (1)(1).zip`
- PDFs: 104
- PDF pages: 2,186
- Extracted question candidates: 11,593
- Subject distribution: Physics 3,980; Chemistry 3,659; Mathematics 3,954
- Source answer entries found: 11,585
- Missing source answer entries: 8
- Numerical candidates: 3,424
- Non-numerical candidates with four option strings detected by the first-pass parser: 8,169

## First-pass quality signals
These are **non-exclusive heuristic flags**, not counts of confirmed errors. A question can have several flags.

| Signal | Candidate count | Meaning |
|---|---:|---|
| Possible formula/layout gaps | 3,815 | Text extraction contains suspicious blank gaps; likely notation/layout loss in at least some records |
| At least one blank option string | 3,314 | One or more extracted option strings are empty |
| MCQ option count other than four | 379 | First-pass option parser did not return exactly four options |
| Very short/empty extracted prompt | 68 | Needs direct comparison with original PDF |
| Missing answer entry in source key | 8 | No matching answer entry was extracted from the PDF key |

The parser also produced occasional page-footer spillover and question/option text concatenation. Therefore the counts above must not be interpreted as proof that all other records are correct.

## Repair stage added
`scripts/render-prepwiser-question-pages.py` renders a page-faithful image crop for each question from the original PDF, using the question header and the next question header as visual boundaries. It writes:
- WebP question images under `public/question-pages/`
- A repair manifest with original PDF, page, question number, image path, answer provenance, and quality flags

Run after the existing extractor:
```bash
python -m pip install pymupdf pillow
python scripts/extract-prepwiser-pdfs.py "PrepWiser-JEE-Main-PYQ-PDFs.zip" -o data/prepwiser-question-candidates.json
python scripts/render-prepwiser-question-pages.py "PrepWiser-JEE-Main-PYQ-PDFs.zip" data/prepwiser-question-candidates.json
```

## Publication and answer policy
- The current production question bank is **not deleted or overwritten** by this repair stage.
- All imported source answers remain `needs-review`; PrepWiser's PDF answer-key section is provenance, not independent NTA verification.
- A visual crop is evidence for restoring notation, figures, and option layout; it does not itself verify the answer.
- Do not set `verification_status='verified'` until the question and answer are independently checked against a reliable official key/source.
- Stage and validate the manifest and assets before any production swap.
- The generated image assets must be deployed to the site's static host or uploaded to configured object storage before the manifest image paths can work in production.
