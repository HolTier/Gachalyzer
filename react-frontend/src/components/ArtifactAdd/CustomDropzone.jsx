import { useState, useRef, useEffect } from "react";
import { Box, Typography, Paper, List, ListItem, Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CustomDropzone({ onFilesSelected }) {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleDrop = (event) => {
        event.preventDefault();
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
        // Revoke the URL
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
        <Paper
            sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                padding: 4,
                textAlign: 'center',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                cursor: 'pointer',
                boxShadow: 3,
                transition: 'background 0.2s',
                '&:hover': {
                    backgroundColor: 'background.default',
                },
            }}
        >
            <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                multiple
                hidden
                onChange={handleFileSelect}
            />

            <Typography variant="body1" gutterBottom>
                DROP HERE
            </Typography>

            {files.length > 0 && (
                <List
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: 0,
                        overflowX: 'auto'
                    }}
                >
                    {files.map((f, index) => (
                        <ListItem key={f.id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginRight: 2,
                                backgroundColor: 'transparent',
                                color: 'text.primary',
                            }}
                        >
                            <Box sx={{
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                {f.preview && (
                                    <Avatar 
                                        variant="square"
                                        src = {f.preview}
                                        alt= {f.file.name}
                                        onDragStart={(e) => e.preventDefault()}
                                        sx={{ width: 64, height: 64, mb: 1 }}
                                    />
                                )}
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(index);
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        backgroundColor: 'background.paper',
                                        color: 'text.primary',
                                        zIndex: 1,
                                        '&:hover': { backgroundColor: 'primary.dark' },
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: 10}}></CloseIcon>
                                </IconButton>
                            </Box>
                            <Typography variant="caption">{f.file.name}</Typography>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
    
}

export default CustomDropzone;