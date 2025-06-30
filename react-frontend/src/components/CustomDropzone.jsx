import { useState, useRef } from "react";
import { Box, Typography, Paper, List, ListItem } from '@mui/material';

function CustomDropzone({ onFilesSelected }) {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const selectedFiles = Array.from(event.dataTransfer.files);
        const newFiles = [...files, ...selectedFiles];
        setFiles(newFiles);
        if (onFilesSelected) onFilesSelected(newFiles);
    }

    const handleFileSelect = (event) => {
        if (!event.target.files) {
            console.error("No files found on event.target");
            return;
        }
        const selectedFiles = Array.from(event.target.files);
        const newFiles = [...files, ...selectedFiles];
        setFiles(newFiles);
        if (onFilesSelected) onFilesSelected(newFiles);
    }

    const handleClick = () => {
        fileInputRef.current.value = null; // Reset input to allow selecting same files again
        fileInputRef.current.click();
    }

    return (
        <Paper
            onDragOver = {handleDragOver}
            onDrop = {handleDrop}
            onClick = {handleClick}
            sx={{
                border: '2px dashed #888',
                padding: 4,
                textAlign: 'center',
                backgroundColor: '#f8f8f8',
                cursor: 'pointer',
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
                    {files.map((file, index) => (
                        <ListItem key={index}>{file.name}{file.miniature}</ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
    
}

export default CustomDropzone;