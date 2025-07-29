import React, { useState, createContext, useEffect } from "react";
import { Box, Button, Grid, Container, Typography, Paper, LinearProgress } from "@mui/material";
import { CloudUpload, Analytics } from "@mui/icons-material";
import CustomDropzone from "../components/ArtifactAdd/CustomDropzone";
import ArtifactShowcase from "../components/ArtifactAdd/ArtifactShowcase";
import { useApiGameData } from "../hooks/useApiGameData";
import ArtifactDisplayWrapper from "../components/ArtifactAdd/ArtifactDispalyWrapper";
import { API_CONFIG } from "../config/api";

function ArtifactAddPage() {
    const [files, setFiles] = useState();
    const [ocrResponse, setOcrResponse] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { data: apiGames, loading } = useApiGameData();

    useEffect(() => {
        console.log("APIDATA: " + {apiGames});
    })

    const handleOcrRequest = async (event) => {
        console.log(files);
        if(!files) return;

        setIsUploading(true);
        const formData = new FormData();

        if (Array.isArray(files)) {
            files.forEach(file => formData.append("files", file));
        } else {
            formData.append("files", files);
        }

        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.OCR_UPLOAD_MULTIPLE, {
                method: "POST",
                body: formData
            });
            const contentType = response.headers.get("content-type");
            const data = contentType?.includes("application/json") 
                ? await response.json() 
                : await response.text();

            setOcrResponse(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1,
                    }}
                >
                    Artifact Analysis
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'text.secondary',
                        mb: 3,
                    }}
                >
                    Upload your artifact images to automatically extract and analyze their statistics
                </Typography>
            </Box>

            <CustomDropzone onFilesSelected={(f) => setFiles(f)} />
            
            {files && files.length > 0 && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Button 
                        variant="contained" 
                        onClick={handleOcrRequest}
                        disabled={isUploading}
                        startIcon={isUploading ? null : <Analytics />}
                        size="large"
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.15)',
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        {isUploading ? 'Analyzing...' : 'Analyze Artifacts'}
                    </Button>
                    
                    {isUploading && (
                        <Box sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                            <LinearProgress 
                                sx={{ 
                                    borderRadius: 1,
                                    height: 6,
                                }} 
                            />
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    display: 'block',
                                    mt: 1,
                                    color: 'text.secondary',
                                }}
                            >
                                Processing your artifacts...
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {ocrResponse.length > 0 && (
                <Box>
                    <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 3,
                        }}
                    >
                        Analysis Results ({ocrResponse.length})
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {ocrResponse.map((fs, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <ArtifactDisplayWrapper 
                                    stats={fs.stats}
                                    artifacts={fs.artifacts}
                                    apiGameData={apiGames}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
}

export default ArtifactAddPage;