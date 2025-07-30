import { useRef, useState } from "react";

export function useArtifactStats({allStats, setAllStats, nextIdRef}) {
    const findContainer = (id) => {
        if (id === 'mainStats' || id === 'subStats') {
            return id;
        }

        return Object.keys(allStats).find((key) => 
            allStats[key].some(stat => stat.id === id)
        );
    };

    const findStat = (id) => {
        const container = findContainer(id);
        if (!container) return null;
        return allStats[container].find(stat => stat.id === id);
    };

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

    const handleChange = (statId, newValue) => {
        setAllStats(prev => {
            const containerKey = findContainer(statId);
            if (!containerKey) return prev;

            return {
                ...prev,
                [containerKey]: prev[containerKey].map(stat => {
                    if (stat.id === statId) {
                        const isPercentage = stat.isPercentage;
                        const rawValue = isPercentage ? `${newValue}%` : `${newValue}`;
                        return { ...stat, value: newValue, rawValue };
                    }
                    return stat;
                })
            };
        });
    };

    const togglePercentage = (statId) => {
        setAllStats(prev => {
            const containerKey = findContainer(statId);
            if (!containerKey) return prev;

            return {
                ...prev,
                [containerKey]: prev[containerKey].map(stat => {
                    if (stat.id === statId) {
                        const isPercentage = !stat.isPercentage;
                        const rawValue = isPercentage ? `${stat.value ?? ''}%` : `${stat.value ?? ''}`;
                        return { ...stat, isPercentage, rawValue };
                    }
                    return stat;
                })
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

    const deleteStat = (statId) => {
        setAllStats(prev => {
            const containerKey = findContainer(statId);
            if (!containerKey) return prev;

            return {
                ...prev,
                [containerKey]: prev[containerKey].filter(stat => stat.id !== statId)
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
        deleteStat,
        nextIdRef
    };
}