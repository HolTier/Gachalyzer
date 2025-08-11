import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    Divider,
    Checkbox,
    FormControlLabel,
    Paper,
    Chip,
    Collapse
} from '@mui/material';
import {
    Close as CloseIcon,
    FilterList,
    ExpandMore,
    ChevronRight
} from '@mui/icons-material';

// Custom styles for the filter dialog
const filterDialogStyles = {
    dialog: {
        maxWidth: 'md',
        fullWidth: true
    },
    
    dialogTitle: {
        sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 600,
            position: 'relative'
        }
    },
    
    dialogContent: {
        sx: {
            p: 0,
            backgroundColor: 'background.default',
            minHeight: 400,
            maxHeight: 500,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }
    },
    
    closeButton: {
        sx: {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'primary.contrastText'
        }
    },
    
    categoryContainer: {
        sx: {
            flex: 1,
            overflow: 'auto',
            p: 2
        }
    },
    
    categorySection: {
        sx: {
            mb: 3,
            '&:last-child': { mb: 0 }
        }
    },
    
    categoryHeader: {
        sx: {
            p: 1.5,
            backgroundColor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
            mb: 1,
            mx: -2, // Negative margin to extend to dialog edges
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: 'action.selected'
            }
        }
    },
    
    subcategoryHeader: {
        sx: {
            p: 1.5,
            pl: 4,
            backgroundColor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            opacity: 0.9,
            '&:hover': {
                backgroundColor: 'action.selected'
            }
        }
    },
    
    categoryTitle: {
        variant: 'subtitle1',
        sx: {
            fontWeight: 600,
            color: 'text.primary'
        }
    },
    
    categoryCount: {
        sx: {
            color: 'text.secondary',
            fontSize: '0.875rem',
            ml: 'auto'
        }
    },
    
    optionsGrid: {
        sx: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 0.5,
            pl: 4,
            pr: 1,
            pb: 1
        }
    },
    
    optionItem: {
        sx: {
            '& .MuiFormControlLabel-root': {
                margin: 0,
                width: '100%',
                '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }
            },
            '& .MuiCheckbox-root': {
                padding: '4px 8px'
            }
        }
    },
    
    dialogActions: {
        sx: {
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            p: 2,
            gap: 2,
            justifyContent: 'space-between'
        }
    },
    
    selectedCounter: {
        sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary'
        }
    },
    
    actionButtons: {
        sx: {
            display: 'flex',
            gap: 1
        }
    },
    
    clearButton: {
        variant: 'outlined',
        color: 'secondary'
    },
    
    applyButton: {
        variant: 'contained',
        color: 'primary'
    }
};

