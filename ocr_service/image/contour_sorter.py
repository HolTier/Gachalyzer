import cv2
from typing import List

def sort_contours(contours: List) -> List:
    if not contours:
        return contours
        
    # Get bounding boxes and sort from top to bottom
    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    (contours, bounding_boxes) = zip(*sorted(zip(contours, bounding_boxes),
                                            key=lambda b: (b[1][1] // 40, b[1][0])))  # Group by rows (40 is line height threshold)
    return list(contours)
