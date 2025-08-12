import React from 'react';
import {
    Box,
    Typography
} from '@mui/material';
import {
    ExpandMore,
    ChevronRight
} from '@mui/icons-material';
import { filterDialogStyles } from './styles';

function CategoryHeader({ 
    title, 
    isExpanded, 
    onToggle, 
    selectedCount, 
    totalCount, 
    isSubcategory = false 
}) {
    const headerStyles = isSubcategory 
        ? filterDialogStyles.subcategoryHeader 
        : filterDialogStyles.categoryHeader;
    
    const titleStyles = isSubcategory 
        ? { ...filterDialogStyles.categoryTitle, sx: { fontSize: '0.95rem', fontWeight: 500 } }
        : filterDialogStyles.categoryTitle;

    const iconSize = isSubcategory ? "small" : undefined;

    return (
        <Box 
            {...headerStyles}
            onClick={onToggle}
        >
            {isExpanded ? 
                <ExpandMore fontSize={iconSize} /> : 
                <ChevronRight fontSize={iconSize} />
            }
            <Typography {...titleStyles}>
                {title}
            </Typography>
            <Typography {...filterDialogStyles.categoryCount}>
                {selectedCount} / {totalCount}{isSubcategory ? '' : ' selected'}
            </Typography>
        </Box>
    );
}

export default CategoryHeader;
