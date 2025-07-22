"""
Backward compatibility wrapper for the refactored OCR service.
Import the main processing function from the new modular structure.
"""

# Import the main function from the new modular structure
from ocr_main import process_image

# Also import individual functions for backward compatibility
from image.preprocessor import preprocess_image
from image.contour_sorter import sort_contours
from text.extractor import extract_text_from_contours
from text.cleaner import clean_text
from text.keyword_finder import find_keywords_in_text
from artifacts.api_client import fetch_artifact_names
from artifacts.matcher import find_artifact_names_in_text

# Re-export the main function
__all__ = [
    'process_image',
    'preprocess_image', 
    'sort_contours',
    'extract_text_from_contours',
    'clean_text',
    'find_keywords_in_text',
    'fetch_artifact_names',
    'find_artifact_names_in_text'
]
