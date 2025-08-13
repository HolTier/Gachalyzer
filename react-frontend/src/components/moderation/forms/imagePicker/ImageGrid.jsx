import React from 'react';
import {
    Grid,
    Box,
    Typography,
    Pagination
} from '@mui/material';
import {
    Image as ImageIcon
} from '@mui/icons-material';
import { ImageCard } from './ImageCard';

export function ImageGrid({
    images,
    filteredImages,
    selectedImage,
    onImageSelect,
    imageHeight
}) {
    if (filteredImages.length === 0) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: 200, 
                color: 'text.secondary' 
            }}>
                <ImageIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                    No images found
                </Typography>
                <Typography variant="body2">
                    Try adjusting your search terms or tags
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {images.map((image) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                    <ImageCard
                        image={image}
                        isSelected={selectedImage?.id === image.id}
                        onSelect={onImageSelect}
                        imageHeight={imageHeight}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
