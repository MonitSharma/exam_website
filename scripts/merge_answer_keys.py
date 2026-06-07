#!/usr/bin/env python3
"""Merge manually maintained answer keys into processed question files."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
ANSWER_KEY_DIR = PROJECT_ROOT / "data" / "answer_keys"
YEAR_RE = re.compile(r"upsc_(\d{4})_processed\.json$")
VALID_OPTIONS = {"a", "b", "c", "d"}


def parse_year(path: Path) -> int:
    match = YEAR_RE.match(path.name)
    if not match:
        raise ValueError(f"Could not infer year from filename: {path.name}")
    return int(match.group(1))


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        return default
    return json.loads(text)


def normalize_answers(value: Any, fallback: Any = None) -> list[str]:
    if value is None or value == "":
        value = fallback
    if value is None or value == "":
        return []

    if isinstance(value, list):
        raw_answers = value
    else:
        raw_answers = re.split(r"[/,|]", str(value))

    answers: list[str] = []
    for raw_answer in raw_answers:
        answer = str(raw_answer).strip().lower()
        if not answer:
            continue
        if answer not in VALID_OPTIONS:
            raise ValueError(f"Invalid answer option '{raw_answer}'. Expected one of a, b, c, d.")
        if answer not in answers:
            answers.append(answer)
    return answers


def merge_for_year(year: int) -> tuple[Path, int]:
    processed_path = PROCESSED_DIR / f"upsc_{year}_processed.json"
    answer_key_path = ANSWER_KEY_DIR / f"upsc_{year}_answers.json"

    questions = load_json(processed_path, None)
    if questions is None:
        raise FileNotFoundError(f"Missing processed file: {processed_path}")
    if not isinstance(questions, list):
        raise ValueError(f"{processed_path.name} must contain a JSON array")

    answer_items = load_json(answer_key_path, [])
    if not isinstance(answer_items, list):
        raise ValueError(f"{answer_key_path.name} must contain a JSON array")

    answers_by_number: dict[int, dict[str, Any]] = {}
    for item in answer_items:
        question_number = int(item["question_number"])
        answers_by_number[question_number] = item

    merged_count = 0
    for question in questions:
        item = answers_by_number.get(int(question["question_number"]))
        if not item:
            continue

        answer_options = normalize_answers(
            item.get("accepted_answer_options"),
            item.get("answer_option"),
        )
        question["answer_option"] = answer_options[0] if answer_options else None
        question["accepted_answer_options"] = answer_options
        question["explanation"] = str(item.get("explanation", "") or "")
        question["verification_status"] = str(
            item.get("verification_status", "verified" if answer_options else "missing_answer")
        )
        if item.get("answer_source"):
            question["answer_source"] = str(item["answer_source"])
        merged_count += 1

    processed_path.write_text(
        json.dumps(questions, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return processed_path, merged_count


def discover_years(years: list[int] | None) -> list[int]:
    if years:
        return sorted({int(year) for year in years})
    return sorted(parse_year(path) for path in PROCESSED_DIR.glob("upsc_*_processed.json"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--years", nargs="*", type=int, help="Optional list of years to merge")
    args = parser.parse_args()

    years = discover_years(args.years)
    if not years:
        raise SystemExit(f"No processed UPSC JSON files found in {PROCESSED_DIR}")

    for year in years:
        out_path, merged_count = merge_for_year(year)
        print(f"merged {merged_count} answer keys into {out_path.relative_to(PROJECT_ROOT)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
