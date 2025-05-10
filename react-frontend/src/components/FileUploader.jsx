import React, { useState } from 'react';

function FileUploader() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpload = async (event) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://api:8080/api/ocr', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
    
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {response && (
                <div>
                    <h3>Response:</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default FileUploader;