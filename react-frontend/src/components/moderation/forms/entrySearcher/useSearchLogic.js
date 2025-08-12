import { useState, useMemo, useCallback } from 'react';

export function useSearchLogic({
    data,
    headers,
    customSearch,
    customFilter,
    filterOptions,
    defaultRowsPerPage,
    showPagination
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTerms, setSearchTerms] = useState([]);
    const [searchField, setSearchField] = useState('all');
    const [filterValues, setFilterValues] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const defaultSearch = useCallback((terms, currentTerm, field, entries) => {
        const allTerms = [...terms];
        if (currentTerm && currentTerm.trim()) {
            allTerms.push(currentTerm.trim());
        }
        
        if (allTerms.length === 0) return entries;
        
        return entries.filter(entry =>
            allTerms.every(term => {
                const searchLower = term.toLowerCase();
                
                if (field === 'all') {
                    return headers.some(header => {
                        const value = entry[header.key];
                        if (value === null || value === undefined) return false;
                        return String(value).toLowerCase().includes(searchLower);
                    });
                } else {
                    const value = entry[field];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(searchLower);
                }
            })
        );
    }, [headers]);

    const defaultFilter = useCallback((filterVals, entries) => {
        if (!filterVals || !filterVals.length || !filterOptions.length) return entries;
        
        return entries.filter(entry => {
            return filterVals.some(filterVal => {
                const filterOption = filterOptions.find(opt => opt.value === filterVal);
                const filterField = filterOption?.field || headers[0]?.key;
                return String(entry[filterField]) === String(filterVal);
            });
        });
    }, [filterOptions, headers]);

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
    }, [data, searchTerm, searchTerms, searchField, filterValues, customSearch, customFilter, defaultSearch, defaultFilter]);

    const paginatedData = useMemo(() => {
        if (!showPagination) return processedData;
        
        const startIndex = page * rowsPerPage;
        return processedData.slice(startIndex, startIndex + rowsPerPage);
    }, [processedData, page, rowsPerPage, showPagination]);

    const addSearchTerm = () => {
        const trimmedTerm = searchTerm.trim();
        if (trimmedTerm && !searchTerms.includes(trimmedTerm)) {
            setSearchTerms([...searchTerms, trimmedTerm]);
            setSearchTerm('');
            setPage(0);
        }
    };

    const removeSearchTerm = (termToRemove) => {
        setSearchTerms(searchTerms.filter(term => term !== termToRemove));
        setPage(0);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchTerms([]);
        setPage(0);
    };

    const removeFilter = (filterToRemove) => {
        setFilterValues(filterValues.filter(f => f !== filterToRemove));
        setPage(0);
    };

    const clearFilter = () => {
        setFilterValues([]);
        setPage(0);
    };

    const resetToFirstPage = () => {
        setPage(0);
    };

    return {
        // State
        searchTerm,
        setSearchTerm,
        searchTerms,
        setSearchTerms,
        searchField,
        setSearchField,
        filterValues,
        setFilterValues,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        
        // Computed data
        processedData,
        paginatedData,
        
        // Actions
        addSearchTerm,
        removeSearchTerm,
        clearSearch,
        removeFilter,
        clearFilter,
        resetToFirstPage
    };
}
