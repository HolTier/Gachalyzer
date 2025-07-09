import { useRef, useState } from "react";

export function useArtifactStats(initialStats) {
    const nextIdRef = useRef(1000);
    // Helper function to add IDs to stats
    const addIdsToStats = (statsArray) => {
        return statsArray.map(stat => {
            if (!stat.id) {
                const newId = `stat-${nextIdRef.current}`;
                nextIdRef.current += 1;
                return { ...stat, id: newId };
            }
            return stat;
        });
    };
    
    const [allStats, setAllStats] = useState({
            mainStats: addIdsToStats(initialStats.filter((s) => s.statType === 'MainStat')),
            subStats: addIdsToStats(initialStats.filter((s) => s.statType === 'SubStat')),
    });

    const findContainer = (id) => {
        // Check if it's a container ID
        if (id === 'mainStats' || id === 'subStats') {
            return id;
        }
        // Check if it's a stat ID
        return Object.keys(allStats).find((key) => 
            allStats[key].some(stat => stat.id === id)
        );
    };

    const findStat = (id) => {
        const container = findContainer(id);
        if (!container) return null;
        return allStats[container].find(stat => stat.id === id);
    };

    // Function to add a new stat with auto-generated ID
    const addNewStat = (statType, statData) => {
        const newStat = {
            ...statData,
            id: `stat-${nextIdRef.current}`,
            statType
        };
        nextIdRef.current += 1;

        setAllStats(prev => ({
            ...prev,
            [statType === 'MainStat' ? 'mainStats' : 'subStats']: [
                ...prev[statType === 'MainStat' ? 'mainStats' : 'subStats'],
                newStat
            ]
        }));
    };

    // Handler functions for SortableStat
    const handleChange = (statId, newValue) => {
        setAllStats(prev => {
            const containerKey = findContainer(statId);
            if (!containerKey) return prev;

            return {
                ...prev,
                [containerKey]: prev[containerKey].map(stat =>
                    stat.id === statId ? { ...stat, value: newValue } : stat
                )
            };
        });
    };

    const togglePercentage = (statId) => {
        setAllStats(prev => {
            const containerKey = findContainer(statId);
            if (!containerKey) return prev;

            return {
                ...prev,
                [containerKey]: prev[containerKey].map(stat =>
                    stat.id === statId ? { ...stat, isPercentage: !stat.isPercentage } : stat
                )
            };
        });
    };

    const handleStatChange = (statId, newValue) => {
        setAllStats(prev => {
            const containerKey = findContainer(statId);
            if (!containerKey) return prev;

            return {
                ...prev,
                [containerKey]: prev[containerKey].map(s => 
                    s.id === statId ? { ...s, stat: newValue} : s
                )
            };
        });
    };

    return {
        allStats,
        setAllStats,
        findContainer,
        findStat,
        handleChange,
        togglePercentage,
        handleStatChange,
        addNewStat,
        nextIdRef
    };
}