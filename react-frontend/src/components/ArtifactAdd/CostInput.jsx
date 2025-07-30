import { Box, TextField } from "@mui/material";

function CostInput({ costValue, setCostValue }) {
    const isEmpty = !costValue || costValue.trim() === '';
    
    return (
        <Box
            sx={{
                // Prevent dragging
                userSelect: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'auto',
            }}
        >
            <TextField
                label="Cost"
                value={costValue || ''}
                onChange={(e) => setCostValue(e.target.value)}
                variant="outlined"
                fullWidth
                type="number"
                placeholder="Enter cost"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        color: 'text.primary',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: 'none',
                        borderRadius: 2,
                        padding: '0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            outline: '1px solid rgba(144, 202, 249, 0.3)',
                        },
                        '& fieldset': {
                            border: 'none',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '0.85rem',
                        fontWeight: 400,
                        color: 'text.secondary',
                        transform: 'translate(16px, 12px) scale(1)',
                        '&.Mui-focused, &.MuiFormLabel-filled': {
                            transform: 'translate(16px, -9px) scale(0.75)',
                            color: 'primary.main',
                        },
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '12px 16px',
                        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                        },
                        '&[type=number]': {
                            MozAppearance: 'textfield',
                        },
                    },
                }}
            />
        </Box>
    );
}

export default CostInput;
