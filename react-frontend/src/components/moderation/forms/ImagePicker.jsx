import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    TablePagination
} from '@mui/material';
import {
    Close as CloseIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { formStyles } from './formStyles';
import { API_CONFIG } from '../../../config/api';
import { SearchControls, ImageGrid, ImageSearchChips, useImagePicker } from './imagePicker/index';

function ImagePicker({ 
    open, 
    onClose, 
    onSelect, 
    title = "Select Image",
    searchPlaceholder = "Search images...",
    apiEndpoint = API_CONFIG.ENDPOINTS.IMAGE_PAGES,
    imagesPerPage = 12 
}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(imagesPerPage);

    const {
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
        images,
        filteredImages,
        loading,
        page,
        setPage,
        handlePageSizeChange,
        availableTags,
        totalPages,
        paginatedImages,
        totalCount,
        clearSearch,
        fetchImages,
        searchImages
    } = useImagePicker({ apiEndpoint, imagesPerPage: rowsPerPage });

    useEffect(() => {
        if (open) {
            fetchImages();
        }
    }, [open, fetchImages]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchImages(searchTerm, selectedTags);
            setPage(0);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedTags, searchImages, setPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        handlePageSizeChange(newRowsPerPage);
    };

    const handleImageSelect = useCallback((image) => {
        setSelectedImage(image);
    }, []);

    const handleConfirm = useCallback(() => {
        if (selectedImage && onSelect) {
            const imageData = {
                ...selectedImage,
                isServerImage: true,
                serverId: selectedImage.id
            };
            onSelect(imageData);
        }
        handleClose();
    }, [selectedImage, onSelect]);

    const handleClose = useCallback(() => {
        setSearchTerm('');
        setSelectedTags([]);
        setSelectedImage(null);
        setPage(0);
        if (onClose) {
            onClose();
        }
    }, [onClose, setSearchTerm, setSelectedTags, setPage]);

    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleClearAllFilters = () => {
        setSearchTerm('');
        setSelectedTags([]);
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            {...formStyles.dialog}
            slotProps={{
                paper: {
                    sx: {
                        height: '90vh',
                        maxHeight: '800px'
                    }
                }
            }}
        >
            <DialogTitle {...formStyles.dialogTitle}>
                {title}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    {...formStyles.dialogCloseButton}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent {...formStyles.dialogContent}>
                <SearchControls
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    availableTags={availableTags}
                    searchPlaceholder={searchPlaceholder}
                />

                <ImageSearchChips
                    searchTerm={searchTerm}
                    selectedTags={selectedTags}
                    filteredImages={filteredImages}
                    totalImages={images.length}
                    selectedImage={selectedImage}
                    onClearSearch={handleClearAllFilters}
                    onRemoveTag={handleRemoveTag}
                />

                <Box sx={{ flex: 1, overflow: 'auto', maxHeight: 'calc(90vh - 300px)' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ImageGrid
                            images={paginatedImages}
                            filteredImages={filteredImages}
                            selectedImage={selectedImage}
                            onImageSelect={handleImageSelect}
                            imageHeight={imageHeight}
                        />
                    )}
                </Box>

                {!loading && (
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[6, 12, 24, 48]}
                        {...formStyles.paginationContainer}
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!selectedImage}
                    startIcon={<ImageIcon />}
                >
                    Select Image
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ImagePicker;
