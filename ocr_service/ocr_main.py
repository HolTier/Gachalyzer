import os
from typing import Dict, List

from image.preprocessor import preprocess_image
from text.extractor import extract_text_from_contours
from text.keyword_finder import find_keywords_in_text
from artifacts.api_client import fetch_artifact_names
from artifacts.matcher import find_artifact_names_in_text
from utils.api_config import api_config


async def process_image(file_content: bytes) -> Dict[str, List[str]]:
    print("Preprocessing image...")
    image, contours = preprocess_image(file_content)
    print("Image preprocessed.")
    
    ocr_lines = extract_text_from_contours(image, contours)
    print("Text extracted from image: ", ocr_lines)

    found_keywords = find_keywords_in_text(ocr_lines)
    print("Keywords found in text.: ", found_keywords)

    found_artifacts = []
    try:
        artifact_names = await fetch_artifact_names(api_config.get_artifact_names_url())
        if artifact_names:
            found_artifacts = find_artifact_names_in_text(ocr_lines, artifact_names)
            print("Artifacts found in text:", found_artifacts)
    except Exception as e:
        print(f"Error processing artifacts: {e}")

    return {
        "keywords": found_keywords,
        "artifacts": found_artifacts
    }
