import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip
} from '@mui/material';

const ImageCard = React.memo(({ image, isSelected, onSelect, imageHeight }) => {
    const handleClick = () => {
        onSelect(image);
    };

    return (
        <Card 
            sx={{ 
                cursor: 'pointer',
                border: isSelected ? 2 : 1,
                borderColor: isSelected ? 'primary.main' : 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                }
            }}
            onClick={handleClick}
        >
            <CardMedia
                component="img"
                height={imageHeight}
                image={image.url}
                alt={image.name}
                sx={{ 
                    objectFit: 'cover',
                    backgroundColor: 'background.default'
                }}
            />
            <CardContent sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" noWrap>
                    {image.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {image.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {image.tags.slice(0, 3).map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', height: 20 }}
                        />
                    ))}
                    {image.tags.length > 3 && (
                        <Chip
                            label={`+${image.tags.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', height: 20 }}
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}, (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
        prevProps.image.id === nextProps.image.id &&
        prevProps.image.url === nextProps.image.url &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.imageHeight === nextProps.imageHeight
    );
});

ImageCard.displayName = 'ImageCard';

export { ImageCard };
