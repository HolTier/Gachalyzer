import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import NumbersIcon from "@mui/icons-material/Numbers";

function StatInput({ value, isPercentage, onChangeValue, onTogglePercentage }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
                variant="standard"
                type="number"
                hiddenLabel
                value={parseFloat(value)}
                onChange={(e) => onChangeValue(e.target.value)}
                sx={{ 
                    width: 100,
                     "& input": {
                        textAlign: "right", // <-- target input for right alignment
                    },
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'none'
                    ,
                    '& input[type=number]': {
                        MozAppearance: 'textfield'
                    },
                    }
                }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={onTogglePercentage} size="small">
                                    {isPercentage ? <PercentIcon /> : <NumbersIcon />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            
            >
            </TextField>
        </Box>
    );
}

export default StatInput;