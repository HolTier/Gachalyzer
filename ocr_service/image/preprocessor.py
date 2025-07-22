import cv2
import numpy as np
from typing import Tuple, List
from .contour_sorter import sort_contours


def preprocess_image(file_content: bytes) -> Tuple[np.ndarray, List]:
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
