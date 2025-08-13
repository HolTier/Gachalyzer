import { useState, useEffect } from 'react';

export const useImageMode = (initialMode = 'upload') => {
    const [mode, setMode] = useState(initialMode);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const handleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setMode(newMode);
        }
    };

    return {
        mode,
        setMode,
        handleModeChange
    };
};
