# Website audit fixes — 7 September 2026

Implemented the findings in `2026-09-06-design-content-audit.md` and verified the resulting production build locally.

## Content and relationships

- Restored all 32 missing Places in News quiz questions across five weekly files, including multiline choices and the alternate answer heading format.
- Added the two missing Atlas weeks with 14 source-linked locations each. Coordinates are explicitly approximate regional study anchors; this work checks source mapping, not the factual accuracy of every generated news claim.
- Retained all subjects in paper metadata. Study Labs now launch matching subject questions with original question identities, rather than whole papers.
- Replaced date-only grouping with explicit bundle and parent relationships. Independent same-day material stays separate; companion labels no longer mistake the day of the month for a variant number.
- Added reciprocal note, quiz and flashcard links, source lineage and Atlas links. All 11 flashcard decks have explicitly mapped related briefings.
- Made essays, reviews and retained reference material discoverable. A source inventory records published material, source-only duplicates and intentional exclusions; unclassified files fail validation.
- Fixed Markdown citations, balanced URL parentheses, ordered list numbering and quiz explanation footers. Unsafe URL schemes remain plain text.

## Interface and progress

- Simplified Home around one next-session action, a readable daily calendar and the weekly study plan.
- Added a dedicated Library with categories, week filters, source relationships and reloadable note links.
- Distinguished full papers, monthly mocks, sectionals and drills; made paper choices keyboard-operable and reduced mobile clutter.
- Added a catch-up start date and explicit writing completion, including essays. Existing progress is migrated without discarding history.
- Fixed untimed sessions, subject-practice progress identity and mobile question-drawer focusability. Search and test dialogs manage keyboard focus and Escape.
- Adjusted mobile and tablet navigation, visible focus styles and compact practice layouts.

## Validation

- `npm run check`: production build and content validation passed; **88 tests passed, zero failures or skips**.
- Validated **286 question sets, 4,234 questions and 358 notes** with the latest generated 7 September content included.
- Strengthened the subject identity regression assertion after the full run and reran the audit regression suite successfully.
- `git diff --check`: passed.
- Browser checks: Library selection and reload links; All weeks filtering; essay and Atlas links; keyboard paper selection; 20-question history PYQ session scored out of 40; mobile search Escape/focus restoration; hidden drawer inertness and open controls; 390px mobile and 820px tablet overflow checks. No browser warning/error logs were recorded in the final session.
- CI now deploys the exact artifact that passed validation. Development and production use the same manifest generation and content coverage checks.

Changes and the rebuilt `dist/` are local. No deployment or remote push was performed.
