# Contributing

## Development
1. Install Node.js 22 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Run `npm run typecheck` and `npm run build` before opening a PR.

## Question-data rules
- Do not invent questions, options, answer keys or exam metadata.
- Every imported PYQ needs official source and final answer-key URLs.
- Record year, session, date, shift, subject and chapter/topic.
- Mark uncertain records as `needs-review`; do not publish them as verified.
- Worked solutions must be checked for mathematical correctness.
- Clearly distinguish original practice examples from official exam questions.

## UI changes
Keep the practice experience responsive and test both desktop and mobile. Screenshots are generated in CI using Playwright.
