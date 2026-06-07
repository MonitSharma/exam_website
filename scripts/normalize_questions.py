#!/usr/bin/env python3
"""Normalize raw UPSC PYQ JSON files into the app's internal schema."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

OPTION_RE = re.compile(r"^\s*\(?([a-dA-D])\)\s*(.*)$")
YEAR_RE = re.compile(r"upsc_(\d{4})\.json$")


def parse_year(path: Path) -> int:
    match = YEAR_RE.match(path.name)
    if not match:
        raise ValueError(f"Could not infer year from filename: {path.name}")
    return int(match.group(1))


def normalize_option(option: Any, fallback_index: int) -> dict[str, str]:
    key = chr(ord("a") + fallback_index)
    text = str(option).strip()

    match = OPTION_RE.match(text)
    if match:
        key = match.group(1).lower()
        text = match.group(2).strip()

    return {"key": key, "text": text}


def normalize_question(raw: dict[str, Any], year: int, index: int) -> dict[str, Any]:
    question_number = int(raw.get("id") or index + 1)
    answer_option = raw.get("answer_option")
    accepted_answer_options = raw.get("accepted_answer_options")
    if not accepted_answer_options and isinstance(answer_option, str):
        accepted_answer_options = [answer_option.lower()]

    return {
        "id": f"upsc_{year}_q{question_number:03d}",
        "exam": raw.get("exam", "UPSC CSE"),
        "paper": raw.get("paper", "GS Paper I"),
        "year": year,
        "question_number": question_number,
        "question": str(raw.get("question", "")).strip(),
        "options": [
            normalize_option(option, option_index)
            for option_index, option in enumerate(raw.get("options", []))
        ],
        "answer_option": answer_option.lower() if isinstance(answer_option, str) else None,
        "accepted_answer_options": accepted_answer_options or [],
        "explanation": str(raw.get("explanation", "") or ""),
        "subject": str(raw.get("subject", "") or ""),
        "theme": str(raw.get("theme", "") or ""),
        "micro_topic": str(raw.get("micro_topic", "") or ""),
        "nature": str(raw.get("nature", "") or ""),
        "difficulty": str(raw.get("difficulty", "") or ""),
        "source": str(raw.get("source", "User-provided UPSC PYQ JSON")),
        "answer_source": str(raw.get("answer_source", "") or ""),
        "verification_status": str(
            raw.get(
                "verification_status",
                "verified" if answer_option else "missing_answer",
            )
        ),
    }


def normalize_file(path: Path) -> Path:
    year = parse_year(path)
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError(f"{path.name} must contain a JSON array of questions")

    normalized = [normalize_question(item, year, index) for index, item in enumerate(data)]
    out_path = PROCESSED_DIR / f"upsc_{year}_processed.json"
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(normalized, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return out_path


def discover_files(years: list[int] | None) -> list[Path]:
    files = sorted(RAW_DIR.glob("upsc_*.json"))
    if years:
        wanted = {int(year) for year in years}
        files = [path for path in files if parse_year(path) in wanted]
    return files


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--years",
        nargs="*",
        type=int,
        help="Optional list of years to normalize, e.g. --years 2019 2020 2021",
    )
    args = parser.parse_args()

    files = discover_files(args.years)
    if not files:
        raise SystemExit(f"No raw UPSC JSON files found in {RAW_DIR}")

    for path in files:
        out_path = normalize_file(path)
        print(f"normalized {path.relative_to(PROJECT_ROOT)} -> {out_path.relative_to(PROJECT_ROOT)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
