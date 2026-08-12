# UPSC CSE PYQ Mock Test Platform

A free, static UPSC CSE Prelims GS Paper I mock test platform built with HTML, CSS, JavaScript, and JSON.

## Current Scope

- Years: 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026
- Paper: UPSC CSE GS Paper I
- Mode: static frontend, no backend, no login, no database
- Data: previous-year questions, AI-generated batches, CSR mock batches, and daily quizzes from JSON files
- Answer keys: extracted from Set A answer-key images where available
- Attempt history: stored in browser `localStorage`
- Atlas: current-affairs geography plus an India historical time machine (1188–2026)

## Historical Atlas Credit

The **India through time** mode adapts district-level historical territory,
polity, ruler, and event data published by
[BharatRajya](https://www.bharatrajya.com/). BharatRajya releases its maps and
data under [Creative Commons Zero (CC0 1.0)](https://creativecommons.org/publicdomain/zero/1.0/).
Attribution is not required by CC0, but this project gratefully credits the
original work and recommends consulting BharatRajya's
[sources](https://www.bharatrajya.com/sources) for the underlying historical
scholarship.

Pariksha uses a locally stored, on-demand derivative covering the wider Indian
subcontinent: present-day India, Pakistan, Bangladesh, Nepal and Sri Lanka,
with neighbouring-country context for frontier events. The historical
boundaries are approximate reconstructions projected onto modern district
shapes for educational use; they are not legal or political claims. The
imported snapshot was retrieved on 26 July 2026.

## Study Labs Inspiration

The **Study Labs** section is inspired by the visual, syllabus-wise learning
approach demonstrated by [upsc.labs](https://upsclabs.vercel.app/), including
its use of interactive timelines, maps, and active-recall tools for UPSC
revision. See the specific [GS1 tool collection](https://upsclabs.vercel.app/gs1)
for the reference pattern.

Pariksha's Study Labs implementation, content, code, and visual treatment are
original to this project and are not affiliated with or endorsed by upsc.labs.

## Run Locally

Normalize the raw JSON:

```bash
python3 scripts/normalize_questions.py --years 2019 2020 2021 2022 2023 2024 2025 2026
```

Normalize generated AI, CSR, and CSAT batches:

```bash
python3 scripts/normalize_generated_questions.py
```

Add a daily quiz file:

```bash
python3 scripts/add_questions.py --cadence daily --input generated_questions/daily_questions/june_07.json --date 2026-06-07
```

Daily files should be JSON arrays of 4-option MCQs with `question`, `options`, `answer`, `explanation`, and metadata fields such as `subject`, `theme`, `micro_topic`, `nature`, and `difficulty`.

Optionally merge answer keys:

```bash
python3 scripts/extract_answer_keys_from_images.py --years 2019 2020 2021 2022 2023 2024 2025 2026
python3 scripts/merge_answer_keys.py --years 2019 2020 2021 2022 2023 2024 2025 2026
```

The image extractor uses Tesseract OCR and expects Set A PNG files in:

```text
generated_questions/answer_keys/
```

Validate processed data, including generated question sets:

```bash
python3 scripts/validate_data.py
```

Serve the static app:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

The default entry point now uses the Pariksha frontend design. The previous static UI is still available at:

```text
http://localhost:8000/legacy.html
```

## Data Pipeline

Raw files live in:

```text
data/raw/
```

Generated source batches live in:

```text
generated_questions/ai_generated_questions/
generated_questions/csr_questions/
generated_questions/daily_questions/
generated_questions/csat_mocks/
generated_questions/csat_questions/
```

Daily markdown reading material lives in:

```text
daily/daily_current_affairs/
daily/daily_pib/
daily/daily_reading_comprehension/
```

Weekly notes are split by stream:

```text
weekly/Sunday/
weekly/CSAT/
weekly/Physics/
weekly/Editorials/
```

Use these filename patterns so the site can discover new content during build:

```text
daily/daily_current_affairs/UPSC_CA_YYYY-MM-DD.md
daily/daily_pib/PIB_YYYY-MM-DD.md
daily/daily_reading_comprehension/RC_Drill_YYYY-MM-DD.md
generated_questions/daily_questions/daily_questions_YYYY-MM-DD.json
generated_data/pib_questions/YYYY-MM-DD.json
weekly/Sunday/Sunday_Sweep_YYYY-MM-DD.md
weekly/CSAT/CSAT_Practice_YYYY-MM-DD.md
weekly/CSAT/CSAT_PYQ_YYYY-MM-DD.md
weekly/Physics/Physics_Drill_YYYY-MM-DD.md
weekly/Editorials/Editorials_Mains_YYYY-MM-DD.md
```

The GitHub Pages build runs `scripts/generate_content_manifest.js` through
`npm run build`. That manifest is generated from the folders above, so after
adding new files with the same naming scheme, pushing to `main` is enough for
the deployed site to show them.

Processed files are written to:

```text
data/processed/
```

Answer key files live in:

```text
data/answer_keys/
```

Answer key entries should use this shape:

```json
[
  {
    "question_number": 1,
    "answer_option": "b",
    "accepted_answer_options": ["b"],
    "explanation": "Explanation text here.",
    "verification_status": "verified"
  }
]
```

## Scoring

The app uses the UPSC GS Paper I rule:

- Correct: +2
- Wrong: -0.66
- Unattempted: 0
- Missing answer key: excluded from score
- Dropped question: excluded from score

When answer keys are missing, the result screen shows a provisional-score warning. If no answer keys are available, score is shown as not available.

## Attempt History

Submitted attempts are saved in browser `localStorage` so users can compare scores over time without any paid hosting or database. The dashboard shows score trend, question-set averages, subject accuracy, difficulty accuracy, recurring weak topics, and recent attempts.

History is local to the current browser/device. The progress dashboard can export it as JSON, restore a previous export, or clear it.

To keep storage bounded over a long preparation cycle, only the most recent 400
attempts are kept in full detail. Older attempts are folded into per-month
totals (`archive` in the stored object), so lifetime accuracy, questions solved
and best score stay exact while the stored size stops growing.

## Revision Queue (Spaced Repetition)

Every submitted question is graded individually, and the ones answered wrongly
enter a Leitner queue stored alongside the attempt history. A question returns
after 1, 3, 7, 16, 35 then 90 days; answering it correctly each time moves it up
a box, a wrong answer sends it back to the start, and clearing the last box
retires it from the queue altogether.

Questions answered correctly the first time are never tracked, so the queue
stays a working set of "what I still get wrong" rather than a copy of the
question bank. It is capped at 1,500 entries, evicting the closest to mastery
first.

The Progress screen shows what is due and starts a revision session of up to 20
questions drawn from across every source set. Answers there update the schedule
of the *original* questions, and revision runs carry no negative marking.

The model and scheduling live in `app/progress.js`, covered by
`test/progress.test.js`.

## Search

The search palette (⌘K / Ctrl-K) matches note titles and question-set metadata
instantly from the content manifest, and searches the full text of every note
against an inverted index built at deploy time by
`scripts/generate_search_index.js`.

The index is split into one shard per note month. Content lands daily, so a
single index file would be invalidated and re-downloaded every day; sharded,
only the current month changes and earlier months stay cached indefinitely. The
client loads the four newest shards on demand and offers to search older ones.

Snippets are not stored in the index — the note body is fetched and cached only
for the handful of results actually on screen.

`config/search/` is generated output and is **not** committed: at ~170 KB of
churn per day it would bloat git history for no benefit, since the Pages build
regenerates it on every deploy. Run `npm run search-index` once locally to get
full-text search in dev; without it, title and metadata search still work.

The tokenizer is duplicated between `scripts/generate_search_index.js` (build)
and `app/search.js` (browser) because they run in different places;
`test/search.test.js` asserts the two agree, since any divergence would silently
stop queries from matching.

## Offline Use

The production build ships a service worker (`scripts/generate_service_worker.js`)
and a web app manifest, so the site is installable and works with no connection:

- The app shell — bundle, styles, content manifest, vendored libraries — is
  precached on first visit and swapped atomically when a new build is deployed.
- Notes and question sets are cached as they are opened (stale-while-revalidate:
  instant from cache, refreshed in the background).
- **Save for offline** on the Progress screen stores the last 14 days of notes
  and question sets plus the search index in one go, so material can be read and
  attempted without ever having opened it online.

The worker is registered only by the production page. `index.html` deliberately
does not register it, because the dev server serves everything `no-store`.

## Deploy On GitHub Pages

The repo ships with a workflow at `.github/workflows/pages.yml`. It runs the
test suite and content validation first, then builds a production bundle
(esbuild) and deploys to GitHub Pages on every push to `main`. Because content
arrives from unattended scheduled jobs, a malformed drop fails the `check` job
instead of reaching the live site.

One-time setup:

1. Push this folder to a GitHub repository.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.

The first push triggers the workflow; subsequent pushes auto-deploy. Keep
`data/processed/*.json`, `app/*`, `index.html`, and `config/exam_patterns.json`
committed.

## Local Development

`index.html` uses Babel-in-browser so you can edit `app/*.jsx` and reload
without a build step. Serve the repo root over HTTP:

```bash
npm run serve
```

then open <http://localhost:8001>. That server sends `no-store` on everything,
so edits always show up on reload. The production build is only used by the
Pages workflow (see `build.js`).

`build.js` reads its script load order straight from `index.html`, so adding a
new `app/*.jsx` file to the page is enough — there is no second list to update.

React is vendored under `vendor/react/` (production builds for the deployed
site, development builds for `index.html`), so the live site has no third-party
runtime dependency. Only `@babel/standalone` still comes from a CDN: it is
3.1 MB, is needed solely for the dev loop, and never ships.

### Commands

| Command | What it does |
| --- | --- |
| `npm run serve` | Dev server on :8001, no caching |
| `npm test` | Unit tests (`node --test`, no dependencies) |
| `npm run validate` | Checks every question set and note the manifest references |
| `npm run manifest` | Regenerates `config/content_manifest.json` |
| `npm run search-index` | Regenerates `config/search/` |
| `npm run build` | Full production build into `dist/` |

`npm run build` regenerates the manifest and search index itself, so the two
generator commands are only needed to refresh what local dev reads.

### Weekly content checklist

- **Places in News** notes go in `weekly/weekly_news/`. Their map pins live in
  `data/atlas/news.json` (`weeks` + `features`), which the Atlas fetches on
  demand rather than shipping in the bundle. `npm run build` warns when a note
  has no matching Atlas week or features.
- Run `npm run manifest && npm run search-index` after adding content so local
  dev picks it up; the Pages build regenerates both either way.
- A question set that arrives with **no answer keys at all** is dropped from the
  manifest by the build, with the filename printed — it cannot be scored, so
  serving it is worse than omitting it. Regenerate the file and it returns.
- The build fails if the hardcoded fallback list in `app/data.js` points at
  files that no longer exist, and copies any manifest-referenced file that sits
  outside the static copy list so it cannot 404 in production.
