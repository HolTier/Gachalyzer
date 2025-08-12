import React from 'react';
import {
    DialogActions,
    Button,
    Box,
    Chip
} from '@mui/material';
import { filterDialogStyles } from './styles';

function FilterDialogActions({ selectedCount, onClear, onApply }) {
    return (
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
                    onClick={onClear}
                    disabled={selectedCount === 0}
                    {...filterDialogStyles.clearButton}
                >
                    Clear
                </Button>
                <Button 
                    onClick={onApply}
                    {...filterDialogStyles.applyButton}
                >
                    Apply
                </Button>
            </Box>
        </DialogActions>
    );
}

export default FilterDialogActions;
