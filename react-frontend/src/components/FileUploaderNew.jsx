import React, { useState, useCallback, Component } from "react";
import { Box, Button, Card, CardContent, Typography, Divider } from "@mui/material";
import CustomDropzone from "./CustomDropzone";
import ArtifactCardBox from "./ArtifactCardBox";

function FileUploaderNew() {
    const [files, setFiles] = useState();
    const [ocrResponse, setOcrResponse] = useState([]);

    const handleOcrRequest = async (event) => {
        console.log(files);
        if(!files) return;

        const formData = new FormData();

        if (Array.isArray(files)) {
            files.forEach(file => formData.append("files", file));
        } else {
            formData.append("files", files);
        }

        try {
            const response = await fetch("http://127.0.0.1:8080/api/Ocr/upload-multiple", {
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
        }
    }

    return (
        <Box>
            <CustomDropzone onFilesSelected = {(f) => setFiles(f)}/>
            <Button variant="contained" onClick={handleOcrRequest}>Upload</Button>
            {ocrResponse.length > 0 && (
                <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2",
                    alignItems: "stretch"
                }}>
                    {ocrResponse.map((fs, index) => (
                        <Box key={index} 
                            flexBasis={{ xs: '48%', sm: '30%', md: '23%', lg: '15%' }}
                            sx={{ display: 'flex' }}
                        >
                            <ArtifactCardBox stats={fs.stats} sx={{ flex: 1 }} />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default FileUploaderNew;