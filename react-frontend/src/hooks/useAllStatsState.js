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

    const costStats = initialStats.filter((s) => s.statType === 'Cost');
    if (costStats.length === 0) {
        costStats.push({
            stat: 'Cost',
            statType: 'Cost',
            rawValue: '0',
            value: 0,
            isPercentage: false
        });
    }

    const [allStats, setAllStats] = useState({
        mainStats: addIdsToStats(initialStats.filter((s) => s.statType === 'MainStat')),
        subStats: addIdsToStats(initialStats.filter((s) => s.statType === 'SubStat')),
        costStats: addIdsToStats(costStats),
    });

    return { allStats, setAllStats, nextIdRef };
}