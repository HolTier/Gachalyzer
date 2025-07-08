import React, { useState, createContext, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import CustomDropzone from "../components/ArtifactAdd/CustomDropzone";
import ArtifactCardBoxTmp from "../components/ArtifactAdd/ArtifactCardBoxTmp";
import { useApiGameData } from "../hooks/useApiGameData";

function ArtifactAddPage() {
    const [files, setFiles] = useState();
    const [ocrResponse, setOcrResponse] = useState([]);
    const { data: apiGames, loading } = useApiGameData();

    useEffect(() => {
        console.log("APIDATA: " + {apiGames});
    })

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
                    <Grid container spacing={2}>
                        {ocrResponse.map((fs, index) => (
                            <Grid key={index}>
                                <ArtifactCardBoxTmp stats={fs.stats} apiGameData={apiGames} sx={{ flex: 1 }} />
                            </Grid>
                        ))}
                    </Grid>
                )}
        </Box>
    );
}

export default ArtifactAddPage;