import React from 'react';
import {
    Box,
    Collapse
} from '@mui/material';
import { filterDialogStyles } from './styles';
import CategoryHeader from './CategoryHeader';
import FilterOptionsGrid from './FilterOptionsGrid';

function CategorySection({ 
    categoryKey, 
    categoryData, 
    selectedFilters, 
    expandedCategories, 
    onToggleCategory, 
    onFilterToggle 
}) {
    const isExpanded = expandedCategories[categoryKey];
    
    if (Array.isArray(categoryData)) {
        const selectedInCategory = categoryData.filter(opt => 
            selectedFilters.includes(opt.value)
        ).length;
        
        return (
            <Box {...filterDialogStyles.categorySection}>
                <CategoryHeader
                    title={categoryKey}
                    isExpanded={isExpanded}
                    onToggle={() => onToggleCategory(categoryKey)}
                    selectedCount={selectedInCategory}
                    totalCount={categoryData.length}
                />
                
                <Collapse in={isExpanded}>
                    <FilterOptionsGrid
                        options={categoryData}
                        selectedFilters={selectedFilters}
                        onFilterToggle={onFilterToggle}
                    />
                </Collapse>
            </Box>
        );
    }
    
    const totalOptions = Object.values(categoryData).flat().length;
    const selectedInCategory = Object.values(categoryData).flat().filter(opt => 
        selectedFilters.includes(opt.value)
    ).length;
    
    return (
        <Box {...filterDialogStyles.categorySection}>
            <CategoryHeader
                title={categoryKey}
                isExpanded={isExpanded}
                onToggle={() => onToggleCategory(categoryKey)}
                selectedCount={selectedInCategory}
                totalCount={totalOptions}
            />
            
            <Collapse in={isExpanded}>
                {Object.entries(categoryData).map(([subcategoryKey, subcategoryOptions]) => {
                    const subcategoryExpanded = expandedCategories[`${categoryKey}-${subcategoryKey}`];
                    const selectedInSubcategory = subcategoryOptions.filter(opt => 
                        selectedFilters.includes(opt.value)
                    ).length;
                    
                    return (
                        <Box key={subcategoryKey}>
                            <CategoryHeader
                                title={subcategoryKey}
                                isExpanded={subcategoryExpanded}
                                onToggle={() => onToggleCategory(`${categoryKey}-${subcategoryKey}`)}
                                selectedCount={selectedInSubcategory}
                                totalCount={subcategoryOptions.length}
                                isSubcategory={true}
                            />
                            
                            <Collapse in={subcategoryExpanded}>
                                <FilterOptionsGrid
                                    options={subcategoryOptions}
                                    selectedFilters={selectedFilters}
                                    onFilterToggle={onFilterToggle}
                                />
                            </Collapse>
                        </Box>
                    );
                })}
            </Collapse>
        </Box>
    );
}

export default CategorySection;
