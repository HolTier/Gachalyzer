import { useMemo } from 'react';

export function useHierarchicalCategories(filterOptions) {
    return useMemo(() => {
        const hierarchy = {};
        
        filterOptions.forEach(option => {
            const field = option.field || 'Other';
            const mainCategory = option.main;
            
            if (mainCategory) {
                if (!hierarchy[mainCategory]) {
                    hierarchy[mainCategory] = {};
                }
                
                const fieldMappings = {
                    'characterElementName': 'Elements',
                    'characterWeaponTypeName': 'Weapons',
                    'artifactSetName': 'Artifact Sets',
                    'artifactTypeName': 'Artifact Types'
                };
                const fieldDisplay = fieldMappings[field] || field;
                
                if (!hierarchy[mainCategory][fieldDisplay]) {
                    hierarchy[mainCategory][fieldDisplay] = [];
                }
                hierarchy[mainCategory][fieldDisplay].push(option);
            } else {
                const fieldMappings = {
                    'gameName': 'Games',
                    'characterElementName': 'Elements',
                    'characterWeaponTypeName': 'Weapons',
                    'artifactSetName': 'Artifact Sets',
                    'artifactTypeName': 'Artifact Types'
                };
                const fieldDisplay = fieldMappings[field] || field;
                
                if (!hierarchy[fieldDisplay]) {
                    hierarchy[fieldDisplay] = [];
                }
                hierarchy[fieldDisplay].push(option);
            }
        });
        
        return hierarchy;
    }, [filterOptions]);
}
