"""Convert clinic schedule Excel dump to scheduleWithDoctors.json and Cards.json."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DUMP = ROOT / "excel_dump.json"

ALL_DAYS = [
    "\u0627\u0644\u0633\u0628\u062a",
    "\u0627\u0644\u0623\u062d\u062f",
    "\u0627\u0644\u0625\u062b\u0646\u064a\u0646",
    "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621",
    "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
    "\u0627\u0644\u062e\u0645\u064a\u0633",
]
LEAVE = "\u0625\u062c\u0627\u0632\u0629"

CLINIC_META: dict[str, dict[str, str]] = {
    "\u0627\u0644\u062a\u0635\u0648\u064a\u0631 \u0627\u0644\u062a\u0644\u0641\u0632\u064a\u0648\u0646\u064a": {
        "group": "\u062a\u0634\u062e\u064a\u0635",
        "desc": "\u062a\u0634\u062e\u064a\u0635 \u062f\u0642\u064a\u0642 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0623\u062d\u062f\u062b \u0623\u062c\u0647\u0632\u0629 \u0627\u0644\u0623\u0634\u0639\u0629",
        "icon": "scan",
        "color": "#FDA4AF",
    },
    "\u0627\u0644\u0639\u0638\u0627\u0645 \u0648\u0627\u0644\u0643\u0633\u0648\u0631": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u0639\u0644\u0627\u062c \u0627\u0644\u0625\u0635\u0627\u0628\u0627\u062a \u0627\u0644\u0631\u064a\u0627\u0636\u064a\u0629 \u0648\u062d\u0648\u0627\u062f\u062b \u0627\u0644\u0643\u0633\u0648\u0631 \u0627\u0644\u0645\u0639\u0642\u062f\u0629",
        "icon": "bone",
        "color": "#86EFAC",
    },
    "\u0627\u0644\u0642\u0644\u0628 \u0648\u0627\u0644\u0623\u0648\u0639\u064a\u0629 \u0627\u0644\u062f\u0645\u0648\u064a\u0629": {
        "group": "\u0628\u0627\u0637\u0646\u064a\u0629",
        "desc": "\u0631\u0639\u0627\u064a\u0629 \u0642\u0644\u0628\u064a\u0629 \u0634\u0627\u0645\u0644\u0629 \u0648\u0641\u062d\u0648\u0635\u0627\u062a \u062f\u0648\u0631\u064a\u0629 \u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0642\u0644\u0628",
        "icon": "heart",
        "color": "#FCA5A5",
    },
    "\u0627\u0644\u0635\u062f\u0631\u064a\u0629": {
        "group": "\u0628\u0627\u0637\u0646\u064a\u0629",
        "desc": "\u062a\u0634\u062e\u064a\u0635 \u0648\u0639\u0644\u0627\u062c \u0623\u0645\u0631\u0627\u0636 \u0627\u0644\u062c\u0647\u0627\u0632 \u0627\u0644\u062a\u0646\u0641\u0633\u064a \u0648\u0627\u0644\u0631\u0628\u0648",
        "icon": "lungs",
        "color": "#7DD3FC",
    },
    "\u0627\u0644\u0623\u0639\u0635\u0627\u0628 \u0627\u0644\u0637\u0631\u0641\u064a\u0629": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u0639\u0644\u0627\u062c \u0627\u0644\u0623\u0639\u0635\u0627\u0628 \u0627\u0644\u0637\u0631\u0641\u064a\u0629 \u0648\u0627\u0644\u0625\u0635\u0627\u0628\u0627\u062a \u0627\u0644\u0639\u0635\u0628\u064a\u0629",
        "icon": "brain",
        "color": "#C4B5FD",
    },
    "\u0627\u0644\u062c\u0644\u062f\u064a\u0629": {
        "group": "\u062a\u0634\u062e\u064a\u0635",
        "desc": "\u0639\u0644\u0627\u062c \u0645\u0634\u0627\u0643\u0644 \u0627\u0644\u062c\u0644\u062f \u0648\u0627\u0644\u062a\u062c\u0645\u064a\u0644 \u0648\u0627\u0644\u0644\u064a\u0632\u0631",
        "icon": "skin",
        "color": "#FCA5A5",
    },
    "\u0627\u0644\u0623\u0639\u0635\u0627\u0628": {
        "group": "\u0628\u0627\u0637\u0646\u064a\u0629",
        "desc": "\u0639\u0644\u0627\u062c \u0627\u0644\u0623\u0645\u0631\u0627\u0636 \u0627\u0644\u0639\u0635\u0628\u064a\u0629 \u0627\u0644\u0645\u0632\u0645\u0646\u0629 \u0648\u0627\u0644\u062d\u0627\u062f\u0629",
        "icon": "brain",
        "color": "#D1D5DB",
    },
    "\u0627\u0644\u062c\u0647\u0627\u0632 \u0627\u0644\u0647\u0636\u0645\u064a": {
        "group": "\u0628\u0627\u0637\u0646\u064a\u0629",
        "desc": "\u0639\u0644\u0627\u062c \u0627\u0644\u0642\u0648\u0644\u0648\u0646 \u0648\u0627\u0644\u0645\u0639\u062f\u0629 \u0648\u0645\u0646\u0627\u0638\u064a\u0631 \u0627\u0644\u062c\u0647\u0627\u0632 \u0627\u0644\u0647\u0636\u0645\u064a",
        "icon": "stomach",
        "color": "#86EFAC",
    },
    "\u0627\u0644\u0623\u0646\u0641 \u0648\u0627\u0644\u0623\u0630\u0646 \u0648\u0627\u0644\u062d\u0646\u062c\u0631\u0629": {
        "group": "\u062a\u0634\u062e\u064a\u0635",
        "desc": "\u0639\u0644\u0627\u062c \u0645\u0634\u0627\u0643\u0644 \u0627\u0644\u0633\u0645\u0639 \u0648\u0627\u0644\u062a\u0648\u0627\u0632\u0646 \u0648\u0627\u0644\u062c\u064a\u0648\u0628 \u0627\u0644\u0623\u0646\u0641\u064a\u0629",
        "icon": "ear",
        "color": "#93C5FD",
    },
    "\u0627\u0644\u0639\u064a\u0648\u0646": {
        "group": "\u062a\u0634\u062e\u064a\u0635",
        "desc": "\u0641\u062d\u0635 \u0627\u0644\u0646\u0638\u0631 \u0627\u0644\u0634\u0627\u0645\u0644 \u0648\u062c\u0631\u0627\u062d\u0627\u062a \u062a\u0635\u062d\u064a\u062d \u0627\u0644\u0625\u0628\u0635\u0627\u0631",
        "icon": "eye",
        "color": "#FECACA",
    },
    "\u0627\u0644\u0623\u0633\u0646\u0627\u0646": {
        "group": "\u062a\u0634\u062e\u064a\u0635",
        "desc": "\u0639\u0644\u0627\u062c\u0627\u062a \u0648\u0642\u0627\u0626\u064a\u0629 \u0648\u062a\u062c\u0645\u064a\u0644\u064a\u0629 \u0648\u0632\u0631\u0627\u0639\u0629 \u0627\u0644\u0623\u0633\u0646\u0627\u0646",
        "icon": "tooth",
        "color": "#A7F3D0",
    },
    "\u062c\u0631\u0627\u062d\u0629 \u0648\u062c\u0647 \u0648 \u0641\u0643\u064a\u0646": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u0648\u062c\u0647 \u0648\u0627\u0644\u0641\u0643\u064a\u0646 \u0648\u0639\u0644\u0627\u062c \u0627\u0644\u062a\u0634\u0648\u0647\u0627\u062a",
        "icon": "surgery",
        "color": "#FDE68A",
    },
    "\u0627\u0644\u062a\u0642\u0648\u064a\u0645": {
        "group": "\u062a\u0634\u062e\u064a\u0635",
        "desc": "\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0623\u0633\u0646\u0627\u0646 \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0648\u0627\u0644\u0643\u0628\u0627\u0631",
        "icon": "braces",
        "color": "#86EFAC",
    },
    "\u0627\u0644\u0646\u0633\u0627\u0621 \u0648\u0627\u0644\u0648\u0644\u0627\u062f\u0629": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u062d\u0645\u0644 \u0648\u0627\u0644\u0648\u0644\u0627\u062f\u0629 \u0648\u0635\u062d\u0629 \u0627\u0644\u0645\u0631\u0623\u0629",
        "icon": "female",
        "color": "#F9A8D4",
    },
    "\u0627\u0644\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u0639\u0627\u0645\u0629": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u0639\u0645\u0644\u064a\u0627\u062a \u062c\u0631\u0627\u062d\u064a\u0629 \u0639\u0627\u0645\u0629 \u0648\u0637\u0627\u0631\u0626\u0629 \u0648\u0645\u062c\u062f\u0648\u0644\u0629",
        "icon": "surgery",
        "color": "#FDE68A",
    },
    "\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u0623\u0637\u0641\u0627\u0644": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u0631\u0639\u0627\u064a\u0629 \u062c\u0631\u0627\u062d\u064a\u0629 \u0645\u062a\u062e\u0635\u0635\u0629 \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0645\u0646 \u062d\u062f\u064a\u062b\u064a \u0627\u0644\u0648\u0644\u0627\u062f\u0629",
        "icon": "child",
        "color": "#A7F3D0",
    },
    "\u0637\u0628 \u0648\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u0623\u0648\u0639\u064a\u0629 \u0627\u0644\u062f\u0645\u0648\u064a\u0629": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u062a\u0634\u062e\u064a\u0635 \u0648\u0639\u0644\u0627\u062c \u0623\u0645\u0631\u0627\u0636 \u0627\u0644\u0623\u0648\u0639\u064a\u0629 \u0627\u0644\u062f\u0645\u0648\u064a\u0629",
        "icon": "heart",
        "color": "#FCA5A5",
    },
    "\u0627\u0644\u0645\u0633\u0627\u0644\u0643 \u0627\u0644\u0628\u0648\u0644\u064a\u0629": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u0639\u0644\u0627\u062c \u0627\u0644\u0643\u0644\u0649 \u0648\u0627\u0644\u0645\u0633\u0627\u0644\u0643 \u0627\u0644\u0628\u0648\u0644\u064a\u0629",
        "icon": "urology",
        "color": "#93C5FD",
    },
    "\u062c\u0631\u0627\u062d\u0629 \u0639\u0638\u0627\u0645 \u0627\u0644\u0623\u0637\u0641\u0627\u0644 \u0648\u0627\u0644\u062a\u0634\u0648\u0647\u0627\u062a": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u0639\u0644\u0627\u062c \u062a\u0634\u0648\u0647\u0627\u062a \u0627\u0644\u0639\u0638\u0627\u0645 \u0639\u0646\u062f \u0627\u0644\u0623\u0637\u0641\u0627\u0644",
        "icon": "bone",
        "color": "#86EFAC",
    },
    "\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u062a\u062c\u0645\u064a\u0644": {
        "group": "\u062c\u0631\u0627\u062d\u0629",
        "desc": "\u062c\u0631\u0627\u062d\u0627\u062a \u062a\u062c\u0645\u064a\u0644\u064a\u0629 \u0648\u062a\u0631\u0645\u064a\u0645\u064a\u0629 \u0645\u062a\u062e\u0635\u0635\u0629",
        "icon": "surgery",
        "color": "#F9A8D4",
    },
}

DEFAULT_META = {
    "group": "\u062c\u0631\u0627\u062d\u0629",
    "desc": "\u0639\u064a\u0627\u062f\u0629 \u062a\u062e\u0635\u0635\u064a\u0629",
    "icon": "surgery",
    "color": "#D1D5DB",
}

DAY_RULES = [
    (re.compile(r"\u0627\u0644\u0633\u0628\u062a|\u0633\u0628\u062a"), "\u0627\u0644\u0633\u0628\u062a"),
    (re.compile(r"\u0627\u0644\u0623\u062d\u062f|\u0627\u0644\u0627\u062d\u062f|\u0627\u062d\u062f"), "\u0627\u0644\u0623\u062d\u062f"),
    (re.compile(r"\u0627\u0644\u0625\u062b\u0646\u064a\u0646|\u0627\u0644\u0627\u062b\u0646\u064a\u0646|\u0625\u062b\u0646\u064a\u0646|\u0627\u062b\u0646\u064a\u0646"), "\u0627\u0644\u0625\u062b\u0646\u064a\u0646"),
    (re.compile(r"\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621|\u062b\u0644\u0627\u062b\u0627\u0621"), "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621"),
    (re.compile(r"\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621|\u0627\u0644\u0627\u0631\u0628\u0639\u0627\u0621|\u0627\u0631\u0628\u0639\u0627\u0621"), "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621"),
    (re.compile(r"\u0627\u0644\u062e\u0645\u064a\u0633|\u062e\u0645\u064a\u0633"), "\u0627\u0644\u062e\u0645\u064a\u0633"),
]

CLINIC_ORDER = [
    "\u0627\u0644\u062a\u0635\u0648\u064a\u0631 \u0627\u0644\u062a\u0644\u0641\u0632\u064a\u0648\u0646\u064a",
    "\u0627\u0644\u0639\u0638\u0627\u0645 \u0648\u0627\u0644\u0643\u0633\u0648\u0631",
    "\u0627\u0644\u0642\u0644\u0628 \u0648\u0627\u0644\u0623\u0648\u0639\u064a\u0629 \u0627\u0644\u062f\u0645\u0648\u064a\u0629",
    "\u0627\u0644\u0635\u062f\u0631\u064a\u0629",
    "\u0627\u0644\u0623\u0639\u0635\u0627\u0628 \u0627\u0644\u0637\u0631\u0641\u064a\u0629",
    "\u0627\u0644\u062c\u0644\u062f\u064a\u0629",
    "\u0627\u0644\u0623\u0639\u0635\u0627\u0628",
    "\u0627\u0644\u062c\u0647\u0627\u0632 \u0627\u0644\u0647\u0636\u0645\u064a",
    "\u0627\u0644\u0623\u0646\u0641 \u0648\u0627\u0644\u0623\u0630\u0646 \u0648\u0627\u0644\u062d\u0646\u062c\u0631\u0629",
    "\u0627\u0644\u0639\u064a\u0648\u0646",
    "\u0627\u0644\u0623\u0633\u0646\u0627\u0646",
    "\u062c\u0631\u0627\u062d\u0629 \u0648\u062c\u0647 \u0648 \u0641\u0643\u064a\u0646",
    "\u0627\u0644\u062a\u0642\u0648\u064a\u0645",
    "\u0627\u0644\u0646\u0633\u0627\u0621 \u0648\u0627\u0644\u0648\u0644\u0627\u062f\u0629",
    "\u0627\u0644\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u0639\u0627\u0645\u0629",
    "\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u0623\u0637\u0641\u0627\u0644",
    "\u0637\u0628 \u0648\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u0623\u0648\u0639\u064a\u0629 \u0627\u0644\u062f\u0645\u0648\u064a\u0629",
    "\u0627\u0644\u0645\u0633\u0627\u0644\u0643 \u0627\u0644\u0628\u0648\u0644\u064a\u0629",
    "\u062c\u0631\u0627\u062d\u0629 \u0639\u0638\u0627\u0645 \u0627\u0644\u0623\u0637\u0641\u0627\u0644 \u0648\u0627\u0644\u062a\u0634\u0648\u0647\u0627\u062a",
    "\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u062a\u062c\u0645\u064a\u0644",
]


def normalize_time(value: str | None) -> str:
    if not value:
        return ""
    text = re.sub(r"\s+", " ", value.strip())
    text = text.replace("\n", " | ")
    return text


def parse_days(days_text: str | None, time_text: str | None, doctor: str = "") -> dict[str, str]:
    time_value = normalize_time(time_text)
    if doctor.strip() == "\u062f. \u0646\u062c\u0627\u062d \u0645\u062d\u0645\u062f \u0627\u0644\u0643\u0631\u062f":
        schedule = {day: LEAVE for day in ALL_DAYS}
        schedule["\u0627\u0644\u0623\u062d\u062f"] = "\u0645\u0646 9\u0635 \u0625\u0644\u0649 1\u0645"
        schedule["\u0627\u0644\u0633\u0628\u062a"] = "\u0645\u0646 2\u0645 \u0625\u0644\u0649 5\u0645"
        schedule["\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621"] = "\u0645\u0646 2\u0645 \u0625\u0644\u0649 5\u0645"
        return schedule

    if not days_text and time_value:
        return {day: time_value for day in ALL_DAYS}

    if not days_text:
        return {day: LEAVE for day in ALL_DAYS}

    raw = days_text.strip()
    lower = raw.lower()

    active: set[str] = set()

    if "\u064a\u0648\u0645\u064a\u0627\u064b" in raw or "\u064a\u0648\u0645\u064a\u0627" in raw:
        active = set(ALL_DAYS)
        if "\u0645\u0627 \u0639\u062f\u0627 \u0627\u0644\u0625\u062b\u0646\u064a\u0646" in raw:
            active.discard("\u0627\u0644\u0625\u062b\u0646\u064a\u0646")
    else:
        for pattern, canonical in DAY_RULES:
            if pattern.search(raw):
                active.add(canonical)

    if not active:
        return {day: time_value or LEAVE for day in ALL_DAYS}

    return {day: (time_value or LEAVE) if day in active else LEAVE for day in ALL_DAYS}


def infer_clinic(floor: str | None, clinic: str | None, doctor: str, last_clinic: str | None) -> str | None:
    if clinic:
        return clinic.strip()

    if not doctor:
        return last_clinic

    if last_clinic in {
        "\u0627\u0644\u062c\u0631\u0627\u062d\u0629 \u0627\u0644\u0639\u0627\u0645\u0629",
        "\u0627\u0644\u0645\u0633\u0627\u0644\u0643 \u0627\u0644\u0628\u0648\u0644\u064a\u0629",
        "\u0627\u0644\u0623\u0646\u0641 \u0648\u0627\u0644\u0623\u0630\u0646 \u0648\u0627\u0644\u062d\u0646\u062c\u0631\u0629",
    }:
        return last_clinic

    if floor and "\u0627\u0644\u062e\u0627\u0645\u0633" in floor and last_clinic:
        return last_clinic

    return last_clinic


def main() -> None:
    rows = json.loads(DUMP.read_text(encoding="utf-8"))

    clinics: dict[str, dict] = {}
    floors: dict[str, str] = {}
    last_clinic: str | None = None
    last_floor: str | None = None
    last_days: str | None = None
    last_time: str | None = None

    for row in rows[2:]:
        floor = row[0] if row[0] else last_floor
        clinic = infer_clinic(floor, row[1], row[2] or "", last_clinic)
        doctor = (row[2] or "").strip()
        days = row[3] if row[3] else None
        time_value = row[4] if row[4] else None

        if floor:
            last_floor = floor

        if not doctor:
            continue

        if not clinic:
            continue

        if clinic != last_clinic:
            last_days = None
            last_time = None

        last_clinic = clinic

        if days:
            last_days = days
        if time_value:
            last_time = time_value

        effective_days = days or last_days
        effective_time = time_value or last_time

        if clinic not in clinics:
            meta = CLINIC_META.get(clinic, DEFAULT_META)
            clinics[clinic] = {
                "title": clinic,
                "group": meta["group"],
                "floor": floor or "\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u062a\u062d\u062f\u064a\u062f",
                "doctors": [],
            }
        elif floor and clinics[clinic]["floor"] == "\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u062a\u062d\u062f\u064a\u062f":
            clinics[clinic]["floor"] = floor

        floors[clinic] = clinics[clinic]["floor"]

        schedule = parse_days(effective_days, effective_time, doctor)
        clinics[clinic]["doctors"].append({"name": doctor, "schedule": schedule})

    ordered_titles = [title for title in CLINIC_ORDER if title in clinics]
    for title in clinics:
        if title not in ordered_titles:
            ordered_titles.append(title)

    schedules = []
    cards = []

    for index, title in enumerate(ordered_titles, start=1):
        clinic = clinics[title]
        meta = CLINIC_META.get(title, DEFAULT_META)
        floor = clinic["floor"]
        desc = meta["desc"]
        if floor and floor != "\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u062a\u062d\u062f\u064a\u062f":
            desc = f"{desc} \u2014 {floor}"

        schedules.append(
            {
                "id": index,
                "title": title,
                "group": clinic["group"],
                "floor": floor,
                "doctors": clinic["doctors"],
            }
        )
        cards.append(
            {
                "id": index,
                "title": title,
                "desc": desc,
                "icon": meta["icon"],
                "color": meta["color"],
                "group": clinic["group"],
                "branch": floor,
            }
        )

    schedules_path = ROOT / "app" / "jsonData" / "scheduleWithDoctors.json"
    cards_path = ROOT / "app" / "jsonData" / "Cards.json"

    schedules_path.write_text(
        json.dumps(schedules, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    cards_path.write_text(
        json.dumps(cards, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {len(schedules)} clinics")
    for item in schedules:
        print(f"- {item['title']}: {len(item['doctors'])} doctors ({item['floor']})")


if __name__ == "__main__":
    main()
