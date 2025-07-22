import cv2
import re
import numpy as np
from matplotlib import pyplot as plt
import pytesseract
from typing import List
from difflib import get_close_matches
import requests
import json
import os
import asyncio
from constants import KEYWORDS, CLEANING_KEYS

API_URL = os.getenv("API_URL", "http://localhost:8000")

async def fetch_artifact_names(api_url: str) -> List[str]:
    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()

        data = response.json()

        if isinstance(data, list):
            return [item.get('name', '') for item in data if 'name' in item]
        else:
            return []
        
    except requests.RequestException as e:
        print(f"Error fetching artifact names: {e}")
        return []
    
def find_artifact_names_in_text(text_lines: List[str], artifact_names: List[str]) -> List[str]:
    found_artifacts = []
    threshold = 0.7 

    combined_text = ' '.join(text_lines).lower()

    for artifact_name in artifact_names:
        artifact_lower = artifact_name.lower()

        if artifact_lower in combined_text:
            found_artifacts.append(artifact_name)
            continue

        artifact_words = artifact_lower.split()

        if len(artifact_words) > 1:
            words_found = 0
            for word in artifact_words:
                if len(word) > 2 and word in combined_text:
                    words_found +=1
            
            if words_found >= len(artifact_words) * threshold:
                found_artifacts.append(artifact_name)
                continue
        
        for line in text_lines:
            clean_line = re.sub(r'[^\w\s]', ' ', line.lower())
            clean_line = re.sub(r'\s+', ' ', clean_line).strip()

            matches = get_close_matches(artifact_lower, [clean_line], n=1, cutoff=0.75)
            if matches:
                found_artifacts.append(artifact_name)
                break
                
            if len(artifact_words) == 1:
                line_words = clean_line.split()
                matches = get_close_matches(artifact_lower, line_words, n=1, cutoff=0.8)
                if matches:
                    found_artifacts.append(artifact_name)
                    break
    
    return list(set(found_artifacts))

        
async def process_image(file_content: bytes):
    print("Preprocessing image...")
    image, contours = preprocess_image(file_content)
    print("Image preprocessed.")
    
    ocr_lines = extract_text_from_contours(image, contours)
    print("Text extracted from image: ", ocr_lines)
    
    # cleaned_text = clean_text(ocr_lines, KEYWORDS)
    # print("Text cleaned and matched with known stats: ", cleaned_text)

    found_keywords = find_keywords_in_text(ocr_lines)
    print("Keywords found in text.: ", found_keywords)

    api_url = API_URL + "/init-data/init-game-artifact-name"
    found_artifacts = []
    if api_url:
        try:
            artifact_names = await fetch_artifact_names(api_url)
            if artifact_names:
                found_artifacts = find_artifact_names_in_text(ocr_lines, artifact_names)
                print("Artifacts found in text:", found_artifacts)
        except Exception as e:
            print(f"Error processing artifacts: {e}")

    return {
        'keywords': found_keywords,
        'artifacts': found_artifacts
    }

def preprocess_image(file_content: bytes) -> str:
    # Convert bytes to numpy array
    nparr = np.frombuffer(file_content, np.uint8)
    # Decode the image from the numpy array
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Image not found or unable to load.")

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Apply Gaussian blur to the image
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    # Apply adaptive thresholding to get a binary image
    binary = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
    # Dilate the binary image to close gaps in the text

    kernel = np.ones((3, 3), np.uint8)
    dilated = cv2.dilate(binary, kernel, iterations=1)
    # Erode the image to remove small noise

    eroded = cv2.erode(dilated, kernel, iterations=1)
    # Invert the binary image to get white text on black background
    binary = cv2.bitwise_not(eroded)
    # Find contours in the binary image
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # Filter contours based on area to remove noise
    min_area = 1000  # Minimum area to keep a contour
    contours = [cnt for cnt in contours if cv2.contourArea(cnt) > min_area]

    # Sort contours properly for reading order
    contours = sort_contours(contours)
    # Return the preprocessed image and contours
    return image, contours

def sort_contours(contours):
    # Get bounding boxes and sort from top to bottom
    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    (contours, bounding_boxes) = zip(*sorted(zip(contours, bounding_boxes),
                                            key=lambda b: (b[1][1] // 40, b[1][0])))  # Group by rows (40 is line height threshold)
    return contours

def extract_text_from_contours(image, contours):
    # Create a list to hold the extracted text
    extracted_text = []

    if image is None or len(image.shape) < 2:
        raise ValueError("Invalid image input")
    
    if not contours:
        return extracted_text  # Return empty list if no contours

    print("Extracting text from contours...")
    # Loop through each contour and extract text
    for contour in contours:
        # Get the bounding box for each contour
        x, y, w, h = cv2.boundingRect(contour)
        # Extract the region of interest (ROI) from the image
        roi = image[y:y + h, x:x + w]
        # Use Tesseract to extract text from the ROI
        text = pytesseract.image_to_string(roi, config='--oem 3 --psm 3')
        # Append the extracted text to the list
        extracted_text.append(text.strip())

    print("Extracted text from contours:", extracted_text)
    return extracted_text

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
        raw = re.sub(r'(?<=\d)(?=[A-Za-z])', '.', raw)  # insert . if digit followed by letter
        raw = re.sub(r'[^0-9\.%]', '', raw)  # only keep numbers, dot and %
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

def find_keywords_in_text(text: str) -> List[str]:
    matches = []

    for line in text:
        # Clean the text
        clean_text = re.sub(r'[^\w\s.%]', ' ', line)  # Replace special chars with space
        clean_text = re.sub(r'\s+', ' ', clean_text)  # Collapse multiple spaces

        print("Cleaned text for keyword search:", clean_text)
        
        # Search for all words in this text segment
        for word in KEYWORDS:
            pattern = re.escape(word) + r'\s*(\d+(?:\.\d+)?%?)'
            # Find all matches in this text segment
            found_matches = re.findall(pattern, clean_text, re.IGNORECASE)
            for match in found_matches:
                matches.append(f"{word} {match}")  # Combine the word with its value

    return matches
