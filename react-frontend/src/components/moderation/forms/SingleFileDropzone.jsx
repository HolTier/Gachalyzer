import { useState, useRef } from "react";
import { Box, Typography, Paper, Avatar, IconButton } from "@mui/material";
import { CloudUpload, Close, Image } from "@mui/icons-material";

function SingleFileDropzone({ 
    onFilesSelected, 
    width = 200, 
    height = 280,
    isIcon = false,
    label,
    description,
    ...props 
}) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
    
    const dropzoneWidth = isIcon ? 120 : width;
    const dropzoneHeight = isIcon ? 120 : height;
    const iconSize = isIcon ? 32 : 48;
    
    const defaultLabel = isIcon ? 'Upload Icon' : 'Upload Image';
    const defaultDescription = isIcon 
        ? 'Drag and drop your icon here, or click to browse'
        : 'Drag and drop your image here, or click to browse';

    const handleInternalFilesSelected = (files) => {
        if (files && files.length > 0) {
            onFilesSelected([files[0]]);
        } else {
            onFilesSelected([]);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        const selectedFiles = Array.from(event.dataTransfer.files);
        if (selectedFiles.length > 0) {
            handleInternalFilesSelected([selectedFiles[0]]);
        }
    };

    const handleFileSelect = (event) => {
        if (!event.target.files) {
            console.error("No files found on event.target");
            return;
        }
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length > 0) {
            handleInternalFilesSelected([selectedFiles[0]]);
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
            fileInputRef.current.click();
        }
    };

    return (
        <Box 
            sx={{ 
                width: dropzoneWidth, 
                height: dropzoneHeight, 
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Paper
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragOver ? 'primary.main' : 'divider',
                    borderRadius: isIcon ? '50%' : 3,
                    padding: isIcon ? 2 : 4,
                    textAlign: 'center',
                    backgroundColor: isDragOver ? 'primary.50' : 'background.paper',
                    color: 'text.primary',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: isDragOver ? '0 8px 16px -4px rgba(0, 0, 0, 0.1)' : '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'primary.50',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                <Box sx={{ mb: isIcon ? 1 : 2 }}>
                    <CloudUpload 
                        sx={{ 
                            fontSize: iconSize, 
                            color: isDragOver ? 'primary.main' : 'text.secondary',
                            transition: 'color 0.2s ease-in-out',
                        }} 
                    />
                </Box>

                <Typography 
                    variant={isIcon ? "body2" : "h6"}
                    gutterBottom={!isIcon}
                    sx={{ 
                        fontWeight: 600,
                        color: isDragOver ? 'primary.main' : 'text.primary',
                        transition: 'color 0.2s ease-in-out',
                        fontSize: isIcon ? '0.75rem' : undefined,
                        lineHeight: isIcon ? 1.2 : undefined,
                    }}
                >
                    {isDragOver ? 'Drop file here' : (label || defaultLabel)}
                </Typography>

                {!isIcon && (
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            px: 1,
                        }}
                    >
                        {description || defaultDescription}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}

export default SingleFileDropzone;
