import re
from typing import List
from difflib import get_close_matches


def find_artifact_names_in_text(text_lines: List[str], artifact_names: List[str]) -> List[str]:
    found_artifacts = []
    threshold = 0.7 

    combined_text = ' '.join(text_lines).lower()

    for artifact_name in artifact_names:
        artifact_lower = artifact_name.lower()

        # Exact match
        if artifact_lower in combined_text:
            found_artifacts.append(artifact_name)
            continue

        # Multi-word partial matching
        artifact_words = artifact_lower.split()

        if len(artifact_words) > 1:
            words_found = 0
            for word in artifact_words:
                if len(word) > 2 and word in combined_text:
                    words_found += 1
            
            if words_found >= len(artifact_words) * threshold:
                found_artifacts.append(artifact_name)
                continue
        
        # Fuzzy matching per line
        for line in text_lines:
            clean_line = re.sub(r'[^\w\s]', ' ', line.lower())
            clean_line = re.sub(r'\s+', ' ', clean_line).strip()

            # Full line fuzzy match
            matches = get_close_matches(artifact_lower, [clean_line], n=1, cutoff=0.75)
            if matches:
                found_artifacts.append(artifact_name)
                break
                
            # Single word fuzzy match
            if len(artifact_words) == 1:
                line_words = clean_line.split()
                matches = get_close_matches(artifact_lower, line_words, n=1, cutoff=0.8)
                if matches:
                    found_artifacts.append(artifact_name)
                    break
    
    return list(set(found_artifacts))
