# PrepWiser JEE Main PYQ archive audit

Source reviewed: user-supplied `PrepWiser-JEE-Main-PYQ-PDFs.zip`. The user stated that they own the PDFs and explicitly authorized their use in this project.

## Inventory

- 104 chapter PDFs inspected: 37 Physics, 36 Chemistry, 31 Mathematics.
- 11,593 question appearances across 2020–2026.
- 8,366 question appearances across the requested 2022–2026 window.
- The archive contains chapter/topic PDFs, not a set of complete shift papers.
- Chapter and year counts are indexed in `src/data/archiveChapterStats.json` and displayed in the Chapter Heatmap dashboard.

## Year-wise question appearances

Counts are extracted from question headers across all PDFs. A question can appear in more than one chapter/topic PDF, so these are PDF appearances, not deduplicated unique exam questions.

| Year | Physics | Chemistry | Mathematics | Total appearances |
|---|---:|---:|---:|---:|
| 2020 | 381 | 334 | 373 | 1,088 |
| 2021 | 743 | 666 | 730 | 2,139 |
| 2022 | 655 | 594 | 649 | 1,898 |
| 2023 | 682 | 621 | 673 | 1,976 |
| 2024 | 584 | 535 | 588 | 1,707 |
| 2025 | 468 | 439 | 470 | 1,377 |
| 2026 | 467 | 470 | 471 | 1,408 |
| **Total** | **3,980** | **3,659** | **3,954** | **11,593** |

## Current syllabus mapping

- 96 of the 104 archive chapter PDFs are mapped to one of the current 54 JEE Main Paper 1 syllabus units.
- 8 historical Chemistry PDFs are retained separately: Chemistry in Everyday Life, Environmental Chemistry, Hydrogen and s-Block Elements, Metallurgy, Nuclear and Radiochemistry, Polymers, Solid State, and Surface Chemistry.
- Mapping is a navigation aid; it does not imply that every historical topic remains in the current syllabus.

## Question-bank status

The live Practice and CBT engines still read only question rows marked `verified` in Supabase. The archive analytics currently imported into the repository are chapter/year metadata only. The original question statements, options, diagrams and answer keys have **not** yet been imported as verified database records. This prevents incomplete text extraction from being presented as an accurate question.

The user has authorized use of the PDFs, so the next import stage can extract question records for review. Mathematical notation, diagrams and answer keys still require visual/source validation before records are marked verified or published.

## Interpretation

These figures describe the supplied archive only. They are not official NTA chapter weightage percentages, a deduplicated count of unique questions, or predictions of future examination distribution. Complete shift-level weightage requires verified full-paper denominators.
