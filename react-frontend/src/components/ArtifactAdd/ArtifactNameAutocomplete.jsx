import { Autocomplete, TextField, Box, Tooltip } from "@mui/material";

function ArtifactNameAutocomplete({ apiArtifactData, value, onChangeValue }) {
    const selectedOption = value ? apiArtifactData?.find(opt => opt.name === value) || { name: value } : null;

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
                options={apiArtifactData || []}
                getOptionLabel={(option) => option?.name || ""}
                size="small"
                sx={{
                    width: '100%',
                    '& .MuiAutocomplete-inputRoot': {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'text.primary',
                        backgroundColor: 'transparent',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': {
                            borderColor: 'primary.main',
                        },
                        '&.Mui-focused': {
                            borderColor: 'primary.main',
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '& .MuiAutocomplete-input': {
                        padding: '8px 12px !important',
                        minHeight: 'auto',
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Select artifact name..."
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

export default ArtifactNameAutocomplete;
