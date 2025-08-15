import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

export function useImagePicker({ imagesPerPage = 12 }) {
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
    const currentSelectedTags = useRef([]);
    currentPageSize.current = imagesPerPage;

    const transformImageDto = useCallback((imageDto) => {
        const imagePath = imageDto.thumbnailPath || imageDto.splashArtPath;
        
        let displayUrl;
        if (imagePath && (imagePath.startsWith('http') || imagePath.startsWith('//'))) {
            displayUrl = imagePath;
        } else {
            displayUrl = imagePath ? `${API_CONFIG.SHORT_URL}${imagePath}` : null;
        }
        
        const hasValidUrl = displayUrl && displayUrl !== 'null' && displayUrl !== 'undefined';
        
        return {
            id: imageDto.id,
            url: hasValidUrl ? displayUrl : 'https://via.placeholder.com/300x200/f0f0f0/999999?text=No+Image',
            name: imageDto.name || `Image ${imageDto.id}`,
            tags: Array.isArray(imageDto.tags) ? imageDto.tags : [],
            description: imageDto.name ? 
                `${imageDto.name} (ID: ${imageDto.id})` : 
                `Image ID: ${imageDto.id}${imageDto.thumbnailPath ? ' (Has thumbnail)' : ''}${imageDto.splashArtPath ? ' (Has splash art)' : ''}`,
            serverId: imageDto.id,
            isServerImage: true,
            thumbnailPath: imageDto.thumbnailPath,
            splashArtPath: imageDto.splashArtPath
        };
    }, []);

    const fetchAllTags = useCallback(async () => {
        try {
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_TAGS}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const tags = await response.json();
            
            const sortedTags = Array.isArray(tags) ? 
                tags.filter(tag => tag && typeof tag === 'string')
                    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())) : 
                [];
            
            setAvailableTags(sortedTags);
        } catch (error) {
            console.error('Error fetching tags:', error);
            setAvailableTags([]);
        }
    }, []);

    const fetchImages = useCallback(async (pageNumber = 1, tagsFilter = []) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                pageNumber: pageNumber.toString(),
                pageSize: currentPageSize.current.toString()
            });

            if (tagsFilter && tagsFilter.length > 0) {
                tagsFilter.forEach(tag => {
                    params.append('tags', tag);
                });
            }

            const finalUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IMAGE_PAGES}?${params.toString()}`;
            const response = await fetch(finalUrl);
            
            if (!response.ok) {
                if (response.status === 404) {
                    setImages([]);
                    setTotalCount(0);
                    setTotalPages(0);
                    setLoading(false);
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
            setTotalCount(data.totalCount || 0);
            setTotalPages(data.totalPages || 0);
            
        } catch (error) {
            console.error('Error fetching images:', error);
            setImages([]);
            setTotalCount(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredImagesMemo = useMemo(() => {
        if (!searchTerm) {
            return images;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        return images.filter(img => 
            img.name.toLowerCase().includes(lowerSearchTerm) ||
            img.description.toLowerCase().includes(lowerSearchTerm) ||
            img.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
        );
    }, [images, searchTerm]);

    useEffect(() => {
        setFilteredImages(filteredImagesMemo);
        
        if (searchTerm) {
            const maxPages = Math.ceil(filteredImagesMemo.length / currentPageSize.current);
            if (page >= maxPages && maxPages > 0) {
                setPage(Math.max(0, maxPages - 1));
            }
        }
    }, [filteredImagesMemo, page, searchTerm]);

    useEffect(() => {
        currentSelectedTags.current = selectedTags;
        setPage(0);
        fetchImages(1, selectedTags);
    }, [selectedTags]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSelectedTags([]);
        setPage(0);
        fetchImages(1, []);
    }, []);

    const handlePageChange = useCallback(async (newPage) => {
        if (searchTerm) {
            setPage(newPage);
        } else {
            setPage(newPage);
            await fetchImages(newPage + 1, currentSelectedTags.current);
        }
    }, [searchTerm]);

    const handlePageSizeChange = useCallback(async (newPageSize) => {
        currentPageSize.current = newPageSize;
        setPage(0);
        await fetchImages(1, currentSelectedTags.current);
    }, []);

    const paginatedImages = useMemo(() => {
        if (searchTerm) {
            const startIndex = page * currentPageSize.current;
            const endIndex = startIndex + currentPageSize.current;
            return filteredImagesMemo.slice(startIndex, endIndex);
        } else {
            return images;
        }
    }, [page, searchTerm, filteredImagesMemo, images]);

    const effectiveTotalCount = useMemo(() => {
        return searchTerm ? filteredImagesMemo.length : totalCount;
    }, [searchTerm, filteredImagesMemo.length, totalCount]);

    const effectiveTotalPages = useMemo(() => {
        return searchTerm ? 
            Math.ceil(filteredImagesMemo.length / currentPageSize.current) : 
            totalPages;
    }, [searchTerm, filteredImagesMemo.length, totalPages, currentPageSize.current]);

    useEffect(() => {
        fetchAllTags();
        fetchImages(1, []);
    }, []);

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
        fetchAllTags
    };
}
