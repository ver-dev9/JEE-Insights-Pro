# Architecture

## Current release
A client-side React + TypeScript + Vite application. Paper metadata is stored in `src/data/papers.ts`; the archive page filters that dataset locally. Bookmarks are stored in browser localStorage and are device/browser-specific.

## Planned data model
- `papers`: year, session, date, shift, paper type, source, source URL, verification status.
- `questions`: stable NTA question ID, paper ID, subject, question type, prompt, options, answer, answer-key source, verification status.
- `question_tags`: question ID, chapter, topic, tagger, review status.
- `solutions`: question ID, explanation, formulas/concepts, author, review status.
- `attempts`: user/session, question ID, response, correctness, elapsed time.
- `bookmarks`: user/session and question ID.

## Next engineering steps
1. Catalog all 2022–2025 shift papers from official NTA documents and verify direct URLs.
2. Retrieve official final answer keys and map them to question IDs.
3. Build a reviewed extraction pipeline for question text and diagrams.
4. Add a relational backend and authenticated progress sync.
5. Add chapter analytics only after question-level tags are reviewed.
6. Add test coverage for marking schemes by examination year.

## Deployment
GitHub Actions builds the static Vite site and publishes `dist` to GitHub Pages.
