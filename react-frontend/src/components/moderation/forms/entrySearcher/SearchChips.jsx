import React from 'react';
import {
    Box,
    Typography,
    Chip
} from '@mui/material';
import { formStyles } from '../formStyles';

function SearchChips({
    processedData,
    data,
    searchTerm,
    searchTerms,
    searchField,
    filterValues,
    filterOptions,
    headers,
    onRemoveSearchTerm,
    onRemoveFilter,
    onClearSearch,
    onClearFilter
}) {
    if (searchTerm || searchTerms.length > 0 || filterValues.length > 0) {
        return (
            <Box {...formStyles.resultsHeader}>
                <Typography {...formStyles.resultsCounter}>
                    {processedData.length === data.length
                        ? `${data.length} entries`
                        : `${processedData.length} of ${data.length} entries`
                    }
                </Typography>
                <Box {...formStyles.activeFilters}>
                    {searchTerm && (
                        <Chip 
                            size="small" 
                            label={`Searching in ${searchField === 'all' ? 'All Fields' : headers.find(h => h.key === searchField)?.label || searchField}: "${searchTerm}"`} 
                            color="primary"
                            variant="filled"
                            sx={{ opacity: 0.7 }}
                        />
                    )}
                    {searchTerms.map((term) => (
                        <Chip 
                            key={term}
                            size="small" 
                            label={`Search in ${searchField === 'all' ? 'All Fields' : headers.find(h => h.key === searchField)?.label || searchField}: "${term}"`} 
                            onDelete={() => onRemoveSearchTerm(term)}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                    {filterValues.map((filterValue) => (
                        <Chip 
                            key={filterValue}
                            size="small" 
                            label={filterOptions.find(f => f.value === filterValue)?.label || filterValue}
                            onDelete={() => onRemoveFilter(filterValue)}
                            color="secondary"
                            variant="outlined"
                        />
                    ))}
                    {(searchTerms.length > 1 || filterValues.length > 1) && (
                        <Chip 
                            size="small" 
                            label={searchTerms.length > 1 && filterValues.length > 1 ? "Clear all" : 
                                   searchTerms.length > 1 ? "Clear all searches" : "Clear all filters"}
                            onClick={searchTerms.length > 1 && filterValues.length > 1 ? 
                                    () => { onClearSearch(); onClearFilter(); } :
                                    searchTerms.length > 1 ? onClearSearch : onClearFilter}
                            color="error"
                            variant="outlined"
                            sx={{ cursor: 'pointer' }}
                        />
                    )}
                </Box>
            </Box>
        );
    }

    return (
        <Box {...formStyles.resultsHeader}>
            <Typography {...formStyles.resultsCounter}>
                {processedData.length === data.length
                    ? `${data.length} entries`
                    : `${processedData.length} of ${data.length} entries`
                }
            </Typography>
        </Box>
    );
}

export default SearchChips;
