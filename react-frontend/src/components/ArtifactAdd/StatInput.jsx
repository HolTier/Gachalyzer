import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import NumbersIcon from "@mui/icons-material/Numbers";

function StatInput({ value, isPercentage, onChangeValue, onTogglePercentage }) {
    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            minWidth: 'fit-content',
        }}>
            <TextField
                variant="standard"
                type="number"
                hiddenLabel
                size="small"
                value={parseFloat(value)}
                onChange={(e) => onChangeValue(e.target.value)}
                sx={{ 
                    width: 90,
                    "& input": {
                        textAlign: "right",
                        color: 'text.primary',
                        backgroundColor: 'transparent',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        padding: '4px 8px',
                    },
                    '& .MuiInput-root': {
                        '&:before': {
                            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        },
                        '&:after': {
                            borderBottom: '2px solid',
                            borderBottomColor: 'primary.main',
                        },
                        '&:hover:not(.Mui-disabled):before': {
                            borderBottom: '2px solid rgba(0, 0, 0, 0.2)',
                        },
                    },
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                    },
                    '& input[type=number]': {
                        MozAppearance: 'textfield'
                    },
                }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={() => onTogglePercentage()} 
                                    size="small"
                                    sx={{ 
                                        color: isPercentage ? 'primary.main' : 'text.secondary', 
                                        '&:hover': { 
                                            color: 'primary.main',
                                            backgroundColor: 'action.hover',
                                        },
                                        p: '4px',
                                        transition: 'all 0.2s ease-in-out',
                                    }}>
                                    {isPercentage ? <PercentIcon fontSize="small" /> : <NumbersIcon fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            />
        </Box>
    );
}

export default StatInput;