import { Box } from "@mui/material";
import CharacterForm from "./forms/CharacterForm";


function CharacterEditor() {
    console.log("CharacterEditor rendering...");
    
    return (
        <Box sx={{ p: 2 }}>
            <CharacterForm />
        </Box>
    )
}

export default CharacterEditor;