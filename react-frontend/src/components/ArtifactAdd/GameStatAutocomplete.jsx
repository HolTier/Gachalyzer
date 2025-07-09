import { Autocomplete, TextField, Box, Tooltip } from "@mui/material";
import { useEffect } from "react";

function GameStatAutocomplete({apiGameData, value, onChangeValue}) {
    const selectedOption = value ? apiGameData?.find(opt => opt.name === value) || { name: value } : null;

    return (
        <Tooltip 
            title={selectedOption?.name || ""} 
            placement="top"
            arrow
            disableHoverListener={!selectedOption?.name || selectedOption.name.length < 20}
        >
            <Autocomplete 
            value={selectedOption}
            onChange={(event, newValue) => onChangeValue(newValue ? newValue.name : "")}
            disablePortal
            disableClearable
            //freeSolo
            options={apiGameData || []}
            getOptionLabel={(option) => option?.name || ""}
            size="small"
            sx={{
                flex: 1,
                minWidth: 0, // Allow shrinking
                '& .MuiAutocomplete-inputRoot': {
                    border: 'none',
                    padding: '0 !important',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'text.primary',
                    backgroundColor: 'transparent',
                },
                '& .MuiOutlinedInput-root': {
                    border: 'none',
                    padding: '0 !important',
                    backgroundColor: 'transparent',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        borderRadius: 1,
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'action.hover',
                        borderRadius: 1,
                    },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                },
                '& .MuiAutocomplete-input': {
                    padding: '4px 8px !important',
                    minHeight: 'auto',
                },
                '& .MuiAutocomplete-endAdornment': {
                    display: 'none', // Hide dropdown arrow and X
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Select stat..."
                    variant="outlined"
                    sx={{
                        '& .MuiInputBase-input': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        },
                    }}
                />
            )}
            renderOption={(props, option) => (
                <Box 
                    component="li" 
                    {...props}
                    sx={{
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                    }}
                >
                    {option.name}
                </Box>
            )}
            isOptionEqualToValue={(option, value) => option?.name === value?.name}
        />
        </Tooltip>
    );
}

export default GameStatAutocomplete;