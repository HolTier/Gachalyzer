import re
from typing import List, Tuple
from difflib import get_close_matches


def find_artifact_names_in_text(text_lines: List[str], artifact_names: List[str]) -> List[str]:
    """
    Find artifact names in OCR text lines using multiple matching strategies.
    
    Args:
        text_lines: List of text lines from OCR
        artifact_names: List of artifact names to search for
        
    Returns:
        List of found artifact names
    """
    found_artifacts = []
    debug_info = []
    
    # Preprocess text
    combined_text = ' '.join(text_lines).lower()
    cleaned_combined = _clean_text(combined_text)
    
    print(f"DEBUG: Processing {len(artifact_names)} artifact names against {len(text_lines)} text lines")
    print(f"DEBUG: Combined text: '{combined_text}'")
    
    for artifact_name in artifact_names:
        artifact_lower = artifact_name.lower()
        found = False
        match_reason = ""
        
        # Strategy 1: Exact match (case-insensitive)
        if artifact_lower in combined_text:
            found_artifacts.append(artifact_name)
            match_reason = "exact_match"
            found = True
        
        # Strategy 2: Exact match on cleaned text
        elif artifact_lower in cleaned_combined:
            found_artifacts.append(artifact_name)
            match_reason = "exact_match_cleaned"
            found = True
        
        # Strategy 3: Multi-word partial matching (improved logic)
        elif not found:
            found, match_reason = _try_multiword_match(artifact_name, artifact_lower, combined_text, cleaned_combined)
            if found:
                found_artifacts.append(artifact_name)
        
        # Strategy 4: Fuzzy matching per line
        if not found:
            found, match_reason = _try_fuzzy_match(artifact_name, artifact_lower, text_lines)
            if found:
                found_artifacts.append(artifact_name)
        
        if found:
            debug_info.append(f"FOUND: '{artifact_name}' via {match_reason}")
        
    if debug_info:
        print(f"DEBUG: Matches found:")
        for info in debug_info:
            print(f"  {info}")
    
    result = list(set(found_artifacts))
    print(f"DEBUG: Final result: {result}")
    return result


def _clean_text(text: str) -> str:
    """Clean text for better matching while preserving important characters."""
    # Remove excessive punctuation but keep spaces and letters
    cleaned = re.sub(r'[^\w\s\-\']', ' ', text)
    # Normalize whitespace
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def _try_multiword_match(artifact_name: str, artifact_lower: str, combined_text: str, cleaned_combined: str) -> Tuple[bool, str]:
    """Try matching multi-word artifact names with improved logic."""
    artifact_words = artifact_lower.split()
    
    if len(artifact_words) <= 1:
        return False, ""
    
    for text_to_search, text_type in [(combined_text, "original"), (cleaned_combined, "cleaned")]:
        words_found = 0
        significant_words_found = 0
        total_significant_words = 0
        
        for word in artifact_words:
            if word in text_to_search:
                words_found += 1
                if len(word) > 2:
                    significant_words_found += 1
            
            if len(word) > 2:
                total_significant_words += 1
        
        total_words = len(artifact_words)
        
        significant_threshold = 0.75
        if total_significant_words > 0:
            significant_ratio = significant_words_found / total_significant_words
            if significant_ratio >= significant_threshold:
                return True, f"multiword_significant_{text_type}"
        
        ratio_threshold = 0.7
        overall_ratio = words_found / total_words
        if overall_ratio >= ratio_threshold:
            return True, f"multiword_overall_{text_type}"
    
    return False, ""


def _try_fuzzy_match(artifact_name: str, artifact_lower: str, text_lines: List[str]) -> Tuple[bool, str]:
    """Try fuzzy matching with improved logic."""
    artifact_words = artifact_lower.split()
    
    for line_idx, line in enumerate(text_lines):
        clean_line = _clean_text(line.lower())
        
        if not clean_line.strip():
            continue
        
        # Strategy 1: Full artifact name fuzzy match against line
        matches = get_close_matches(artifact_lower, [clean_line], n=1, cutoff=0.7)
        if matches:
            return True, f"fuzzy_line_{line_idx}_full"
        
        # Strategy 2: For single words, try fuzzy match against words in line
        if len(artifact_words) == 1:
            line_words = clean_line.split()
            matches = get_close_matches(artifact_lower, line_words, n=1, cutoff=0.75)
            if matches:
                return True, f"fuzzy_line_{line_idx}_word"
        
        # Strategy 3: For multi-word artifacts, try partial fuzzy matching
        else:
            line_words = clean_line.split()
            fuzzy_word_matches = 0
            
            for artifact_word in artifact_words:
                if len(artifact_word) > 2:
                    word_matches = get_close_matches(artifact_word, line_words, n=1, cutoff=0.8)
                    if word_matches:
                        fuzzy_word_matches += 1
            
            significant_words = sum(1 for w in artifact_words if len(w) > 2)
            if significant_words > 0 and fuzzy_word_matches / significant_words >= 0.6:
                return True, f"fuzzy_line_{line_idx}_partial"
    
    return False, ""
