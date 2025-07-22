import re
from typing import List
from difflib import get_close_matches
from constants import CLEANING_KEYS


def clean_text(ocr_lines: List[str], known_stats: List[str]) -> List[str]:
    def fuzzy_match_stat(line: str) -> str:
        for stat in known_stats:
            if stat.lower() in line.lower():
                return stat
        # Try fuzzy matching
        matches = get_close_matches(line.lower(), [s.lower() for s in known_stats], n=1, cutoff=0.6)
        if matches:
            matched_index = [s.lower() for s in known_stats].index(matches[0])
            return known_stats[matched_index]
        return None

    def clean_ocr_value(raw: str) -> str:
        raw = raw.replace('A', '4').replace('O', '0').replace('I', '1').replace('l', '1')
        raw = re.sub(r'(?<=\d)(?=[A-Za-z])', '.', raw) 
        raw = re.sub(r'[^0-9\.%]', '', raw)
        return raw

    def correct_percentage(value: str, stat_name: str) -> str:
        try:
            num = float(value.replace('%', ''))
            if 'crit' in stat_name.lower() and num > 50:
                num = num / 10
            else:
                for name in CLEANING_KEYS:
                    if name in stat_name.lower() and num > 50:
                        num = num / 10
            return f"{num:.1f}%" if '%' in value else f"{num:.1f}"
        except ValueError:
            return value

    results = []
    for line in ocr_lines:
        stat = fuzzy_match_stat(line)
        if stat:
            raw_value = line.lower().replace(stat.lower(), '').strip()
            cleaned = clean_ocr_value(raw_value)
            corrected = correct_percentage(cleaned, stat)
            results.append(f"{stat} {corrected}")
    return results
