#!/usr/bin/env python3
"""Append generated MCQs into the practice question bank.

Reads a JSON array of generated multiple-choice questions and merges them into a
date-bucketed question set that the static app loads via config/exam_patterns.json.

The merge is idempotent: re-running with the same questions will NOT create
duplicates (dedupe is by normalized question text within the target set).

Usage
-----
  python3 scripts/add_questions.py --cadence daily   --input generated_data/daily_questions/june_07.json --date 2026-06-07
  python3 scripts/add_questions.py --cadence weekly  --input new_qs.json
  python3 scripts/add_questions.py --cadence monthly --input new_qs.json

Cadence buckets (auto-named from --date, defaults to today):
  daily      -> daily_questions_YYYY_MM_DD (category "Daily Questions")
  weekly     -> weekly_quiz_YYYY_MM        (category "Weekly Quiz")
  monthly    -> monthly_mock_YYYY_MM       (category "Monthly Mock")
  redemption -> redemption_practice_YYYY_MM
  quarterly  -> full_mock_YYYY_MM

Input schema (JSON array of objects)
------------------------------------
  {
    "question": "stem text; multi-statement stems may use \\n",
    "options": ["(a) ...", "(b) ...", "(c) ...", "(d) ..."],
    "answer": "(c)",                  # or "c" -- the correct option letter
    "explanation": "one-line reason",
    "subject": "Environment",
    "theme": "Biodiversity",          # optional
    "micro_topic": "Protected Areas", # optional
    "nature": "Current Affairs",      # optional: Current Affairs|Factual|Conceptual|Analytical
    "difficulty": "Moderate"          # optional: Easy|Moderate|Hard
  }

Only well-formed 4-option MCQs are ingested. Descriptive items are skipped
because they are not part of this MCQ bank.
"""
from __future__ import annotations

import argparse
import json
import re
from datetime import date, datetime
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[1]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
QUESTION_BANK_RAW_DIR = PROJECT_ROOT / "generated_data" / "question_bank"
PATTERN_PATH = PROJECT_ROOT / "config" / "exam_patterns.json"
PATTERN_KEY = "upsc_cse_gs_paper_1"

OPTION_RE = re.compile(r"^\s*\(?([a-dA-D])\)?[\.\):]?\s*(.*)$")
ANSWER_RE = re.compile(r"\(?([a-dA-D])\)?")

CADENCES = {
    "daily": ("daily_questions", "Daily Questions", "Daily"),
    "weekly": ("weekly_quiz", "Weekly Quiz", "Weekly"),
    "monthly": ("monthly_mock", "Monthly Mock", "Mock"),
    "redemption": ("redemption_practice", "Redemption Practice", "Redo"),
    "quarterly": ("full_mock", "Full Mock", "Full Mock"),
}


