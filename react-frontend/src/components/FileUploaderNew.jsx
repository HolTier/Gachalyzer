import React, { useState, createContext, useEffect } from "react";
import { Box, Button } from "@mui/material";
import CustomDropzone from "./CustomDropzone";
import ArtifactCardBox from "./ArtifactCardBox";


const ApiGameContext = createContext();

function FileUploaderNew() {
    const [files, setFiles] = useState();
    const [ocrResponse, setOcrResponse] = useState([]);
    const [apiGames, setApiGames] = useState(null);

    useEffect(() => {
        const cached = localStorage.getItem("api-game-data");
        if (cached) {
            setApiGames(JSON.parse(cached))
        } else {
            fetch("http://127.0.0.1:8080/api/InitData/init-game-stats")
                .then(res => res.json())
                .then(json => {
                    localStorage.setItem("api-game-data", JSON.stringify(json));
                    setApiGames(json);
                })
                .catch(error => console.error(error));
        }
    }, [])

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
            <ApiGameContext.Provider value={apiGames} >
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
                                sx={{ 
                                    display: 'flex',
                                    p: 1,
                                    minWidth: 0
                                }}
                            >
                                <ArtifactCardBox stats={fs.stats} sx={{ flex: 1 }} />
                            </Box>
                        ))}
                    </Box>
                )}
            </ApiGameContext.Provider>
        </Box>
    );
}

export default FileUploaderNew;