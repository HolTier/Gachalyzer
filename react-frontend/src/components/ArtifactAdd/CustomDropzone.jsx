import { useState, useRef, useEffect } from "react";
import { Box, Typography, Paper, List, ListItem, Avatar, IconButton, Chip } from '@mui/material';
import { CloudUpload, Close, Image } from '@mui/icons-material';

function CustomDropzone({ onFilesSelected }) {
    const [files, setFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    }

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragOver(false);
    }

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        const selectedFiles = Array.from(event.dataTransfer.files);
        addFiles(selectedFiles);
    }

    const handleFileSelect = (event) => {
        if (!event.target.files) {
            console.error("No files found on event.target");
            return;
        }
        const selectedFiles = Array.from(event.target.files);
        addFiles(selectedFiles);
    }

    const handleClick = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }

    const handleRemove = (indexToRemove) => {
        if (files[indexToRemove].preview)
            URL.revokeObjectURL(files[indexToRemove].preview);

        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        if (onFilesSelected) onFilesSelected(updatedFiles.map(f => f.file));
    };

    const isFileAlreadyAdded = (file) => {
        return files.some(
            existingFile => 
                existingFile.file.name === file.name && 
                existingFile.file.size === file.size && 
                existingFile.file.lastModified === file.lastModified
        );
    };

    const addFiles = (selectedFiles) => {
        const newFiles = selectedFiles
            .filter(file => !isFileAlreadyAdded(file))
            .map(file => ({
                file,
                preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
                id: `${file.name}-${file.lastModified}-${file.size}`
            }));
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        if (onFilesSelected) onFilesSelected(updatedFiles.map(f => f.file));
    }

    useEffect(() => {
        return () => {
            files.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
        };
    }, []);

    return (
        <Box sx={{ mb: 3 }}>
            <Paper
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragOver ? 'primary.main' : 'divider',
                    borderRadius: 3,
                    padding: 4,
                    textAlign: 'center',
                    backgroundColor: isDragOver ? 'primary.50' : 'background.paper',
                    color: 'text.primary',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: isDragOver ? '0 8px 16px -4px rgba(0, 0, 0, 0.1)' : '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
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
                    id="fileInput"
                    ref={fileInputRef}
                    multiple
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                <Box sx={{ mb: 2 }}>
                    <CloudUpload 
                        sx={{ 
                            fontSize: 48, 
                            color: isDragOver ? 'primary.main' : 'text.secondary',
                            transition: 'color 0.2s ease-in-out',
                        }} 
                    />
                </Box>

                <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 600,
                        color: isDragOver ? 'primary.main' : 'text.primary',
                        transition: 'color 0.2s ease-in-out',
                    }}
                >
                    {isDragOver ? 'Drop files here' : 'Upload Images'}
                </Typography>

                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: 'text.secondary',
                        mb: 2,
                    }}
                >
                    Drag and drop your artifact images here, or click to browse
                </Typography>

                {files.length > 0 && (
                    <Chip 
                        label={`${files.length} file${files.length > 1 ? 's' : ''} selected`}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                    />
                )}
            </Paper>

            {files.length > 0 && (
                <Box sx={{ mt: 2, p: 0, m: 0, width: '100%' }}>
                    <Typography 
                        variant="subtitle2" 
                        sx={{ 
                            mb: 1.5,
                            fontWeight: 600,
                            color: 'text.primary',
                        }}
                    >
                        Selected Images ({files.length})
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            p: 0,
                            m: 0,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        {files.map((f, index) => (
                            <Paper
                                key={f.id}
                                elevation={1}
                                sx={{
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        boxShadow: 2,
                                    },
                                    m: 0,
                                    p: 0,
                                    minWidth: 100,
                                    maxWidth: 100,
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    {f.preview ? (
                                        <Avatar 
                                            variant="square"
                                            src={f.preview}
                                            alt={f.file.name}
                                            onDragStart={(e) => e.preventDefault()}
                                            sx={{ 
                                                width: 80, 
                                                height: 80,
                                                borderRadius: 0,
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'grey.100',
                                            }}
                                        >
                                            <Image sx={{ fontSize: 32, color: 'grey.400' }} />
                                        </Box>
                                    )}
                                    
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(index);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'error.main',
                                            color: 'white',
                                            width: 24,
                                            height: 24,
                                            '&:hover': { 
                                                backgroundColor: 'error.dark',
                                                transform: 'scale(1.1)',
                                            },
                                            boxShadow: 1,
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                    >
                                        <Close sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Box>
                                
                                <Box sx={{ p: 1, backgroundColor: 'background.paper' }}>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 500,
                                            color: 'text.primary',
                                        }}
                                        title={f.file.name}
                                    >
                                        {f.file.name}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: 'text.secondary',
                                            fontSize: '0.7rem',
                                        }}
                                    >
                                        {(f.file.size / 1024).toFixed(1)} KB
                                    </Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
    
}

export default CustomDropzone;