def norm_text(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip().lower()


def parse_option(option: Any, index: int) -> dict[str, str]:
    key = chr(ord("a") + index)
    text = str(option).strip()
    m = OPTION_RE.match(text)
    if m:
        key = m.group(1).lower()
        text = m.group(2).strip()
    return {"key": key, "text": text}


def parse_answer(value: Any, options: list[dict[str, str]]) -> str | None:
    if value is None:
        return None
    raw = str(value).strip()
    m = ANSWER_RE.fullmatch(raw) or ANSWER_RE.match(raw)
    if m and len(raw) <= 4:
        letter = m.group(1).lower()
        if any(o["key"] == letter for o in options):
            return letter
    # fall back: match against option text
    n = norm_text(raw)
    for o in options:
        if n and norm_text(o["text"]) == n:
            return o["key"]
    return None


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def set_meta(cadence: str, when: date) -> tuple[str, str, str, str]:
    base, category, abbr = CADENCES[cadence]
    bucket = f"{when.year}_{when.month:02d}_{when.day:02d}" if cadence == "daily" else f"{when.year}_{when.month:02d}"
    set_id = f"{base}_{bucket}"
    label_date = when.strftime("%b %d, %Y") if cadence == "daily" else when.strftime("%b %Y")
    short_date = when.strftime("%b %d") if cadence == "daily" else f"{when.strftime('%b')} {when.strftime('%y')}"
    label = f"{category} · {label_date}"
    short_label = f"{abbr} {short_date}"
    return set_id, label, short_label, category


def to_processed(raw: dict[str, Any], set_id: str, label: str, base: str,
                 number: int, when: date) -> dict[str, Any] | None:
    options = [parse_option(o, i) for i, o in enumerate(raw.get("options", []))]
    if len(options) != 4 or any(o["key"] not in {"a", "b", "c", "d"} for o in options):
        return None
    if not str(raw.get("question", "")).strip():
        return None
    answer = parse_answer(raw.get("answer") or raw.get("answer_option") or raw.get("answer_key"), options)
    rel = f"generated_data/question_bank/{set_id}.json"
    return {
        "id": f"{set_id}_q{number:03d}",
        "exam": "UPSC CSE",
        "paper": "GS Paper I",
        "year": None,
        "question_set_id": set_id,
        "question_set_label": label,
        "source_type": base,
        "question_number": number,
        "source_question_number": None,
        "question": str(raw.get("question", "")).strip(),
        "options": options,
        "answer_option": answer,
        "accepted_answer_options": [answer] if answer else [],
        "explanation": str(raw.get("explanation", "") or ""),
        "subject": str(raw.get("subject", "") or ""),
        "theme": str(raw.get("theme", "") or ""),
        "micro_topic": str(raw.get("micro_topic", "") or ""),
        "nature": str(raw.get("nature", "") or ""),
        "difficulty": str(raw.get("difficulty", "") or ""),
        "source": rel,
        "answer_source": rel,
        "verification_status": "verified_generated" if answer else "missing_answer",
        "date_added": when.isoformat(),
    }


def register_set(
    set_id: str,
    label: str,
    short_label: str,
    category: str,
    duration_minutes: int | None = None,
) -> bool:
    pattern = load_json(PATTERN_PATH, None)
    if not isinstance(pattern, dict) or PATTERN_KEY not in pattern:
        raise SystemExit(f"Cannot find '{PATTERN_KEY}' in {PATTERN_PATH}")
    sets = pattern[PATTERN_KEY].setdefault("question_sets", [])
    if any(s.get("id") == set_id for s in sets):
        return False
    question_set = {
        "id": set_id,
        "label": label,
        "short_label": short_label,
        "category": category,
        "path": f"data/processed/{set_id}_processed.json",
    }
    if duration_minutes is not None:
        question_set["duration_minutes"] = duration_minutes
    sets.append(question_set)
    PATTERN_PATH.write_text(json.dumps(pattern, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return True


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cadence", required=True, choices=list(CADENCES))
    ap.add_argument("--input", required=True, help="Path to JSON array of generated MCQs")
    ap.add_argument("--date", help="YYYY-MM-DD bucket date (default: today)")
    args = ap.parse_args()

    when = datetime.strptime(args.date, "%Y-%m-%d").date() if args.date else date.today()
    incoming = load_json(Path(args.input), None)
    if not isinstance(incoming, list):
        raise SystemExit("--input must be a JSON array of question objects")

    set_id, label, short_label, category = set_meta(args.cadence, when)
    base = CADENCES[args.cadence][0]
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    QUESTION_BANK_RAW_DIR.mkdir(parents=True, exist_ok=True)

    processed_path = PROCESSED_DIR / f"{set_id}_processed.json"
    existing = load_json(processed_path, [])
    if not isinstance(existing, list):
        existing = []
    seen = {norm_text(q.get("question", "")) for q in existing}
    next_num = max((q.get("question_number", 0) for q in existing), default=0) + 1

    added, skipped_dup, skipped_bad = [], 0, 0
    raw_added = []
    for item in incoming:
        if not isinstance(item, dict):
            skipped_bad += 1
            continue
        key = norm_text(item.get("question", ""))
        if not key or key in seen:
            skipped_dup += 1
            continue
        rec = to_processed(item, set_id, label, base, next_num, when)
        if rec is None:
            skipped_bad += 1
            continue
        seen.add(key)
        existing.append(rec)
        added.append(rec)
        raw_added.append({**item, "date_added": when.isoformat()})
        next_num += 1

    if added:
        processed_path.write_text(json.dumps(existing, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        raw_path = QUESTION_BANK_RAW_DIR / f"{set_id}.json"
        raw_existing = load_json(raw_path, [])
        if not isinstance(raw_existing, list):
            raw_existing = []
        raw_existing.extend(raw_added)
        raw_path.write_text(json.dumps(raw_existing, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        registered = register_set(
            set_id,
            label,
            short_label,
            category,
            duration_minutes=10 if args.cadence == "daily" else None,
        )
    else:
        registered = False

    print(json.dumps({
        "set_id": set_id,
        "set_label": label,
        "added": len(added),
        "skipped_duplicates": skipped_dup,
        "skipped_malformed": skipped_bad,
        "total_in_set": len(existing),
        "processed_file": str(processed_path.relative_to(PROJECT_ROOT)),
        "registered_new_set": registered,
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
