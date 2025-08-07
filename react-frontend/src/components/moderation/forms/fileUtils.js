/**
 * Utility functions for file handling in forms
 */

/**
 * Opens a file picker and returns the selected file
 * @param {Object} options - Configuration options
 * @param {string} options.accept - File types to accept (default: 'image/*')
 * @param {boolean} options.multiple - Allow multiple file selection (default: false)
 * @returns {Promise<File|null>} Promise that resolves to the selected file or null if cancelled
 */
export const openFilePicker = (options = {}) => {
    const { accept = 'image/*', multiple = false } = options;
    
    return new Promise((resolve) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = accept;
        fileInput.multiple = multiple;
        fileInput.style.display = 'none';
        
        fileInput.onchange = (event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                resolve(multiple ? Array.from(files) : files[0]);
            } else {
                resolve(null);
            }
            document.body.removeChild(fileInput);
        };
        
        fileInput.oncancel = () => {
            resolve(null);
            document.body.removeChild(fileInput);
        };
        
        document.body.appendChild(fileInput);
        fileInput.click();
    });
};

/**
 * Creates a file handler for react-hook-form integration
 * @param {Function} setValue - react-hook-form setValue function
 * @param {string} fieldName - The form field name to update
 * @param {Function} setKey - Optional function to update a key for component re-rendering
 * @returns {Object} Object with file handling functions
 */
export const createFileHandlers = (setValue, fieldName = 'image', setKey = null) => {
    const handleFilesSelected = (files) => {
        if (files && files.length > 0) {
            const singleFile = files[0];
            setValue(fieldName, singleFile, { shouldValidate: true });
        } else {
            setValue(fieldName, null, { shouldValidate: true });
        }
    };

    const handleClearFile = () => {
        setValue(fieldName, null, { shouldValidate: true });
        if (setKey) {
            setKey(prev => prev + 1);
        }
    };

    const handleReplaceFile = async () => {
        try {
            const selectedFile = await openFilePicker();
            if (selectedFile) {
                setValue(fieldName, selectedFile, { shouldValidate: true });
            }
        } catch (error) {
            console.error('Error selecting file:', error);
        }
    };

    return {
        handleFilesSelected,
        handleClearFile,
        handleReplaceFile
    };
};

/**
 * Creates icon-specific file handlers with smaller size validation
 * @param {Function} setValue - react-hook-form setValue function
 * @param {string} fieldName - The form field name to update (default: 'icon')
 * @param {Function} setKey - Optional function to update a key for component re-rendering
 * @returns {Object} Object with file handling functions
 */
export const createIconHandlers = (setValue, fieldName = 'icon', setKey = null) => {
    return createFileHandlers(setValue, fieldName, setKey);
};

/**
 * Validates if a file meets specific criteria
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSize - Maximum file size in bytes
 * @param {string[]} options.allowedTypes - Array of allowed MIME types
 * @returns {Object} Validation result with isValid boolean and error message
 */
export const validateFile = (file, options = {}) => {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] } = options;
    
    if (!file) {
        return { isValid: true, error: null };
    }

    if (file.size > maxSize) {
        return { 
            isValid: false, 
            error: `File size is too large (max ${(maxSize / 1024 / 1024).toFixed(1)}MB)` 
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return { 
            isValid: false, 
            error: 'Unsupported file type' 
        };
    }

    return { isValid: true, error: null };
};

/**
 * Formats file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
