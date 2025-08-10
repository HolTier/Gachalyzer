import { Box } from "@mui/material";
import CharacterForm from "./forms/character/CharacterForm";


function CharacterEditor() {    
    return (
        <Box sx={{ p: 2 }}>
            <CharacterForm />
        </Box>
    )
}

export default CharacterEditor;