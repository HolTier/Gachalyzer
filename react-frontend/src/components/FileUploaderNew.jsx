import React, { useState, useCallback, Component } from "react";
import { Box, Button } from "@mui/material";
import CustomDropzone from "./CustomDropzone";

function FileUploaderNew() {
    const [files, setFiles] = useState();

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
                
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box>
            <CustomDropzone onFilesSelected = {(f) => setFiles(f)}/>
            <Button variant="contained" onClick={handleOcrRequest}>Upload</Button>
        </Box>
    );
}

export default FileUploaderNew;