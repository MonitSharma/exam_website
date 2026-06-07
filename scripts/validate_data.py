#!/usr/bin/env python3
"""Validate processed question files used by the static app."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
YEAR_RE = re.compile(r"upsc_(\d{4})_processed\.json$")
VALID_OPTIONS = {"a", "b", "c", "d"}
REQUIRED_FIELDS = {
    "id",
    "exam",
    "paper",
    "year",
    "question_number",
    "question",
    "options",
    "answer_option",
    "accepted_answer_options",
    "explanation",
    "subject",
    "theme",
    "micro_topic",
    "nature",
    "difficulty",
    "source",
    "answer_source",
    "verification_status",
}


def parse_year(path: Path) -> int | None:
    match = YEAR_RE.match(path.name)
    if not match:
        return None
    return int(match.group(1))


def validate_file(path: Path) -> tuple[list[str], Counter[str]]:
    errors: list[str] = []
    stats: Counter[str] = Counter()
    data = json.loads(path.read_text(encoding="utf-8"))

    if not isinstance(data, list):
        return ([f"{path.name}: root must be a JSON array"], stats)

    ids: set[str] = set()
    numbers: set[int] = set()
    year = parse_year(path)

    for index, question in enumerate(data, start=1):
        label = f"{path.name} question #{index}"
        missing = REQUIRED_FIELDS - set(question)
        if missing:
            errors.append(f"{label}: missing fields {sorted(missing)}")

        question_id = question.get("id")
        if question_id in ids:
            errors.append(f"{label}: duplicate id {question_id}")
        ids.add(question_id)

        number = question.get("question_number")
        if number in numbers:
            errors.append(f"{label}: duplicate question_number {number}")
        numbers.add(number)

        if year is not None and question.get("year") != year:
            errors.append(f"{label}: year field does not match filename year {year}")

        if not str(question.get("question", "")).strip():
            errors.append(f"{label}: question text is empty")

        options = question.get("options")
        if not isinstance(options, list) or len(options) != 4:
            errors.append(f"{label}: expected exactly four options")
        else:
            option_keys = {option.get("key") for option in options if isinstance(option, dict)}
            if option_keys != VALID_OPTIONS:
                errors.append(f"{label}: option keys must be exactly a, b, c, d")

        accepted_options = question.get("accepted_answer_options", [])
        if not isinstance(accepted_options, list):
            errors.append(f"{label}: accepted_answer_options must be a list")
            accepted_options = []
        invalid_accepted = [answer for answer in accepted_options if answer not in VALID_OPTIONS]
        if invalid_accepted:
            errors.append(f"{label}: invalid accepted_answer_options {invalid_accepted}")

        answer_option = question.get("answer_option")
        if answer_option is None and not accepted_options:
            if question.get("verification_status") == "dropped":
                stats["dropped"] += 1
            else:
                stats["missing_answers"] += 1
        elif answer_option not in VALID_OPTIONS:
            errors.append(f"{label}: invalid answer_option {answer_option}")
        elif answer_option not in accepted_options:
            errors.append(f"{label}: answer_option must be included in accepted_answer_options")
        else:
            stats["available_answers"] += 1

    stats["questions"] = len(data)
    return errors, stats


def discover_files(years: list[int] | None) -> list[Path]:
    files = sorted(PROCESSED_DIR.glob("*_processed.json"))
    if years:
        wanted = {int(year) for year in years}
        files = [path for path in files if parse_year(path) in wanted]
    return files


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--years", nargs="*", type=int, help="Optional list of years to validate")
    args = parser.parse_args()

    files = discover_files(args.years)
    if not files:
        raise SystemExit(f"No processed JSON files found in {PROCESSED_DIR}")

    all_errors: list[str] = []
    for path in files:
        errors, stats = validate_file(path)
        all_errors.extend(errors)
        print(
            f"{path.relative_to(PROJECT_ROOT)}: "
            f"{stats['questions']} questions, "
            f"{stats['available_answers']} answer keys, "
            f"{stats['missing_answers']} missing answers, "
            f"{stats['dropped']} dropped"
        )

    if all_errors:
        print("\nValidation errors:")
        for error in all_errors:
            print(f"- {error}")
        return 1

    print("validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
