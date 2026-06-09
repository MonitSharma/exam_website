#!/usr/bin/env python3
"""Extract Set A answer-key JSON files from local answer-key PNG images.

Requires Tesseract OCR to be installed and available on PATH.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = PROJECT_ROOT / "generated_questions" / "answer_keys"
ANSWER_KEY_DIR = PROJECT_ROOT / "data" / "answer_keys"
OCR_DIR = PROJECT_ROOT / "artifacts" / "answer_key_ocr_cells"
VALID_OPTIONS = {"a", "b", "c", "d"}

RESOLVED_OVERRIDES: dict[int, dict[int, dict[str, Any]]] = {
    2019: {
        21: {
            "answer_option": "a",
            "verification_status": "verified_web",
            "answer_source": "Local Set A image showed a/b; resolved with public PYQ solution: https://easemyprep.in/pyq/prelims/environment/2019/2019_8_B_17",
        },
        40: {
            "answer_option": "c",
            "verification_status": "verified_web",
            "answer_source": "Local Set A image showed b/c; resolved with Vajiram & Ravi PYQ solution: https://vajiramandravi.com/upsc-exam/consider-the-following-statements-51/",
        },
        85: {
            "answer_option": "d",
            "verification_status": "verified_web",
            "answer_source": "Local Set A image showed b/d; resolved with Testbook PYQ solution: https://testbook.com/question-answer/in-the-context-of-polity-which-one-of-the-followi--5f34f7b7d042f30d12f435a1/amp",
        },
        94: {
            "answer_option": "c",
            "verification_status": "verified_web",
            "answer_source": "Local Set A image showed c/d; resolved with Vajiram & Ravi PYQ solution: https://vajiramandravi.com/upsc-exam/consider-the-following-statements-66/",
        },
    },
    2020: {
        54: {
            "answer_option": "d",
            "verification_status": "verified_web",
            "answer_source": "Local Set A image showed a/d; resolved with Vajiram & Ravi PYQ solution: https://vajiramandravi.com/upsc-exam/in-the-context-of-the-indian-economy-non-financial-debt-includes-which-of-the-following/",
        },
        81: {
            "answer_option": "a",
            "verification_status": "verified_web",
            "answer_source": "Local Set A image showed a/b; resolved with Vajiram & Ravi PYQ solution: https://vajiramandravi.com/upsc-exam/if-a-particular-plant-species-is-placed-under-schedule-vi-of-the-wildlife-protection-act-1972-what-is-the-implication/",
        },
    },
    2026: {
        58: {
            "answer_option": "c",
            "verification_status": "verified_image_manual",
            "answer_source": "OCR crop artifacts/answer_key_ocr_cells/2026_058.png was manually checked against generated_questions/answer_keys/2026_answer_key_setA.png.",
        },
    },
}


@dataclass(frozen=True)
class OcrCell:
    question_number: int
    raw_text: str
    answer_text: str


def run_tesseract(path: Path, *, psm: int, whitelist: str | None = None) -> str:
    command = ["tesseract", str(path), "stdout", "--psm", str(psm)]
    if whitelist:
        command.extend(["-c", f"tessedit_char_whitelist={whitelist}"])
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    return result.stdout.strip().replace(" ", "")


def lineish_colored(r: int, g: int, b: int) -> bool:
    return (
        (r > 120 and g < 160 and b < 140)
        or (r < 80 and g < 80 and b < 80)
        or (r > 180 and 70 < g < 200 and b < 130)
    )


def clusters_from_scores(scores: list[int], threshold: float) -> list[tuple[int, int, int, int]]:
    clusters: list[tuple[int, int, int, int]] = []
    in_cluster = False
    for index, score in enumerate(scores):
        if score > threshold:
            if not in_cluster:
                start = index
                in_cluster = True
        elif in_cluster:
            end = index - 1
            clusters.append((start, end, (start + end) // 2, max(scores[start:index])))
            in_cluster = False
    if in_cluster:
        end = len(scores) - 1
        clusters.append((start, end, (start + end) // 2, max(scores[start:])))
    return clusters


def parse_colored_table_lines(image: Image.Image) -> tuple[list[int], list[int]]:
    width, height = image.size
    pixels = image.load()

    row_scores = [
        sum(1 for x in range(width) if lineish_colored(*pixels[x, y]))
        for y in range(height)
    ]
    row_clusters = clusters_from_scores(row_scores, width * 0.42)
    thin_lines = [cluster[2] for cluster in row_clusters if cluster[1] - cluster[0] < 10]
    y_lines = [row_clusters[0][1]] + thin_lines[-25:]
    if len(y_lines) == 25:
        y_lines.append(height - 1)
    if len(y_lines) != 26:
        raise ValueError(f"Expected 26 horizontal table lines, got {len(y_lines)}")

    boundary_y = y_lines[1]
    boundary_pixels = [x for x in range(width) if lineish_colored(*pixels[x, boundary_y])]
    left = min(boundary_pixels)
    right = max(boundary_pixels)

    col_scores = [
        sum(1 for y in range(height) if lineish_colored(*pixels[x, y]))
        for x in range(width)
    ]
    col_clusters = clusters_from_scores(col_scores, height * 0.35)
    internal_lines = [
        cluster[2]
        for cluster in col_clusters
        if cluster[1] - cluster[0] < 10 and left + 20 < cluster[2] < right - 20
    ]
    x_lines = [left] + internal_lines[:3] + [right]
    if len(x_lines) != 5:
        raise ValueError(f"Expected 5 vertical table lines, got {len(x_lines)}")
    return x_lines, y_lines


def parse_colored_image(year: int, image_path: Path) -> list[OcrCell]:
    image = Image.open(image_path).convert("RGB")
    x_lines, y_lines = parse_colored_table_lines(image)
    OCR_DIR.mkdir(parents=True, exist_ok=True)
    cells: list[OcrCell] = []

    for row in range(25):
        for column in range(4):
            question_number = row + 1 + 25 * column
            x1, x2 = x_lines[column], x_lines[column + 1]
            y1, y2 = y_lines[row], y_lines[row + 1]
            crop = image.crop((x1 + 3, y1 + 3, x2 - 3, y2 - 3))
            crop = crop.resize((max(1, crop.width * 4), max(1, crop.height * 4)))
            crop_path = OCR_DIR / f"{year}_{question_number:03d}.png"
            crop.save(crop_path)
            raw_text = run_tesseract(
                crop_path,
                psm=7,
                whitelist="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ()./#*",
            )
            match = re.search(r"(\d+)\.?\(?([a-dA-DxX04](?:[/,][a-dA-D04])?)\)?", raw_text)
            if match and int(match.group(1)) == question_number:
                answer_text = match.group(2).lower().replace(",", "/").replace("0", "d").replace("4", "d")
            else:
                answer_crop = crop.crop((int(crop.width * 0.35), 0, crop.width, crop.height))
                answer_crop_path = OCR_DIR / f"{year}_{question_number:03d}_answer.png"
                answer_crop.save(answer_crop_path)
                answer_text = run_tesseract(
                    answer_crop_path,
                    psm=10,
                    whitelist="abcdABCDxX/",
                ).lower()
                answer_match = re.search(r"[a-dx](?:/[a-d])?", answer_text)
                if not answer_match:
                    raise ValueError(f"{year} Q{question_number}: OCR failed with '{raw_text}'")
                answer_text = answer_match.group(0)
            cells.append(
                OcrCell(
                    question_number=question_number,
                    raw_text=raw_text,
                    answer_text=answer_text,
                )
            )
    return cells


def parse_official_table_lines(year: int, image: Image.Image) -> tuple[list[int], list[int]]:
    gray = image.convert("L")
    width, height = gray.size
    pixels = gray.load()

    row_threshold = width * (0.12 if year == 2024 else 0.15)
    row_scores = [sum(1 for x in range(width) if pixels[x, y] < 120) for y in range(height)]
    row_clusters = clusters_from_scores(row_scores, row_threshold)
    y_lines = [
        cluster[2]
        for cluster in row_clusters
        if 400 < cluster[2] < 1560 and cluster[3] > 600
    ]
    if year == 2024:
        y_lines = [y for y in y_lines if y != 441]
    else:
        y_lines = [y for y in y_lines if y >= 445]
    if len(y_lines) != 17:
        raise ValueError(f"{year}: expected 17 horizontal table lines, got {len(y_lines)}")

    col_scores = [sum(1 for y in range(height) if pixels[x, y] < 120) for x in range(width)]
    col_clusters = clusters_from_scores(col_scores, height * 0.15)
    x_lines = [
        cluster[2]
        for cluster in col_clusters
        if cluster[3] > 350 and 50 < cluster[2] < 2000
    ]
    expected_x_lines = 17 if year == 2024 else 15
    if len(x_lines) != expected_x_lines:
        raise ValueError(f"{year}: expected {expected_x_lines} vertical table lines, got {len(x_lines)}")
    return x_lines, y_lines


def ocr_single_key(crop_path: Path) -> str:
    whitelist = "ABCDX0abcdx"
    attempts = [
        run_tesseract(crop_path, psm=8, whitelist=whitelist),
        run_tesseract(crop_path, psm=13, whitelist=whitelist),
        run_tesseract(crop_path, psm=7, whitelist=whitelist),
        run_tesseract(crop_path, psm=10, whitelist=whitelist),
        run_tesseract(crop_path, psm=7),
        run_tesseract(crop_path, psm=10),
    ]
    for text in attempts:
        match = re.search(r"[ABCDX0abcdx]", text)
        if match:
            answer = match.group(0).lower()
            return "x" if answer == "0" else answer
    raise ValueError(f"OCR failed for key cell {crop_path}")


def parse_official_image(year: int, image_path: Path) -> list[OcrCell]:
    image = Image.open(image_path).convert("RGB")
    x_lines, y_lines = parse_official_table_lines(year, image)
    OCR_DIR.mkdir(parents=True, exist_ok=True)
    groups = (len(x_lines) - 1) // 2
    cells: list[OcrCell] = []

    for group in range(groups):
        for row in range(15):
            question_number = 1 + row + 15 * group
            if question_number > 100:
                continue
            x1, x2 = x_lines[2 * group + 1], x_lines[2 * group + 2]
            y1, y2 = y_lines[1 + row], y_lines[2 + row]
            pad_x = max(2, int((x2 - x1) * 0.12))
            pad_y = max(2, int((y2 - y1) * 0.10))
            crop = image.crop((x1 + pad_x, y1 + pad_y, x2 - pad_x, y2 - pad_y))
            crop = crop.resize((max(1, crop.width * 4), max(1, crop.height * 4)))
            crop_path = OCR_DIR / f"{year}_{question_number:03d}.png"
            crop.save(crop_path)
            answer = ocr_single_key(crop_path)
            cells.append(OcrCell(question_number, answer, answer))
    return cells


def parse_2026_provisional_lines(image: Image.Image) -> tuple[list[int], list[int]]:
    gray = image.convert("L")
    width, height = gray.size
    pixels = gray.load()

    row_scores = [sum(1 for x in range(width) if pixels[x, y] < 100) for y in range(height)]
    row_clusters = clusters_from_scores(row_scores, width * 0.27)
    y_lines = [
        cluster[2]
        for cluster in row_clusters
        if 450 < cluster[2] < height - 20 and cluster[3] > width * 0.27
    ]
    if len(y_lines) != 22:
        raise ValueError(f"2026: expected 22 horizontal answer-table lines, got {len(y_lines)}")

    col_scores = [sum(1 for y in range(height) if pixels[x, y] < 100) for x in range(width)]
    col_clusters = clusters_from_scores(col_scores, height * 0.16)
    x_lines = [
        cluster[2]
        for cluster in col_clusters
        if 50 < cluster[2] < width - 80 and cluster[3] > height * 0.16
    ]
    if len(x_lines) != 11:
        raise ValueError(f"2026: expected 11 vertical answer-table lines, got {len(x_lines)}")

    return x_lines, y_lines


def parse_2026_provisional_image(year: int, image_path: Path) -> list[OcrCell]:
    image = Image.open(image_path).convert("RGB")
    x_lines, y_lines = parse_2026_provisional_lines(image)
    OCR_DIR.mkdir(parents=True, exist_ok=True)
    cells: list[OcrCell] = []

    for group in range(5):
        for row in range(20):
            question_number = 1 + row + 20 * group
            x1, x2 = x_lines[2 * group + 1], x_lines[2 * group + 2]
            y1, y2 = y_lines[1 + row], y_lines[2 + row]
            pad_x = max(2, int((x2 - x1) * 0.16))
            pad_y = max(2, int((y2 - y1) * 0.16))
            crop = image.crop((x1 + pad_x, y1 + pad_y, x2 - pad_x, y2 - pad_y))
            crop = crop.resize((max(1, crop.width * 4), max(1, crop.height * 4)))
            crop_path = OCR_DIR / f"{year}_{question_number:03d}.png"
            crop.save(crop_path)
            answer = ocr_single_key(crop_path)
            cells.append(OcrCell(question_number, answer, answer))

    return cells


def answer_item(year: int, cell: OcrCell) -> dict[str, Any]:
    raw_answer = cell.answer_text
    options = [part for part in raw_answer.split("/") if part in VALID_OPTIONS]

    item: dict[str, Any] = {
        "question_number": cell.question_number,
        "answer_option": options[0] if options else None,
        "accepted_answer_options": options,
        "explanation": "",
        "verification_status": "verified_image" if options else "dropped",
        "answer_source": f"Extracted from generated_questions/answer_keys/{year}_answer_key_setA.png",
    }

    if raw_answer == "x":
        item["answer_option"] = None
        item["accepted_answer_options"] = []
        item["verification_status"] = "dropped"
        item["explanation"] = "Question marked X/dropped in the source answer key image; excluded from score."

    override = RESOLVED_OVERRIDES.get(year, {}).get(cell.question_number)
    if override:
        answer_option = override["answer_option"]
        item.update(override)
        item["accepted_answer_options"] = [answer_option]
        item["explanation"] = ""

    return item


def extract_year(year: int) -> Path:
    image_path = IMAGE_DIR / f"{year}_answer_key_setA.png"
    if not image_path.exists():
        raise FileNotFoundError(f"Missing answer-key image: {image_path}")

    if year in {2019, 2020, 2021, 2022, 2023}:
        cells = parse_colored_image(year, image_path)
    elif year in {2024, 2025}:
        cells = parse_official_image(year, image_path)
    elif year == 2026:
        cells = parse_2026_provisional_image(year, image_path)
    else:
        raise ValueError(f"No extractor configured for {year}")

    items = [answer_item(year, cell) for cell in sorted(cells, key=lambda item: item.question_number)]
    if len(items) != 100:
        raise ValueError(f"{year}: expected 100 answers, got {len(items)}")

    out_path = ANSWER_KEY_DIR / f"upsc_{year}_answers.json"
    ANSWER_KEY_DIR.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(items, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return out_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--years", nargs="*", type=int, default=[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026])
    args = parser.parse_args()

    for year in args.years:
        out_path = extract_year(year)
        print(f"extracted {year} answer key -> {out_path.relative_to(PROJECT_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
