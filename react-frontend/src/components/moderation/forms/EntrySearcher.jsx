import React, { useState, useMemo } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    TablePagination,
    Tooltip,
    Avatar
} from '@mui/material';
import {
    Search,
    FilterList,
    Edit,
    Delete,
    Clear
} from '@mui/icons-material';
import { formStyles } from './formStyles';
import { API_CONFIG } from '../../../config/api';

function EntrySearcher({
    data = [],
    headers = [],
    onEdit,
    onRemove,
    customSearch,
    customFilter,
    filterOptions = [],
    title = "Entry Manager",
    showPagination = true,
    defaultRowsPerPage = 10,
    searchPlaceholder = "Search entries...",
    noDataMessage = "No entries found",
    tableContainerStyle = null,
    containerStyle = null
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const defaultSearch = (term, entries) => {
        if (!term.trim()) return entries;
        
        const searchLower = term.toLowerCase();
        return entries.filter(entry =>
            headers.some(header => {
                const value = entry[header.key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchLower);
            })
        );
    };

    const defaultFilter = (filterVal, entries) => {
        if (!filterVal || !filterOptions.length) return entries;
        
        const filterField = filterOptions[0]?.field || headers[0]?.key;
        return entries.filter(entry => String(entry[filterField]) === String(filterVal));
    };

    const processedData = useMemo(() => {
        let filtered = data;
        
        if (searchTerm) {
            filtered = customSearch ? customSearch(searchTerm, filtered) : defaultSearch(searchTerm, filtered);
        }
        
        if (filterValue) {
            filtered = customFilter ? customFilter(filterValue, filtered) : defaultFilter(filterValue, filtered);
        }
        
        return filtered;
    }, [data, searchTerm, filterValue, customSearch, customFilter, filterOptions, headers]);

    const paginatedData = useMemo(() => {
        if (!showPagination) return processedData;
        
        const startIndex = page * rowsPerPage;
        return processedData.slice(startIndex, startIndex + rowsPerPage);
    }, [processedData, page, rowsPerPage, showPagination]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setPage(0);
    };

    const clearFilter = () => {
        setFilterValue('');
        setPage(0);
    };

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
        <Box sx={containerStyle ? containerStyle.sx : formStyles.formContainer}>
            <Typography {...formStyles.formTitle}>{title}</Typography>
            
            <Box {...formStyles.searchContainer}>
                <FormControl {...formStyles.searchField}>
                    <TextField
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={clearSearch}
                                        edge="end"
                                    >
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </FormControl>

                {filterOptions.length > 0 && (
                    <FormControl {...formStyles.filterField}>
                        <InputLabel size="small">Filter</InputLabel>
                        <Select
                            value={filterValue}
                            onChange={handleFilterChange}
                            label="Filter"
                            size="small"
                            startAdornment={
                                <InputAdornment position="start">
                                    <FilterList color="action" />
                                </InputAdornment>
                            }
                            endAdornment={filterValue && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={clearFilter}
                                        edge="end"
                                    >
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            )}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {filterOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box>

            <Box {...formStyles.resultsHeader}>
                <Typography {...formStyles.resultsCounter}>
                    {processedData.length === data.length
                        ? `${data.length} entries`
                        : `${processedData.length} of ${data.length} entries`
                    }
                </Typography>
                {(searchTerm || filterValue) && (
                    <Box {...formStyles.activeFilters}>
                        {searchTerm && (
                            <Chip 
                                size="small" 
                                label={`Search: "${searchTerm}"`} 
                                onDelete={clearSearch}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {filterValue && (
                            <Chip 
                                size="small" 
                                label={`Filter: ${filterOptions.find(f => f.value === filterValue)?.label || filterValue}`}
                                onDelete={clearFilter}
                                color="secondary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                )}
            </Box>

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

            {showPagination && processedData.length > 0 && (
                <TablePagination
                    component="div"
                    count={processedData.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    {...formStyles.paginationContainer}
                />
            )}
        </Box>
    );
}

export default EntrySearcher;