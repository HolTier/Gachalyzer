import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Box
} from '@mui/material';
import {
    FilterDialogHeader,
    CategorySection,
    FilterDialogActions,
    filterDialogStyles,
    useHierarchicalCategories,
    useInitialExpandedState
} from './filterSelection';

function FilterSelectionDialog({ 
    open, 
    onClose, 
    filterOptions = [], 
    selectedFilters = [], 
    onApply 
}) {
    const [tempSelectedFilters, setTempSelectedFilters] = useState(selectedFilters);
    const initialExpandedState = useInitialExpandedState(filterOptions);
    const [expandedCategories, setExpandedCategories] = useState(initialExpandedState);

    const hierarchicalCategories = useHierarchicalCategories(filterOptions);

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
        setTempSelectedFilters(selectedFilters);
        onClose();
    };

    const selectedCount = tempSelectedFilters.length;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            {...filterDialogStyles.dialog}
        >
            <FilterDialogHeader onClose={handleClose} />

            <DialogContent {...filterDialogStyles.dialogContent}>
                <Box {...filterDialogStyles.categoryContainer}>
                    {Object.entries(hierarchicalCategories).map(([categoryKey, categoryData]) => (
                        <CategorySection
                            key={categoryKey}
                            categoryKey={categoryKey}
                            categoryData={categoryData}
                            selectedFilters={tempSelectedFilters}
                            expandedCategories={expandedCategories}
                            onToggleCategory={toggleCategoryExpansion}
                            onFilterToggle={handleFilterToggle}
                        />
                    ))}
                </Box>
            </DialogContent>

            <FilterDialogActions
                selectedCount={selectedCount}
                onClear={handleClear}
                onApply={handleApply}
            />
        </Dialog>
    );
}

export default FilterSelectionDialog;
