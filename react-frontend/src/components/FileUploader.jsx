import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, Paper, Backdrop, CircularProgress } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import StatPreviewBox from './StatPreviewBox';
import StatBox from './StatBox';
import { useInitWuwa } from '../hooks/useInitWuwa';

function FileUploader() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [responseConfirmed, setResponseConfirmed] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { dataWuwa, loadingWuwa } = useInitWuwa();

    const handleDialogClose = () =>{
        setDialogOpen(false);
        setResponseConfirmed(true);
    }
    const handleDialogOpen = () => setDialogOpen(true);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpload = async (event) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setError(null);
        setResponse(null);
        setResponseConfirmed(false);
        setDialogOpen(false);
   
        try {
            const res = await fetch('http://127.0.0.1:8080/api/ocr', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setResponse(data);
            setDialogOpen(true);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Error uploading file');
        } finally {
            setLoading(false);
            console.log(dataWuwa);
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

    if (loadingWuwa) return <div>Loading...</div>

    return (
        <Box sx={{ p: 4 }}>
            <Backdrop open={loading} sx={{ zIndex: 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
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
                        Choose File
                    </Button>
                </label>
            </Paper>

            <Button variant="contained" onClick={handleUpload} disabled={!file}>
                Upload
            </Button>
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            {response && (
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>OCR Result</DialogTitle>
                    <DialogContent>
                        <StatPreviewBox data={response} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}

            {responseConfirmed && (
                <Box sx={{ mt: 2 }}>
                    <StatBox data={response} dataWuwa={dataWuwa} />
                </Box>
            )}
        </Box>
    );
}

export default FileUploader;