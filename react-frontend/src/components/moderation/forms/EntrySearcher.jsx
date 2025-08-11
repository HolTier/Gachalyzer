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
    Avatar,
    Button
} from '@mui/material';
import {
    Search,
    FilterList,
    Edit,
    Delete,
    Clear,
    Add
} from '@mui/icons-material';
import { formStyles } from './formStyles';
import { API_CONFIG } from '../../../config/api';
import FilterSelectionDialog from './FilterSelectionDialog';

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
    const [searchTerms, setSearchTerms] = useState([]);
    const [searchField, setSearchField] = useState('all');
    const [filterValues, setFilterValues] = useState([]);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const defaultSearch = (terms, currentTerm, field, entries) => {
        const allTerms = [...terms];
        if (currentTerm && currentTerm.trim()) {
            allTerms.push(currentTerm.trim());
        }
        
        if (allTerms.length === 0) return entries;
        
        return entries.filter(entry =>
            allTerms.every(term => {
                const searchLower = term.toLowerCase();
                
                if (field === 'all') {
                    // Search across all fields
                    return headers.some(header => {
                        const value = entry[header.key];
                        if (value === null || value === undefined) return false;
                        return String(value).toLowerCase().includes(searchLower);
                    });
                } else {
                    // Search in specific field
                    const value = entry[field];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(searchLower);
                }
            })
        );
    };

    const defaultFilter = (filterVals, entries) => {
        if (!filterVals || !filterVals.length || !filterOptions.length) return entries;
        
        return entries.filter(entry => {
            return filterVals.some(filterVal => {
                const filterOption = filterOptions.find(opt => opt.value === filterVal);
                const filterField = filterOption?.field || headers[0]?.key;
                return String(entry[filterField]) === String(filterVal);
            });
        });
    };

    const processedData = useMemo(() => {
        let filtered = data;
        
        if (searchTerms.length > 0 || searchTerm.trim()) {
            filtered = customSearch ? 
                customSearch(searchTerms, searchTerm, searchField, filtered) : 
                defaultSearch(searchTerms, searchTerm, searchField, filtered);
        }
        
        if (filterValues.length > 0) {
            filtered = customFilter ? customFilter(filterValues, filtered) : defaultFilter(filterValues, filtered);
        }
        
        return filtered;
    }, [data, searchTerm, searchTerms, searchField, filterValues, customSearch, customFilter, filterOptions, headers]);

    const paginatedData = useMemo(() => {
        if (!showPagination) return processedData;
        
        const startIndex = page * rowsPerPage;
        return processedData.slice(startIndex, startIndex + rowsPerPage);
    }, [processedData, page, rowsPerPage, showPagination]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleSearchFieldChange = (event) => {
        setSearchField(event.target.value);
        setPage(0);
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter' && searchTerm.trim()) {
            addSearchTerm();
        }
    };

    const addSearchTerm = () => {
        const trimmedTerm = searchTerm.trim();
        if (trimmedTerm && !searchTerms.includes(trimmedTerm)) {
            setSearchTerms([...searchTerms, trimmedTerm]);
            setSearchTerm('');
            setPage(0);
        }
    };

    const handleFilterChange = (event) => {
        const value = event.target.value;
        if (value && !filterValues.includes(value)) {
            setFilterValues([...filterValues, value]);
            setPage(0);
        }
    };

    const handleFilterDialogOpen = () => {
        setFilterDialogOpen(true);
    };

    const handleFilterDialogClose = () => {
        setFilterDialogOpen(false);
    };

    const handleFilterApply = (newFilterValues) => {
        setFilterValues(newFilterValues);
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
        setSearchTerms([]);
        setPage(0);
    };

    const removeSearchTerm = (termToRemove) => {
        setSearchTerms(searchTerms.filter(term => term !== termToRemove));
        setPage(0);
    };

    const clearFilter = () => {
        setFilterValues([]);
        setPage(0);
    };

    const removeFilter = (filterToRemove) => {
        setFilterValues(filterValues.filter(f => f !== filterToRemove));
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
                        onKeyPress={handleSearchKeyPress}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchTerm.trim() && (
                                        <Tooltip title="Add search term">
                                            <IconButton
                                                size="small"
                                                onClick={addSearchTerm}
                                                edge="end"
                                                sx={{ mr: searchTerm ? 0.5 : 0 }}
                                            >
                                                <Add />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {(searchTerm || searchTerms.length > 0) && (
                                        <Tooltip title="Clear all search">
                                            <IconButton
                                                size="small"
                                                onClick={clearSearch}
                                                edge="end"
                                            >
                                                <Clear />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </InputAdornment>
                            )
                        }}
                    />
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel size="small">Search In</InputLabel>
                    <Select
                        value={searchField}
                        onChange={handleSearchFieldChange}
                        label="Search In"
                        size="small"
                    >
                        <MenuItem value="all">All Fields</MenuItem>
                        {headers
                            .filter(header => header.type !== 'image') // Exclude image fields from search
                            .map((header) => (
                                <MenuItem key={header.key} value={header.key}>
                                    {header.label}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                {filterOptions.length > 0 && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleFilterDialogOpen}
                        startIcon={<FilterList />}
                        sx={{ 
                            minWidth: 120,
                            height: 40
                        }}
                    >
                        Filters {filterValues.length > 0 && `(${filterValues.length})`}
                    </Button>
                )}
            </Box>

            <Box {...formStyles.resultsHeader}>
                <Typography {...formStyles.resultsCounter}>
                    {processedData.length === data.length
                        ? `${data.length} entries`
                        : `${processedData.length} of ${data.length} entries`
                    }
                </Typography>
                {(searchTerm || searchTerms.length > 0 || filterValues.length > 0) && (
                    <Box {...formStyles.activeFilters}>
                        {searchTerm && (
                            <Chip 
                                size="small" 
                                label={`Searching in ${searchField === 'all' ? 'All Fields' : headers.find(h => h.key === searchField)?.label || searchField}: "${searchTerm}"`} 
                                color="primary"
                                variant="filled"
                                sx={{ opacity: 0.7 }}
                            />
                        )}
                        {searchTerms.map((term) => (
                            <Chip 
                                key={term}
                                size="small" 
                                label={`Search in ${searchField === 'all' ? 'All Fields' : headers.find(h => h.key === searchField)?.label || searchField}: "${term}"`} 
                                onDelete={() => removeSearchTerm(term)}
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                        {filterValues.map((filterValue) => (
                            <Chip 
                                key={filterValue}
                                size="small" 
                                label={filterOptions.find(f => f.value === filterValue)?.label || filterValue}
                                onDelete={() => removeFilter(filterValue)}
                                color="secondary"
                                variant="outlined"
                            />
                        ))}
                        {(searchTerms.length > 1 || filterValues.length > 1) && (
                            <Chip 
                                size="small" 
                                label={searchTerms.length > 1 && filterValues.length > 1 ? "Clear all" : 
                                       searchTerms.length > 1 ? "Clear all searches" : "Clear all filters"}
                                onClick={searchTerms.length > 1 && filterValues.length > 1 ? 
                                        () => { clearSearch(); clearFilter(); } :
                                        searchTerms.length > 1 ? () => { setSearchTerms([]); setPage(0); } : clearFilter}
                                color="error"
                                variant="outlined"
                                sx={{ cursor: 'pointer' }}
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

            <FilterSelectionDialog
                open={filterDialogOpen}
                onClose={handleFilterDialogClose}
                filterOptions={filterOptions}
                selectedFilters={filterValues}
                onApply={handleFilterApply}
            />
        </Box>
    );
}

export default EntrySearcher;