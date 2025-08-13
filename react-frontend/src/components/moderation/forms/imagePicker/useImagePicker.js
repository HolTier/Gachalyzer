import { useState, useCallback } from 'react';

export function useImagePicker({ apiEndpoint, imagesPerPage }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [availableTags, setAvailableTags] = useState([]);


    const mockImages = [
        {
            id: 1,
            url: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Image+1',
            name: 'Character Portrait 1',
            tags: ['character', 'portrait', 'red'],
            description: 'A character portrait with red theme'
        },
        {
            id: 2,
            url: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Image+2',
            name: 'Artifact Icon 1',
            tags: ['artifact', 'icon', 'blue'],
            description: 'An artifact icon with blue theme'
        },
        {
            id: 3,
            url: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Image+3',
            name: 'Weapon Image 1',
            tags: ['weapon', 'sword', 'blue'],
            description: 'A sword weapon image'
        },
        {
            id: 4,
            url: 'https://via.placeholder.com/300x200/F9CA24/FFFFFF?text=Image+4',
            name: 'Background 1',
            tags: ['background', 'landscape', 'yellow'],
            description: 'A landscape background'
        },
        {
            id: 5,
            url: 'https://via.placeholder.com/300x200/6C5CE7/FFFFFF?text=Image+5',
            name: 'Character Portrait 2',
            tags: ['character', 'portrait', 'purple'],
            description: 'A character portrait with purple theme'
        },
        {
            id: 6,
            url: 'https://via.placeholder.com/300x200/A8E6CF/FFFFFF?text=Image+6',
            name: 'Artifact Icon 2',
            tags: ['artifact', 'icon', 'green'],
            description: 'An artifact icon with green theme'
        }
    ];

    const mockTags = [
        'character', 'portrait', 'artifact', 'icon', 'weapon', 
        'sword', 'background', 'landscape', 'red', 'blue', 
        'yellow', 'purple', 'green'
    ];

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(apiEndpoint);
            // const data = await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setImages(mockImages);
            setAvailableTags(mockTags);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint]);

    const searchImages = useCallback(async (term, tags) => {
        setLoading(true);
        try {
            // TODO: Replace with actual search API call
            // const response = await fetch(`${apiEndpoint}/search?q=${term}&tags=${tags.join(',')}`);
            // const data = await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            let filtered = mockImages;
            
            if (term) {
                filtered = filtered.filter(img => 
                    img.name.toLowerCase().includes(term.toLowerCase()) ||
                    img.description.toLowerCase().includes(term.toLowerCase())
                );
            }
            
            if (tags.length > 0) {
                filtered = filtered.filter(img => 
                    tags.every(tag => img.tags.includes(tag))
                );
            }
            
            setFilteredImages(filtered);
        } catch (error) {
            console.error('Error searching images:', error);
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSelectedTags([]);
    }, []);

    const startIndex = page * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

    return {
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
    };
}