function FilterSelectionDialog({ 
    open, 
    onClose, 
    filterOptions = [], 
    selectedFilters = [], 
    onApply 
}) {
    const [tempSelectedFilters, setTempSelectedFilters] = useState(selectedFilters);
    const [expandedCategories, setExpandedCategories] = useState(() => {
        // Initially expand all main categories to show the hierarchy
        const initialExpanded = {};
        const allCategories = [...new Set(filterOptions.map(opt => opt.main || 'Top Level'))];
        allCategories.forEach(category => {
            if (category !== 'Top Level') {
                initialExpanded[category] = true;
            }
        });
        // Also expand top-level categories
        ['Games', 'Elements', 'Weapons'].forEach(category => {
            initialExpanded[category] = true;
        });
        return initialExpanded;
    });

    // Group filter options into hierarchical structure
    const hierarchicalCategories = useMemo(() => {
        const hierarchy = {};
        
        filterOptions.forEach(option => {
            const field = option.field || 'Other';
            const mainCategory = option.main;
            
            if (mainCategory) {
                // Group by main category (e.g., "Genshin Impact")
                if (!hierarchy[mainCategory]) {
                    hierarchy[mainCategory] = {};
                }
                
                // Then group by field (e.g., "Elements", "Weapons")
                const fieldMappings = {
                    'characterElementName': 'Elements',
                    'characterWeaponTypeName': 'Weapons',
                    'artifactSetName': 'Artifact Sets',
                    'artifactTypeName': 'Artifact Types'
                };
                const fieldDisplay = fieldMappings[field] || field;
                
                if (!hierarchy[mainCategory][fieldDisplay]) {
                    hierarchy[mainCategory][fieldDisplay] = [];
                }
                hierarchy[mainCategory][fieldDisplay].push(option);
            } else {
                // Top-level categories (e.g., "Games")
                const fieldMappings = {
                    'gameName': 'Games',
                    'characterElementName': 'Elements',
                    'characterWeaponTypeName': 'Weapons',
                    'artifactSetName': 'Artifact Sets',
                    'artifactTypeName': 'Artifact Types'
                };
                const fieldDisplay = fieldMappings[field] || field;
                
                if (!hierarchy[fieldDisplay]) {
                    hierarchy[fieldDisplay] = [];
                }
                hierarchy[fieldDisplay].push(option);
            }
        });
        
        return hierarchy;
    }, [filterOptions]);

    const toggleCategoryExpansion = (categoryKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    const handleFilterToggle = (filterValue) => {
        setTempSelectedFilters(prev => {
            if (prev.includes(filterValue)) {
                return prev.filter(f => f !== filterValue);
            } else {
                return [...prev, filterValue];
            }
        });
    };

    const handleClear = () => {
        setTempSelectedFilters([]);
    };

    const handleApply = () => {
        onApply(tempSelectedFilters);
        onClose();
    };

    const handleClose = () => {
        setTempSelectedFilters(selectedFilters); // Reset to original selection
        onClose();
    };

    const selectedCount = tempSelectedFilters.length;

    const renderCategoryOptions = (options, categoryKey) => (
        <Box {...filterDialogStyles.optionsGrid}>
            {options.map((option) => (
                <Box key={option.value} {...filterDialogStyles.optionItem}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempSelectedFilters.includes(option.value)}
                                onChange={() => handleFilterToggle(option.value)}
                                size="small"
                            />
                        }
                        label={option.label}
                    />
                </Box>
            ))}
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            {...filterDialogStyles.dialog}
        >
            <DialogTitle {...filterDialogStyles.dialogTitle}>
                <FilterList />
                Filter Selection
                <IconButton
                    onClick={handleClose}
                    {...filterDialogStyles.closeButton}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent {...filterDialogStyles.dialogContent}>
                <Box {...filterDialogStyles.categoryContainer}>
                    {Object.entries(hierarchicalCategories).map(([categoryKey, categoryData]) => {
                        const isExpanded = expandedCategories[categoryKey];
                        
                        // Handle top-level categories (arrays)
                        if (Array.isArray(categoryData)) {
                            const selectedInCategory = categoryData.filter(opt => 
                                tempSelectedFilters.includes(opt.value)
                            ).length;
                            
                            return (
                                <Box key={categoryKey} {...filterDialogStyles.categorySection}>
                                    <Box 
                                        {...filterDialogStyles.categoryHeader}
                                        onClick={() => toggleCategoryExpansion(categoryKey)}
                                    >
                                        {isExpanded ? <ExpandMore /> : <ChevronRight />}
                                        <Typography {...filterDialogStyles.categoryTitle}>
                                            {categoryKey}
                                        </Typography>
                                        <Typography {...filterDialogStyles.categoryCount}>
                                            {selectedInCategory} / {categoryData.length} selected
                                        </Typography>
                                    </Box>
                                    
                                    <Collapse in={isExpanded}>
                                        {renderCategoryOptions(categoryData, categoryKey)}
                                    </Collapse>
                                </Box>
                            );
                        }
                        
                        // Handle hierarchical categories (objects with subcategories)
                        const totalOptions = Object.values(categoryData).flat().length;
                        const selectedInCategory = Object.values(categoryData).flat().filter(opt => 
                            tempSelectedFilters.includes(opt.value)
                        ).length;
                        
                        return (
                            <Box key={categoryKey} {...filterDialogStyles.categorySection}>
                                <Box 
                                    {...filterDialogStyles.categoryHeader}
                                    onClick={() => toggleCategoryExpansion(categoryKey)}
                                >
                                    {isExpanded ? <ExpandMore /> : <ChevronRight />}
                                    <Typography {...filterDialogStyles.categoryTitle}>
                                        {categoryKey}
                                    </Typography>
                                    <Typography {...filterDialogStyles.categoryCount}>
                                        {selectedInCategory} / {totalOptions} selected
                                    </Typography>
                                </Box>
                                
                                <Collapse in={isExpanded}>
                                    {Object.entries(categoryData).map(([subcategoryKey, subcategoryOptions]) => {
                                        const subcategoryExpanded = expandedCategories[`${categoryKey}-${subcategoryKey}`];
                                        const selectedInSubcategory = subcategoryOptions.filter(opt => 
                                            tempSelectedFilters.includes(opt.value)
                                        ).length;
                                        
                                        return (
                                            <Box key={subcategoryKey}>
                                                <Box 
                                                    {...filterDialogStyles.subcategoryHeader}
                                                    onClick={() => toggleCategoryExpansion(`${categoryKey}-${subcategoryKey}`)}
                                                >
                                                    {subcategoryExpanded ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
                                                    <Typography {...filterDialogStyles.categoryTitle} sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
                                                        {subcategoryKey}
                                                    </Typography>
                                                    <Typography {...filterDialogStyles.categoryCount}>
                                                        {selectedInSubcategory} / {subcategoryOptions.length}
                                                    </Typography>
                                                </Box>
                                                
                                                <Collapse in={subcategoryExpanded}>
                                                    {renderCategoryOptions(subcategoryOptions, `${categoryKey}-${subcategoryKey}`)}
                                                </Collapse>
                                            </Box>
                                        );
                                    })}
                                </Collapse>
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>

            <DialogActions {...filterDialogStyles.dialogActions}>
                <Box {...filterDialogStyles.selectedCounter}>
                    <Chip 
                        size="small" 
                        label={`${selectedCount} filter${selectedCount !== 1 ? 's' : ''} selected`}
                        color={selectedCount > 0 ? 'primary' : 'default'}
                        variant="outlined"
                    />
                </Box>
                
                <Box {...filterDialogStyles.actionButtons}>
                    <Button 
                        onClick={handleClear}
                        disabled={selectedCount === 0}
                        {...filterDialogStyles.clearButton}
                    >
                        Clear
                    </Button>
                    <Button 
                        onClick={handleApply}
                        {...filterDialogStyles.applyButton}
                    >
                        Apply
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default FilterSelectionDialog;
