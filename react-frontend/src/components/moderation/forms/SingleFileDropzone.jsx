import { useState } from "react";
import { Box } from "@mui/material";
import CustomDropzone from "../../ArtifactAdd/CustomDropzone";

/**
 * A wrapper around CustomDropzone that restricts selection to a single file
 * while maintaining the same interface as the original component.
 * 
 * @param {Object} props
 * @param {Function} props.onFilesSelected - Callback when files are selected (receives array with max 1 file)
 * @param {number} props.width - Width of the dropzone (default: 200)
 * @param {number} props.height - Height of the dropzone (default: 280)
 * @param {number} props.key - Key for forcing re-render
 */
function SingleFileDropzone({ 
    onFilesSelected, 
    width = 200, 
    height = 280, 
    ...props 
}) {
    const handleInternalFilesSelected = (files) => {
        if (files && files.length > 0) {
            // Only pass the first file to maintain single file behavior
            onFilesSelected([files[0]]);
        } else {
            onFilesSelected([]);
        }
    };

    return (
        <Box 
            sx={{ 
                width, 
                height, 
                mx: 'auto',
                '& > div': {
                    height: '100%',
                    minHeight: height
                }
            }}
        >
            <CustomDropzone 
                {...props}
                onFilesSelected={handleInternalFilesSelected} 
            />
        </Box>
    );
}

export default SingleFileDropzone;
