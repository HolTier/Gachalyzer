import cv2
import re
import numpy as np
from matplotlib import pyplot as plt
import pytesseract
from typing import List
from difflib import get_close_matches
from constants import KEYWORDS, CLEANING_KEYS

def process_image(file_content: bytes):
    # Preprocess the image to get contours
    print("Preprocessing image...")
    image, contours = preprocess_image(file_content)
    print("Image preprocessed.")
    
    # Extract text from the contours
    ocr_lines = extract_text_from_contours(image, contours)
    print("Text extracted from image.")
    
    # Clean and match the extracted text with known stats
    cleaned_text = clean_text(ocr_lines, KEYWORDS)
    print("Text cleaned and matched with known stats.")
    
    # Find keywords in the cleaned text
    found_keywords = find_keywords_in_text(cleaned_text)
    print("Keywords found in text.")
    
    return found_keywords

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
        
        # Search for all words in this text segment
        for word in KEYWORDS:
            pattern = re.escape(word) + r'\s*(\d+(?:\.\d+)?%?)'
            # Find all matches in this text segment
            found_matches = re.findall(pattern, clean_text, re.IGNORECASE)
            for match in found_matches:
                matches.append(f"{word} {match}")  # Combine the word with its value