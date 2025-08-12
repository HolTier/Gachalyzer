import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Avatar,
    Tooltip,
    Typography,
    Box
} from '@mui/material';
import {
    Edit,
    Delete
} from '@mui/icons-material';
import { formStyles } from '../formStyles';
import { API_CONFIG } from '../../../../config/api';

function DataTable({
    headers,
    paginatedData,
    noDataMessage,
    tableContainerStyle,
    onEdit,
    onRemove
}) {
    const formatCellValue = (value, header) => {
        if (value === null || value === undefined) return '-';
        
        switch (header.type) {
            case 'date':
                return new Date(value).toLocaleDateString();
            case 'datetime':
                return new Date(value).toLocaleString();
            case 'number':
                return typeof value === 'number' ? value.toLocaleString() : value;
            case 'boolean':
                return value ? 'Yes' : 'No';
            case 'chip':
                return <Chip size="small" label={String(value)} />;
            case 'image':
                return (
                    <Avatar
                        src={`${API_CONFIG.SHORT_URL}${value}`}
                        alt="Icon"
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                        }}
                        variant="rounded"
                    />
                );
            default:
                return String(value);
        }
    };

    return (
        <TableContainer 
            component={Paper} 
            {...(tableContainerStyle || formStyles.tableContainerFixed)}
        >
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell 
                                key={header.key}
                                sx={{ 
                                    ...formStyles.tableHeaderFixed.sx,
                                    width: header.width
                                }}
                            >
                                {header.label}
                            </TableCell>
                        ))}
                        {(onEdit || onRemove) && (
                            <TableCell 
                                sx={{
                                    ...formStyles.tableHeaderFixed.sx,
                                    width: 120,
                                    textAlign: 'center'
                                }}
                            >
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedData.length === 0 ? (
                        <TableRow>
                            <TableCell 
                                colSpan={headers.length + (onEdit || onRemove ? 1 : 0)}
                                {...formStyles.emptyTableCell}
                            >
                                <Typography {...formStyles.emptyTableText}>
                                    {noDataMessage}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedData.map((entry, index) => (
                            <TableRow 
                                key={entry.id || index}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {headers.map((header) => (
                                    <TableCell key={header.key}>
                                        {formatCellValue(entry[header.key], header)}
                                    </TableCell>
                                ))}
                                {(onEdit || onRemove) && (
                                    <TableCell {...formStyles.tableActionsCell}>
                                        <Box {...formStyles.tableActions}>
                                            {onEdit && (
                                                <Tooltip title="Edit entry">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(entry)}
                                                        color="primary"
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {onRemove && (
                                                <Tooltip title="Remove entry">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onRemove(entry)}
                                                        color="error"
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DataTable;
