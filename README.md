# UPSC CSE PYQ Mock Test Platform

A free, static UPSC CSE Prelims GS Paper I mock test platform built with HTML, CSS, JavaScript, and JSON.

## Current Scope

- Years: 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026
- Paper: UPSC CSE GS Paper I
- Mode: static frontend, no backend, no login, no database
- Data: previous-year questions, AI-generated batches, CSR mock batches, and daily quizzes from JSON files
- Answer keys: extracted from Set A answer-key images where available
- Attempt history: stored in browser `localStorage`

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
daily_current_affairs/
daily_reading_comprehension/
```

Weekly notes are split by stream:

```text
weekly/Sunday/
weekly/CSAT/
weekly/Physics/
```

Use these filename patterns so the site can discover new content during build:

```text
daily_current_affairs/UPSC_CA_YYYY-MM-DD.md
daily_reading_comprehension/RC_Drill_YYYY-MM-DD.md
generated_questions/daily_questions/daily_questions_YYYY-MM-DD.json
weekly/Sunday/Sunday_Sweep_YYYY-MM-DD.md
weekly/CSAT/CSAT_Practice_YYYY-MM-DD.md
weekly/CSAT/CSAT_PYQ_YYYY-MM-DD.md
weekly/Physics/Physics_Drill_YYYY-MM-DD.md
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

History is local to the current browser/device. Users can export it as JSON or clear it from the home/result dashboard.

## Deploy On GitHub Pages

The repo ships with a workflow at `.github/workflows/pages.yml` that builds a
production bundle (esbuild) and deploys to GitHub Pages on every push to `main`.

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
python3 -m http.server 8001
```

then open <http://localhost:8001>. The production build is only used by
the Pages workflow (see `build.js`).
