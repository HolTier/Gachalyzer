import numpy as np
from typing import Any


def validate_image_input(image: Any) -> bool:
    if image is None:
        return False
        
    if isinstance(image, np.ndarray):
        return len(image.shape) >= 2
        
    return False


def validate_file_content(file_content: bytes) -> bool:
    if not isinstance(file_content, bytes):
        return False
        
    if len(file_content) == 0:
        return False
        
    return True
