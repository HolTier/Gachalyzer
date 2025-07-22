"""Keyword pattern matching in OCR text."""

import re
from typing import List
from constants import KEYWORDS


def find_keywords_in_text(text: List[str]) -> List[str]:
    matches = []

    for line in text:
        clean_text = re.sub(r'[^\w\s.%]', ' ', line)
        clean_text = re.sub(r'\s+', ' ', clean_text)

        print("Cleaned text for keyword search:", clean_text)
        
        for word in KEYWORDS:
            pattern = re.escape(word) + r'\s*(\d+(?:\.\d+)?%?)'
            # Find all matches in this text segment
            found_matches = re.findall(pattern, clean_text, re.IGNORECASE)
            for match in found_matches:
                matches.append(f"{word} {match}") 

    return matches
