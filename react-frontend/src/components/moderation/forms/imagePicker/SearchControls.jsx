import React from 'react';
import {
    TextField,
    Box,
    Button,
    InputAdornment,
    IconButton,
    Autocomplete,
    Chip
} from '@mui/material';
import {
    Search as SearchIcon,
    Close as CloseIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { formStyles } from '../formStyles';

export function SearchControls({
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    availableTags,
    searchPlaceholder
}) {
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTagsChange = (event, newValue) => {
        setSelectedTags(newValue);
    };

    return (
        <Box sx={{ mb: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', pt: 1 }}>
                <TextField
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    {...formStyles.formControl}
                    sx={{ flex: 1, minWidth: 250, mb: 0 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                
                <Autocomplete
                    multiple
                    options={availableTags}
                    value={selectedTags}
                    onChange={handleTagsChange}
                    sx={{ minWidth: 200, mb: 0 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Filter by tags"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                    renderTags={() => null}
                />
            </Box>
        </Box>
    );
}
