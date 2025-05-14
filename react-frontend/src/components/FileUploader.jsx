import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { StatPreviewBox } from './StatPreviewBox'; // Assuming this is the correct path

function FileUploader() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpload = async (event) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://127.0.0.1:8080/api/ocr', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        setIsDragging(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
        }
    }, []);

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = () => {
        setIsDragging(false);
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Upload File</Typography>

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '2px dashed gray',
                    backgroundColor: isDragging ? '#f0f0f0' : 'inherit',
                    mb: 2,
                    cursor: 'pointer',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <Typography>
                    {file ? `Wybrano plik: ${file.name}` : 'Przeciągnij plik tutaj lub kliknij, aby wybrać'}
                </Typography>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="fileInput"
                />
                <label htmlFor="fileInput">
                    <Button variant="outlined" component="span" sx={{ mt: 2 }}>
                        Wybierz plik
                    </Button>
                </label>
            </Paper>

            <Button variant="contained" onClick={handleUpload} disabled={!file}>
                Upload
            </Button>

            {response && (
                <StatPreviewBox data={response} />
            )}
        </Box>
    );
}

export default FileUploader;