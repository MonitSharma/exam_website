# Website design and content mapping audit — 6 September 2026

The visual foundation is strong: cream backgrounds, forest-green actions, restrained orange accents, serif headings, consistent cards, and a readable mobile question screen. Content discovery and mapping need work before the site can be described as fully connected.

## Scope and verification

- Audited the local working tree, including pre-existing uncommitted generated content; this is not verification of the deployed website.
- Built the production site and inspected its homepage, calendar, essay opening, practice setup, and mobile question screen at 390 × 844.
- Production manifest: **276 question sets, approximately 4,174 questions, 336 notes**.
- `npm run build` passed, with Atlas coverage warnings.
- `npm run validate` passed; reported 13 explanations that require footer trimming at render time.
- `npm test`: **74/74 passed after building**. Initial run was 73/74 because an existing incomplete dist directory lacked index.html. The build-output test skips entirely when dist does not exist.
- Manifest paths exist and manifest IDs are unique. Daily CA and PIB notes all have same-date question sets; RC has 15 notes and 15 same-date sets. Date correspondence is not proof of semantic equivalence.
- Did not independently fact-check every generated question, answer key, news claim, or external citation. Did not complete a scored attempt or exhaustively test every lab, offline mode, or keyboard path.
- No application source changes were made. Build/test tools regenerated derived output; the pre-existing tracked/untracked change list was unchanged before adding this report.

## Findings, ranked by impact

### 1. High: five Places in News notes never become playable quizzes

The notes dated **8, 15, 22, 29 August and 5 September** contain 6, 6, 6, 7 and 7 MCQs respectively: **32 questions absent from playable weekly-news sets**. There are 11 notes but only six quiz sets.

`scripts/generate_content_manifest.js`, `parseWeeklyNewsMarkdown`, expects the heading `Quick map MCQs`; the newer files use `Map / location MCQs`. Their answer format also differs. `addWeeklyNewsQuestionSets` silently continues when parsing yields no rows.

Improve: accept the existing heading/answer variants, introduce a stable generation schema, and reject an MCQ-bearing source that yields zero or fewer-than-expected questions. Validate expected counts, option completeness, answer keys, and source-to-output lineage.

### 2. High: the latest Atlas material is missing

The build reports no matching Atlas week or features for **29 August and 5 September** despite those notes existing. Source: `data/atlas/news.json` and build coverage warnings.

The test named “the Atlas news data covers every Places in News note” only verifies that existing features reference weeks and existing weeks reference files. It does not check that every note has a week and pins (`test/content.test.js:60`).

Improve: validate both directions; generate pins alongside each note, and show an explicit “map pending” state when a note is published ahead of its map.

### 3. High: Study Labs omit relevant papers because subject metadata is truncated

`uniqueSubjects` in `scripts/generate_content_manifest.js:152` retains only five subjects. `LabSyllabusMap` in `app/labs.jsx:315` uses that list to discover related papers.

Concrete example: 2026 PYQ metadata contains Art and Culture, History, Geography, Environment and Economy, but the underlying questions also include Polity, Science & Technology and International Relations. Labs for those subjects can therefore miss the paper. Every available PYQ year has omitted subjects.

Improve: retain the full canonical subject set for matching; limit only the number of visual chips. For precise revision, maintain question-level topic IDs and launch a filtered practice set from a lab. Current lab links launch an entire paper.

### 4. High: date-based bundling merges unrelated material

`app/practice.jsx:10` and `app/home.jsx:910` identify question bundles using only source type plus date. Note bundles use cadence plus date (`app/home.jsx:954`).

Actual collisions:

- Four sectional tests on 29 June: Economy, Environment, International Relations and Science & Technology.
- GS Full Mock and Monthly Mock on 1 July, both classified as `ai`.
- Physics Optional Paper I and Paper II notes on 15 June.
- Four sectional notes on 29 June.

These are separate resources, but the UI collapses them into one card and labels choices simply “Core” or “Brief”. The content remains selectable through variant controls, but those labels hide which resource is being selected.

Improve: use an explicit bundle ID or parent-content ID. Only genuine companion/add-on resources should share a bundle. Preserve subject, paper and resource title in variant labels.

### 5. Medium: essays lack a complete UI mapping

Four `essay` notes are in the production manifest, but `CADENCE_META` (`app/home.jsx:933`) has no essay entry, so the library has no Essay tab. Calendar entries show the generic “Note” label. Opening an essay from the calendar loads it while the previous library category remains selected, creating a misleading context.

