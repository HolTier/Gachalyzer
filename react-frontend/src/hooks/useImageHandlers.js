import { useState } from 'react';
import { openFilePicker } from '../components/moderation/forms/fileUtils';

export const useImageHandlers = (mode, setValue, fieldName, setUploadedImage, setServerImage, setPickerOpen) => {
    const handleFilesSelected = (files) => {
        if (files && files.length > 0) {
            const singleFile = files[0];
            setUploadedImage(singleFile);
            setValue(fieldName, singleFile, { shouldValidate: true });
        } else {
            setUploadedImage(null);
            setValue(fieldName, null, { shouldValidate: true });
        }
    };

    const handleClearFile = () => {
        if (mode === 'upload') {
            setUploadedImage(null);
        } else {
            setServerImage(null);
        }
        setValue(fieldName, null, { shouldValidate: true });
    };

    const handleReplaceFile = async () => {
        try {
            const selectedFile = await openFilePicker();
            if (selectedFile) {
                setUploadedImage(selectedFile);
                setValue(fieldName, selectedFile, { shouldValidate: true });
            }
        } catch (error) {
            console.error('Error selecting file:', error);
        }
    };

    const handleImageFromServer = (serverImage) => {
        const imageFile = {
            name: serverImage.name,
            url: serverImage.url,
            isServerImage: true,
            serverId: serverImage.id,
            type: "server/image" 
        };
        setServerImage(imageFile);
        setValue(fieldName, imageFile);
        setPickerOpen(false);
    };

    return {
        handleFilesSelected,
        handleClearFile,
        handleReplaceFile,
        handleImageFromServer
    };
};
