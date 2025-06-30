import React, { useState, useCallback, Component } from "react";
import { Box } from "@mui/material";
import CustomDropzone from "./CustomDropzone";

function FileUploaderNew() {

    return (
        <CustomDropzone onFilesSelected = {(files) => console.log(files)}/>
    );
}

export default FileUploaderNew;