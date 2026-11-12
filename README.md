# JEE Insights Pro

A student-focused JEE Main preparation and paper-archive dashboard. The first release establishes the responsive application shell, verified-paper catalogue, source tracking, and GitHub Pages deployment.

> **Data integrity notice:** This repository does not claim to contain a complete 2022–2026 question-by-question transcription. The current catalogue links to verified official NTA paper PDFs where directly available and to the official NTA documents archive for earlier years. Transcribed question records: **0** in this release. Never treat a linked PDF count as an imported question count.

## Features
- Responsive dashboard and navigation.
- Year/session/subject searchable paper archive.
- Direct official NTA PDF links for the nine B.Tech papers listed on the NTA 2026 homepage.
- Official NTA documents archive links for 2022–2025.
- Source and verification metadata per paper record.
- Local browser bookmarks (stored in browser local storage).
- GitHub Pages deployment workflow.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Data status
- Coverage target: JEE Main Paper 1 (B.E./B.Tech), 2022–2026.
- Directly linked official NTA 2026 Session-II paper PDFs: 9.
- NTA-confirmed 2026 Session-I date/shift archive entries: 10 (official archive links; not direct question-paper PDFs).
- Earlier-year catalogue entries: four official NTA document archive entry points for 2022–2025, not individual shift links.
- Question text transcribed into the app: 0.
- Detailed worked solutions transcribed: 0.
- Chapter/topic tags: pending verified question-level import.

See [Data sources](docs/DATA_SOURCES.md) and [Architecture](docs/ARCHITECTURE.md).

## Deployment
The workflow in `.github/workflows/deploy.yml` deploys the Vite build to GitHub Pages when enabled in repository settings. In GitHub, set **Settings → Pages → Build and deployment → GitHub Actions**.

## Important
Official papers and answer keys remain hosted by NTA. This application links to those sources rather than copying third-party proprietary question banks. Check the source terms before redistributing any downloaded content.
