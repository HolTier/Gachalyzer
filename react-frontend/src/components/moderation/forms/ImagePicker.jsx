import React, { useState, useEffect } from 'react';
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
import { SearchControls, ImageGrid, ImageSearchChips, useImagePicker } from './imagePicker/index';

function ImagePicker({ 
    open, 
    onClose, 
    onSelect, 
    title = "Select Image",
    searchPlaceholder = "Search images...",
    apiEndpoint = "/api/images",
    imageHeight = 150,
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
        availableTags,
        totalPages,
        paginatedImages,
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
        searchImages(searchTerm, selectedTags);
        setPage(0);
    }, [searchTerm, selectedTags, images, searchImages, setPage]);

    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

    const handleConfirm = () => {
        if (selectedImage && onSelect) {
            onSelect(selectedImage);
        }
        handleClose();
    };

    const handleClose = () => {
        setSearchTerm('');
        setSelectedTags([]);
        setSelectedImage(null);
        setPage(0);
        if (onClose) {
            onClose();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleClearAllFilters = () => {
        setSearchTerm('');
        setSelectedTags([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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

                <Box sx={{ flex: 1, overflow: 'auto' }}>
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

                {filteredImages.length > 0 && (
                    <TablePagination
                        component="div"
                        count={filteredImages.length}
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
