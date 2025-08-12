import React from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
    IconButton,
    Tooltip,
    Button
} from '@mui/material';
import {
    Search,
    FilterList,
    Clear,
    Add
} from '@mui/icons-material';
import { formStyles } from '../formStyles';

function SearchControls({
    searchTerm,
    searchField,
    filterOptions,
    filterValues,
    headers,
    searchPlaceholder,
    onSearchChange,
    onSearchFieldChange,
    onSearchKeyPress,
    onAddSearchTerm,
    onClearSearch,
    onFilterDialogOpen
}) {
    return (
        <Box {...formStyles.searchContainer}>
            <FormControl {...formStyles.searchField}>
                <TextField
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={onSearchChange}
                    onKeyPress={onSearchKeyPress}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {searchTerm.trim() && (
                                    <Tooltip title="Add search term">
                                        <IconButton
                                            size="small"
                                            onClick={onAddSearchTerm}
                                            edge="end"
                                            sx={{ mr: searchTerm ? 0.5 : 0 }}
                                        >
                                            <Add />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {(searchTerm || filterValues.length > 0) && (
                                    <Tooltip title="Clear all search">
                                        <IconButton
                                            size="small"
                                            onClick={onClearSearch}
                                            edge="end"
                                        >
                                            <Clear />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </InputAdornment>
                        )
                    }}
                />
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel size="small">Search In</InputLabel>
                <Select
                    value={searchField}
                    onChange={onSearchFieldChange}
                    label="Search In"
                    size="small"
                >
                    <MenuItem value="all">All Fields</MenuItem>
                    {headers
                        .filter(header => header.type !== 'image') // Exclude image fields from search
                        .map((header) => (
                            <MenuItem key={header.key} value={header.key}>
                                {header.label}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            {filterOptions.length > 0 && (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onFilterDialogOpen}
                    startIcon={<FilterList />}
                    sx={{ 
                        minWidth: 120,
                        height: 40
                    }}
                >
                    Filters {filterValues.length > 0 && `(${filterValues.length})`}
                </Button>
            )}
        </Box>
    );
}

export default SearchControls;
