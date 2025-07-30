import { Box, TextField } from "@mui/material";

function CostInput({ costValue, setCostValue }) {
    const isEmpty = !costValue || costValue.trim() === '';
    
    return (
        <Box>
            <TextField
                label="Cost"
                value={costValue || ''}
                onChange={(e) => setCostValue(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder={isEmpty ? "Cost empty - Enter cost value" : "Enter cost value"}
                helperText={isEmpty ? "No cost data available" : ""}
            />
        </Box>
    );
}

export default CostInput;
