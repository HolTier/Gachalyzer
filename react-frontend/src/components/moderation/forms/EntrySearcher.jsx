import React, { useState } from 'react';
import {
    Box,
    Typography,
    TablePagination
} from '@mui/material';
import { formStyles } from './formStyles';
import FilterSelectionDialog from './FilterSelectionDialog';
import { SearchControls, SearchChips, DataTable, useSearchLogic } from './entrySearcher/index';

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
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    const {
        searchTerm,
        setSearchTerm,
        searchTerms,
        searchField,
        setSearchField,
        filterValues,
        setFilterValues,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        processedData,
        paginatedData,
        addSearchTerm,
        removeSearchTerm,
        clearSearch,
        removeFilter,
        clearFilter,
        resetToFirstPage
    } = useSearchLogic({
        data,
        headers,
        customSearch,
        customFilter,
        filterOptions,
        defaultRowsPerPage,
        showPagination
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        resetToFirstPage();
    };

    const handleSearchFieldChange = (event) => {
        setSearchField(event.target.value);
        resetToFirstPage();
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter' && searchTerm.trim()) {
            addSearchTerm();
        }
    };

    const handleFilterChange = (event) => {
        const value = event.target.value;
        if (value && !filterValues.includes(value)) {
            setFilterValues([...filterValues, value]);
            resetToFirstPage();
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
        resetToFirstPage();
    };

    const handleChangePage = (event, newPage) => {
        page !== newPage && setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        resetToFirstPage();
    };

    return (
        <Box sx={containerStyle ? containerStyle.sx : formStyles.formContainer}>
            <Typography {...formStyles.formTitle}>{title}</Typography>
            
            <SearchControls
                searchTerm={searchTerm}
                searchField={searchField}
                filterOptions={filterOptions}
                filterValues={filterValues}
                headers={headers}
                searchPlaceholder={searchPlaceholder}
                onSearchChange={handleSearchChange}
                onSearchFieldChange={handleSearchFieldChange}
                onSearchKeyPress={handleSearchKeyPress}
                onAddSearchTerm={addSearchTerm}
                onClearSearch={clearSearch}
                onFilterDialogOpen={handleFilterDialogOpen}
            />

            <SearchChips
                processedData={processedData}
                data={data}
                searchTerm={searchTerm}
                searchTerms={searchTerms}
                searchField={searchField}
                filterValues={filterValues}
                filterOptions={filterOptions}
                headers={headers}
                onRemoveSearchTerm={removeSearchTerm}
                onRemoveFilter={removeFilter}
                onClearSearch={clearSearch}
                onClearFilter={clearFilter}
            />

            <DataTable
                headers={headers}
                paginatedData={paginatedData}
                noDataMessage={noDataMessage}
                tableContainerStyle={tableContainerStyle}
                onEdit={onEdit}
                onRemove={onRemove}
            />

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