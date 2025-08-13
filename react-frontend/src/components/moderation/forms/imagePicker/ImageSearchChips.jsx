import React from 'react';
import {
    Box,
    Typography,
    Chip
} from '@mui/material';
import { formStyles } from '../formStyles';

export function ImageSearchChips({
    searchTerm,
    selectedTags,
    filteredImages,
    totalImages,
    onClearSearch,
    onRemoveTag,
    selectedImage
}) {
    const hasActiveFilters = searchTerm || selectedTags.length > 0;
    const hasMultipleFilters = (searchTerm ? 1 : 0) + selectedTags.length > 1;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography {...formStyles.resultsCounter}>
                {filteredImages.length === totalImages
                    ? `${totalImages} image${totalImages !== 1 ? 's' : ''}`
                    : `${filteredImages.length} of ${totalImages} image${totalImages !== 1 ? 's' : ''}`
                }
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                {selectedImage && (
                    <Typography variant="body2" color="primary" sx={{ mr: 1 }}>
                        Selected: {selectedImage.name}
                    </Typography>
                )}
                
                {hasActiveFilters && (
                    <Box {...formStyles.activeFilters}>
                        {searchTerm && (
                            <Chip 
                                size="small" 
                                label={`Search: "${searchTerm}"`} 
                                onDelete={() => onClearSearch()}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {selectedTags.map((tag) => (
                            <Chip 
                                key={tag}
                                size="small" 
                                label={`Tag: ${tag}`}
                                onDelete={() => onRemoveTag(tag)}
                                color="secondary"
                                variant="outlined"
                            />
                        ))}
                        {hasMultipleFilters && (
                            <Chip 
                                size="small" 
                                label="Clear all filters"
                                onClick={onClearSearch}
                                color="error"
                                variant="outlined"
                                sx={{ cursor: 'pointer' }}
                            />
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
