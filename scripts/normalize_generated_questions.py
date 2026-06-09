#!/usr/bin/env python3
"""Normalize generated AI, CSR, and CSAT question batches for the static app."""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
GENERATED_DIR = PROJECT_ROOT / "generated_questions"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

OPTION_RE = re.compile(r"^\s*\(?([a-dA-D])\)\s*(.*)$")
ANSWER_RE = re.compile(r"^\s*\(?([a-dA-D])\)?\s*$")
BATCH_RE = re.compile(r"batch_(\d+)\.json$")
CSAT_MOCK_RE = re.compile(r"(\d{4})-(\d{2})-(\d{2})\.json$")


def normalize_option(option: Any, fallback_index: int) -> dict[str, str]:
    key = chr(ord("a") + fallback_index)
    text = str(option).strip()

    match = OPTION_RE.match(text)
    if match:
        key = match.group(1).lower()
        text = match.group(2).strip()

    return {"key": key, "text": text}


def normalize_answer(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    match = ANSWER_RE.match(value)
    if not match:
        return None
    return match.group(1).lower()


def batch_number(path: Path) -> int:
    match = BATCH_RE.match(path.name)
    if not match:
        raise ValueError(f"Could not infer batch number from {path.name}")
    return int(match.group(1))


def csat_mock_date(path: Path) -> date:
    match = CSAT_MOCK_RE.match(path.name)
    if not match:
        raise ValueError(f"Could not infer CSAT mock date from {path.name}")
    year, month, day = (int(part) for part in match.groups())
    return date(year, month, day)


def load_json(path: Path, default: Any = None) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_question(
    raw: dict[str, Any],
    *,
    set_id: str,
    set_label: str,
    source_type: str,
    question_number: int,
    source_question_number: int | None,
    answer_option: str | None,
    source_path: Path,
    answer_key_path: Path | None,
) -> dict[str, Any]:
    accepted_answers = [answer_option] if answer_option else []

    return {
        "id": f"{set_id}_q{question_number:03d}",
        "exam": str(raw.get("exam", "UPSC CSE")),
        "paper": str(raw.get("paper", "GS Paper I")),
        "year": raw.get("year"),
        "question_set_id": set_id,
        "question_set_label": set_label,
        "source_type": source_type,
        "question_number": question_number,
        "source_question_number": source_question_number,
        "question": str(raw.get("question", "")).strip(),
        "options": [
            normalize_option(option, option_index)
            for option_index, option in enumerate(raw.get("options", []))
        ],
        "answer_option": answer_option,
        "accepted_answer_options": accepted_answers,
        "explanation": str(raw.get("explanation", "") or ""),
        "subject": str(raw.get("subject", "") or ""),
        "theme": str(raw.get("theme", "") or ""),
        "micro_topic": str(raw.get("micro_topic", "") or ""),
        "nature": str(raw.get("nature", "") or ""),
        "difficulty": str(raw.get("difficulty", "") or ""),
        "source": str(raw.get("source") or source_path.relative_to(PROJECT_ROOT)),
        "answer_source": (
            str(raw.get("answer_source") or answer_key_path.relative_to(PROJECT_ROOT))
            if answer_key_path
            else str(raw.get("answer_source") or source_path.relative_to(PROJECT_ROOT))
        ),
        "verification_status": "verified_generated" if answer_option else "missing_answer",
    }


def normalize_ai_batch(path: Path) -> Path:
    batch = batch_number(path)
    set_id = f"ai_generated_batch_{batch}"
    set_label = f"AI Generated Questions · Batch {batch}"
    data = load_json(path, [])
    if not isinstance(data, list):
        raise ValueError(f"{path.name} must contain a JSON array of questions")

    normalized = []
    for index, item in enumerate(data, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"{path.name} item #{index} must be an object")
        normalized.append(
            normalize_question(
                item,
                set_id=set_id,
                set_label=set_label,
                source_type="ai_generated",
                question_number=index,
                source_question_number=safe_int(item.get("id")),
                answer_option=normalize_answer(item.get("answer_key") or item.get("answer_option")),
                source_path=path,
                answer_key_path=None,
            )
        )

    return write_processed(set_id, normalized)


def normalize_csr_batch(path: Path) -> Path:
    batch = batch_number(path)
    set_id = f"csr_batch_{batch}"
    set_label = f"CSR Monthly Mock · Batch {batch}"
    answer_key_path = path.with_name(f"batch_{batch}_answer_key.json")
    answer_key_data = load_json(answer_key_path, {})
    answer_rows = answer_key_data.get("answer_key", []) if isinstance(answer_key_data, dict) else []
    answers_by_source_id = {
        safe_int(row.get("id")): normalize_answer(row.get("answer"))
        for row in answer_rows
        if isinstance(row, dict) and safe_int(row.get("id")) is not None
    }

    data = load_json(path, [])
    if not isinstance(data, list):
        raise ValueError(f"{path.name} must contain a JSON array of questions")

    normalized = []
    for index, item in enumerate(data, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"{path.name} item #{index} must be an object")
        source_question_number = safe_int(item.get("id"))
        normalized.append(
            normalize_question(
                item,
                set_id=set_id,
                set_label=set_label,
                source_type="csr",
                question_number=index,
                source_question_number=source_question_number,
                answer_option=answers_by_source_id.get(source_question_number),
                source_path=path,
                answer_key_path=answer_key_path if answer_key_path.exists() else None,
            )
        )

    return write_processed(set_id, normalized)


def normalize_csat_mock(path: Path) -> Path:
    mock_date = csat_mock_date(path)
    set_id = f"csat_full_mock_{mock_date.year}_{mock_date.month:02d}_{mock_date.day:02d}"
    set_label = f"CSAT Full Mock · {mock_date.strftime('%b %d, %Y')}"
    data = load_json(path, [])
    if not isinstance(data, list):
        raise ValueError(f"{path.name} must contain a JSON array of questions")

    normalized = []
    for index, item in enumerate(data, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"{path.name} item #{index} must be an object")
        normalized.append(
            normalize_question(
                {
                    **item,
                    "exam": item.get("exam") or "UPSC CSE",
                    "paper": item.get("paper") or "GS Paper II (CSAT)",
                    "year": item.get("year") or mock_date.year,
                },
                set_id=set_id,
                set_label=set_label,
                source_type="csat_mock",
                question_number=index,
                source_question_number=safe_int(item.get("id")) or index,
                answer_option=normalize_answer(item.get("answer") or item.get("answer_key") or item.get("answer_option")),
                source_path=path,
                answer_key_path=None,
            )
        )

    return write_processed(set_id, normalized)


def normalize_csat_practice(path: Path) -> Path:
    practice_date = csat_mock_date(path)
    set_id = f"csat_practice_{practice_date.year}_{practice_date.month:02d}_{practice_date.day:02d}"
    set_label = f"CSAT Practice · {practice_date.strftime('%b %d, %Y')}"
    data = load_json(path, [])
    if not isinstance(data, list):
        raise ValueError(f"{path.name} must contain a JSON array of questions")

    normalized = []
    for index, item in enumerate(data, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"{path.name} item #{index} must be an object")
        normalized.append(
            normalize_question(
                {
                    **item,
                    "exam": item.get("exam") or "UPSC CSE",
                    "paper": item.get("paper") or "GS Paper II (CSAT)",
                    "year": item.get("year") or practice_date.year,
                },
                set_id=set_id,
                set_label=set_label,
                source_type="csat_practice",
                question_number=index,
                source_question_number=safe_int(item.get("id")) or index,
                answer_option=normalize_answer(item.get("answer") or item.get("answer_key") or item.get("answer_option")),
                source_path=path,
                answer_key_path=None,
            )
        )

    return write_processed(set_id, normalized)


def safe_int(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def write_processed(set_id: str, questions: list[dict[str, Any]]) -> Path:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PROCESSED_DIR / f"{set_id}_processed.json"
    out_path.write_text(
        json.dumps(questions, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return out_path


def discover_ai_batches() -> list[Path]:
    return sorted((GENERATED_DIR / "ai_generated_questions").glob("batch_*.json"))


def discover_csr_batches() -> list[Path]:
    return sorted(
        path
        for path in (GENERATED_DIR / "csr_questions").glob("batch_*.json")
        if not path.name.endswith("_answer_key.json")
    )


def discover_csat_mocks() -> list[Path]:
    return sorted(
        path
        for path in (GENERATED_DIR / "csat_mocks").glob("*.json")
        if isinstance(load_json(path, []), list) and len(load_json(path, [])) >= 75
    )


def discover_csat_practice() -> list[Path]:
    return sorted((GENERATED_DIR / "csat_questions").glob("*.json"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        choices=["all", "ai", "csr", "csat"],
        default="all",
        help="Generated question source to normalize",
    )
    args = parser.parse_args()

    paths: list[tuple[str, Path]] = []
    if args.source in {"all", "ai"}:
        paths.extend(("ai", path) for path in discover_ai_batches())
    if args.source in {"all", "csr"}:
        paths.extend(("csr", path) for path in discover_csr_batches())
    if args.source in {"all", "csat"}:
        paths.extend(("csat", path) for path in discover_csat_mocks())
        paths.extend(("csat-practice", path) for path in discover_csat_practice())

    if not paths:
        raise SystemExit(f"No generated question batches found in {GENERATED_DIR}")

    for source, path in paths:
        if source == "ai":
            out_path = normalize_ai_batch(path)
        elif source == "csr":
            out_path = normalize_csr_batch(path)
        elif source == "csat":
            out_path = normalize_csat_mock(path)
        else:
            out_path = normalize_csat_practice(path)
        print(f"normalized {path.relative_to(PROJECT_ROOT)} -> {out_path.relative_to(PROJECT_ROOT)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