The search category dictionary (`app/root.jsx:130`) also uses `daily-mains`, whereas the manifest uses `mains`; Mains and essays therefore lose their specific search badge. Essay completion is not part of the existing writing cadence sets in Progress/Catch-up.

Improve: define all content categories once and share them across the library, calendar, search and progress. Add an explicit decision for whether essay reading or writing counts toward targets.

### 6. Medium: source citations render as raw Markdown

On the latest CA note, Sources entries appear as literal `[title](https://...)` text rather than links. `renderInline` (`app/home.jsx:1591`) handles emphasis, code and math but not Markdown links. Ordered lists separated by blank lines also restart at 1 because the renderer discards their start numbers.

Improve: use a consistent Markdown parser with safe link handling and preserve ordered-list numbering. Add representative fixtures for citations, lists, tables and physics notation. Keep sources directly usable from the reader.

### 7. Medium: some generated documents are outside discovery

`Essay_Topic_2026-08-10.md` and `reviews/Weekly_Review_2026-06-20.md` are absent from the manifest. Confirm whether each is intended as learner-facing content; if so, register the corresponding stream.

The 13 Recall_Quiz Markdown files are also absent from the notes list, but they are used to derive playable quizzes, so they are not simply lost. Their final explanations pick up footer material that is subsequently trimmed in the UI.

Improve: classify every generated resource as published, source-only, superseded or intentionally excluded. Report unclassified files. Stop explanation extraction at section boundaries rather than relying on render-time cleanup.

### 8. Medium: practice-set selection is not keyboard accessible

Set cards in `app/practice.jsx:148` are clickable divs without keyboard handling or a focusable semantic control. Unlike the answer-option buttons, these cannot be operated normally with Tab and Enter.

Improve: implement the single-selection set list as a radio group or buttons with explicit selection state. Audit focus order, selected states, icon labels and mobile drawer visibility with keyboard and screen-reader checks.

### 9. Medium: development and production manifests disagree

The existing local manifest lists **275 sets / 332 notes**; the rebuilt production manifest lists **276 / 336**. Local development can therefore appear to omit resources that the production build discovers.

The Pages check job also runs tests before building in a separate deploy job, so its production-output check is skipped on a clean checkout.

Improve: make content discovery a shared preflight step for serve/build/check; build and validate the exact artifact that will be deployed, including on pull requests. Fail on unexpected discovery gaps and unknown UI categories.

## Design improvements

1. **Simplify the homepage around a single next action.** Today’s Desk, Today’s Preparation, Latest Daily Quiz, Start First Quiz, and the header quiz action compete. Keep one primary “Continue preparation” action, the calendar, and a compact progress summary.
2. **Give the library its own navigation entry and reader page.** The homepage currently includes the complete selected note below many other modules. Notes should be easy to reach without scrolling through practice setup and dashboard content.
3. **Reduce mobile setup steps.** At 390 px, unavailable SSC/RBI/Banking cards occupy much of the first screen. Put future exams in a small disclosure and bring source/set selection and the start action forward.
4. **Make calendar material titles readable.** Multiple tiny cards truncate meaningful names. Use a simple list with a type icon, title, duration and completion state; group only explicitly linked note/quiz resources.
5. **Make catch-up relative to the learner’s start date.** A fresh browser immediately displays 103 pending items and a 99+ navigation badge. Offer “start today” or a chosen backlog window before assigning historical work.
6. **Use accurate labels and counts.** The hero says “a decade” but the site contains eight PYQ years, 2019–2026. Full and monthly mocks currently live under the generic AI source. Separate exam format from provenance so “AI generated”, “full mock” and “monthly” are independent properties.
7. **Use explicit relationships to support a study sequence.** A briefing should link to its quiz, relevant syllabus topic, Atlas features, related PYQs and flashcards when those links exist. Date and broad subject matches should be a fallback, not the identity of those relationships.

## Recommended implementation order

1. Repair the 32 missing map questions, two missing Atlas weeks, truncated subject lists and bundle collisions.
2. Centralize category metadata; fix essays/Mains labels, citations and accessible set selection.
3. Add coverage checks from generated source → manifest → production asset → visible UI category, plus explicit source/question/map relationships.
4. Simplify Home, add a Library route, and streamline mobile practice setup.

Acceptance criteria: every intended generated resource is accounted for; every known category has a UI destination; every quiz-bearing source produces the expected playable questions; all Atlas references resolve both ways; unrelated resources never collapse into one variant group; subject matching uses complete metadata; and representative desktop/mobile/keyboard flows pass against the production build.
