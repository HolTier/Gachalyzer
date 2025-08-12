import { useMemo } from 'react';

export function useInitialExpandedState(filterOptions) {
    return useMemo(() => {
        const initialExpanded = {};
        const allCategories = [...new Set(filterOptions.map(opt => opt.main || 'Top Level'))];
        allCategories.forEach(category => {
            if (category !== 'Top Level') {
                initialExpanded[category] = true;
            }
        });

        ['Games', 'Elements', 'Weapons'].forEach(category => {
            initialExpanded[category] = true;
        });
        return initialExpanded;
    }, [filterOptions]);
}
