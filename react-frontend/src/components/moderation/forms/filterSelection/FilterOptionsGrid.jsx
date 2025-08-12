import React from 'react';
import {
    Box,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { filterDialogStyles } from './styles';

function FilterOptionsGrid({ options, selectedFilters, onFilterToggle }) {
    return (
        <Box {...filterDialogStyles.optionsGrid}>
            {options.map((option) => (
                <Box key={option.value} {...filterDialogStyles.optionItem}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedFilters.includes(option.value)}
                                onChange={() => onFilterToggle(option.value)}
                                size="small"
                            />
                        }
                        label={option.label}
                    />
                </Box>
            ))}
        </Box>
    );
}

export default FilterOptionsGrid;
