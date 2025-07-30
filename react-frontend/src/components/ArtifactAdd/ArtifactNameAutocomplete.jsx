import { Autocomplete, TextField, Box, Tooltip } from "@mui/material";

function ArtifactNameAutocomplete({ apiArtifactData, value, onChangeValue }) {
    const selectedOption = value ? apiArtifactData?.find(opt => opt.name === value) || { name: value } : null;

    return (
        <Box
            sx={{
                // Prevent dragging
                userSelect: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'auto',
            }}
        >
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
                    options={apiArtifactData || []}
                    getOptionLabel={(option) => option?.name || ""}
                    size="small"
                    sx={{
                        width: '100%',
                        mb: 1.5,
                        '& .MuiAutocomplete-inputRoot': {
                            fontSize: '0.9rem',
                            fontWeight: 400,
                            color: 'text.primary',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: 'none',
                            borderRadius: 2,
                            padding: '12px 16px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            },
                            '&.Mui-focused': {
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                outline: '1px solid rgba(144, 202, 249, 0.3)',
                            },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '& .MuiAutocomplete-input': {
                            padding: '0 !important',
                            minHeight: 'auto',
                        },
                        '& .MuiAutocomplete-endAdornment': {
                            right: '8px',
                            '& .MuiSvgIcon-root': {
                                color: 'text.secondary',
                                fontSize: '1.25rem',
                            },
                        },
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Artifact name"
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
                                padding: '12px 16px',
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                '&:hover': {
                                    backgroundColor: 'rgba(144, 202, 249, 0.08)',
                                },
                            }}
                        >
                            {option.name}
                        </Box>
                    )}
                    isOptionEqualToValue={(option, value) => option?.name === value?.name}
                />
            </Tooltip>
        </Box>
    );
}

export default ArtifactNameAutocomplete;
