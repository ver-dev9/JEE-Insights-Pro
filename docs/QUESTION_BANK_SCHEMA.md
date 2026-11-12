# Question-bank schema and import policy

The practice engine supports MCQ and numerical-answer questions. Every official PYQ record must carry its examination year, session, date, shift, subject, chapter/topic tags, source URL and official answer-key source URL.

## Required fields
- `id`: stable unique identifier, e.g. `2025-jan-22-shift-1-physics-q001`
- `year`: 2022–2026
- `session`, `date`, `shift`
- `subject`: Physics, Chemistry or Mathematics
- `chapter`, `topic`
- `type`: `mcq` or `numeric`
- `prompt`, `options` for MCQ, `answer`
- `solution`: worked explanation reviewed by a subject reviewer
- `sourceUrl`, `answerKeySourceUrl`
- `verification`: `needs-review` or `reviewed`

## Practice flow
1. User selects an answer.
2. Submit locks the response and records the attempt locally.
3. The UI shows correctness and the answer.
4. The worked solution and concept takeaway are revealed.
5. User can continue or mark for review.

## Import
Run `node scripts/validate-question-import.mjs path/to/reviewed-questions.json`.
Only reviewed and source-traceable question records should be included in the official PYQ dataset.

## Current honest status
The included `src/data/demoQuestions.ts` contains original educational examples and is labelled **DEMO SET — NOT PYQs**. The verified official PYQ dataset is not yet populated. NTA's historical question-with-recorded-response material is not a single public bulk question-bank export; each paper/session and final key must be catalogued and checked individually.
