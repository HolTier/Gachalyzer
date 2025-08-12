import React from 'react';
import {
    DialogTitle,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
    FilterList
} from '@mui/icons-material';
import { filterDialogStyles } from './styles';

function FilterDialogHeader({ onClose }) {
    return (
        <DialogTitle {...filterDialogStyles.dialogTitle}>
            <FilterList />
            Filter Selection
            <IconButton
                onClick={onClose}
                {...filterDialogStyles.closeButton}
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
}

export default FilterDialogHeader;
