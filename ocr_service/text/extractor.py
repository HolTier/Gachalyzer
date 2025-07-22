import cv2
import pytesseract
import numpy as np
from typing import List


def extract_text_from_contours(image: np.ndarray, contours: List) -> List[str]:
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
