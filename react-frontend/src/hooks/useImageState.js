import { useState, useEffect, useRef } from 'react';

export const useImageState = (selectedImage, mode, setValue, fieldName) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [serverImage, setServerImage] = useState(null);
    const initializedRef = useRef(false);
    const lastSetValueRef = useRef(null);

    useEffect(() => {
        if (selectedImage && !initializedRef.current) {
            if (selectedImage.isServerImage) {
                setServerImage(selectedImage);
            } else {
                setUploadedImage(selectedImage);
            }
            initializedRef.current = true;
            lastSetValueRef.current = selectedImage;
        }
    }, [selectedImage]);

    useEffect(() => {
        const currentImage = mode === 'upload' ? uploadedImage : serverImage;
        
        if (currentImage !== lastSetValueRef.current) {
            setValue(fieldName, currentImage);
            lastSetValueRef.current = currentImage;
        }
    }, [mode, uploadedImage, serverImage, setValue, fieldName]);

    const currentImage = mode === 'upload' ? uploadedImage : serverImage;

    return {
        uploadedImage,
        setUploadedImage,
        serverImage,
        setServerImage,
        currentImage
    };
};
