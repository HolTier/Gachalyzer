import { useRef, useState } from "react";

export function useAllStatsState(initialStats) {
    const nextIdRef = useRef(1000);

    const addIdsToStats = (statsArray) => {
        return statsArray.map(stat => {
            if (!stat.id) {
                const newId = `stat-${nextIdRef.current++}`;
                return { ...stat, id: newId };
            }
            return stat;
        });
    };

    const [allStats, setAllStats] = useState({
        mainStats: addIdsToStats(initialStats.filter((s) => s.statType === 'MainStat')),
        subStats: addIdsToStats(initialStats.filter((s) => s.statType === 'SubStat')),
    });

    const [costValue, setCostValue] = useState(
        initialStats.find((s) => s.statType === 'Cost')?.rawValue || null
    );

    return { allStats, setAllStats, nextIdRef, costValue, setCostValue };
}