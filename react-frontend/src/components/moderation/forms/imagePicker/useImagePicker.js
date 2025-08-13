import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { API_CONFIG } from '../../../../config/api';

export function useImagePicker({ apiEndpoint, imagesPerPage }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [availableTags, setAvailableTags] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    const currentPageSize = useRef(imagesPerPage);
    currentPageSize.current = imagesPerPage;

    const getImageDisplayUrl = (imageDto) => {
        const imagePath = imageDto.thumbnailPath || imageDto.splashArtPath;
        
        if (imagePath && (imagePath.startsWith('http') || imagePath.startsWith('//'))) {
            return imagePath;
        }
        
        return imagePath ? `${API_CONFIG.SHORT_URL}${imagePath}` : null;
    };

    const transformImageDto = useCallback((imageDto) => {
        const displayUrl = getImageDisplayUrl(imageDto);
        const hasValidUrl = displayUrl && displayUrl !== 'null' && displayUrl !== 'undefined';
        
        return {
            id: imageDto.id,
            url: hasValidUrl ? displayUrl : 'https://via.placeholder.com/300x200/f0f0f0/999999?text=No+Image',
            name: `Image ${imageDto.id}`,
            tags: [
                'image',
                imageDto.thumbnailPath ? 'thumbnail' : null,
                imageDto.splashArtPath ? 'splash' : null
            ].filter(Boolean),
            description: `Image ID: ${imageDto.id}${imageDto.thumbnailPath ? ' (Has thumbnail)' : ''}${imageDto.splashArtPath ? ' (Has splash art)' : ''}`,
            serverId: imageDto.id,
            isServerImage: true,
            thumbnailPath: imageDto.thumbnailPath,
            splashArtPath: imageDto.splashArtPath
        };
    }, []);

    const fetchImages = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IMAGE_PAGES}?pageNumber=${pageNumber}&pageSize=${currentPageSize.current}`
            );
            
            if (!response.ok) {
                if (response.status === 404) {
                    setImages([]);
                    setFilteredImages([]);
                    setTotalCount(0);
                    setTotalPages(0);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data || !Array.isArray(data.images)) {
                throw new Error('Invalid response format: expected images array');
            }
            
            const transformedImages = data.images.map(transformImageDto);
            
            setImages(transformedImages);
            setFilteredImages(transformedImages);
            setTotalCount(data.totalCount || 0);
            setTotalPages(data.totalPages || 0);
            
            const allTags = new Set();
            transformedImages.forEach(img => {
                img.tags.forEach(tag => allTags.add(tag));
            });
            setAvailableTags(Array.from(allTags));
            
        } catch (error) {
            console.error('Error fetching images:', error);
            setImages([]);
            setFilteredImages([]);
            setTotalCount(0);
            setTotalPages(0);
            setAvailableTags([]);
        } finally {
            setLoading(false);
        }
    }, [transformImageDto]); 

    const filteredImagesMemo = useMemo(() => {
        let filtered = images;
        
        if (searchTerm) {
            filtered = filtered.filter(img => 
                img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                img.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (selectedTags.length > 0) {
            filtered = filtered.filter(img => 
                selectedTags.every(tag => img.tags.includes(tag))
            );
        }
        
        return filtered;
    }, [images, searchTerm, selectedTags]);

    useEffect(() => {
        setFilteredImages(filteredImagesMemo);
        
        const hasFilters = searchTerm || selectedTags.length > 0;
        if (hasFilters) {
            const maxPages = Math.ceil(filteredImagesMemo.length / currentPageSize.current);
            if (page >= maxPages && maxPages > 0) {
                setPage(Math.max(0, maxPages - 1));
            }
        }
    }, [filteredImagesMemo, page, searchTerm, selectedTags]);

    const searchImages = useCallback((term, tags) => {
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSelectedTags([]);
        setPage(0); 
        fetchImages(1);
    }, [fetchImages]);

    const handlePageChange = useCallback(async (newPage) => {
        const hasFilters = searchTerm || selectedTags.length > 0;
        
        if (hasFilters) {
            setPage(newPage);
        } else {
            setPage(newPage);
            await fetchImages(newPage + 1);
        }
    }, [searchTerm, selectedTags, fetchImages]);

    const paginatedImages = useMemo(() => {
        const hasFilters = searchTerm || selectedTags.length > 0;
        
        if (hasFilters) {
            const startIndex = page * currentPageSize.current;
            const endIndex = startIndex + currentPageSize.current;
            return filteredImagesMemo.slice(startIndex, endIndex);
        } else {
            return images;
        }
    }, [page, searchTerm, selectedTags, filteredImagesMemo, images]);

    const handlePageSizeChange = useCallback(async (newPageSize) => {
        currentPageSize.current = newPageSize;
        setPage(0);
        
        const hasFilters = searchTerm || selectedTags.length > 0;
        if (!hasFilters) {
            await fetchImages(1);
        }
    }, [searchTerm, selectedTags, fetchImages]);
    const effectiveTotalPages = useMemo(() => {
        const hasFilters = searchTerm || selectedTags.length > 0;
        
        if (hasFilters) {
            return Math.ceil(filteredImagesMemo.length / currentPageSize.current);
        } else {
            return totalPages;
        }
    }, [searchTerm, selectedTags, filteredImagesMemo.length, totalPages]);

    const effectiveTotalCount = useMemo(() => {
        const hasFilters = searchTerm || selectedTags.length > 0;
        
        if (hasFilters) {
            return filteredImagesMemo.length;
        } else {
            return totalCount || 0;
        }
    }, [searchTerm, selectedTags, filteredImagesMemo.length, totalCount]);

    return {
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
        images,
        filteredImages,
        loading,
        page,
        setPage: handlePageChange,
        handlePageSizeChange,
        availableTags,
        totalPages: effectiveTotalPages,
        paginatedImages,
        totalCount: effectiveTotalCount,
        clearSearch,
        fetchImages,
        searchImages
    };
}
