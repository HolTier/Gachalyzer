import { useEffect, useRef } from 'react';
import { API_CONFIG } from '../config/api';

export const useCharacterFormPopulation = ({
    selectedCharacter,
    isUpdate,
    setValue,
    reset,
    getValues,
    statTypes,
    setDropzoneKey,
    setIconDropzoneKey,
    setInitialIconMode,
    setInitialImageMode,
    setInitialBreakpoints
}) => {
    const statValuesRef = useRef(new Map());

    useEffect(() => {
        console.log("useEffect triggered:", { selectedCharacter, isUpdate });
        if (selectedCharacter && isUpdate) {
            console.log("Populating form with character data:", selectedCharacter);
            console.log("Current form values before reset:", getValues());
            
            reset({
                name: "",
                game: "",
                element: "",
                weapon: "",
                image: null,
                icon: null,
                statScalings: []
            });
            
            setInitialIconMode('upload');
            setInitialImageMode('upload');
            setInitialBreakpoints(null);
            
            console.log("Form values after reset:", getValues());
            
            setTimeout(() => {
                console.log("Setting form values:", {
                    name: selectedCharacter.name,
                    game: selectedCharacter.gameId,
                    element: selectedCharacter.characterElementId,
                    weapon: selectedCharacter.characterWeaponTypeId
                });
                
                setValue("name", selectedCharacter.name || "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                setValue("game", selectedCharacter.gameId || "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                setValue("element", selectedCharacter.characterElementId || "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                setValue("weapon", selectedCharacter.characterWeaponTypeId || "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                
                console.log("Form values after setting basic info:", getValues());
                
                if (selectedCharacter.imageUrl) {
                    const imageData = {
                        isServerImage: true,
                        serverId: selectedCharacter.imageId,
                        url: `${API_CONFIG.SHORT_URL}${selectedCharacter.imageUrl}`,
                        name: "server_image",
                        type: "server/image" 
                    };
                    console.log("Setting image data:", imageData);
                    setValue("image", imageData, { shouldValidate: true });
                    setInitialImageMode('server');
                } else {
                    setInitialImageMode('upload');
                }
                
                if (selectedCharacter.iconUrl) {
                    const iconData = {
                        isServerImage: true,
                        serverId: selectedCharacter.iconId,
                        url: `${API_CONFIG.SHORT_URL}${selectedCharacter.iconUrl}`,
                        name: "server_icon",
                        type: "server/image" 
                    };
                    console.log("Setting icon data:", iconData);
                    setValue("icon", iconData, { shouldValidate: true });
                    setInitialIconMode('server');
                } else {
                    setInitialIconMode('upload');
                }
                
                console.log("Final form values:", getValues());
                
                statValuesRef.current.clear();
                if (selectedCharacter.characterStatScalingShowDtos && Array.isArray(selectedCharacter.characterStatScalingShowDtos)) {
                    console.log("Processing stat scalings:", selectedCharacter.characterStatScalingShowDtos);
                    
                    const breakpointSet = new Set();
                    const majorBreakpoints = new Set();
                    
                    selectedCharacter.characterStatScalingShowDtos.forEach(scaling => {
                        breakpointSet.add(scaling.level);
                        if (scaling.isBreakpoint) {
                            majorBreakpoints.add(scaling.level);
                        }
                    });
                    
                    const characterBreakpoints = Array.from(breakpointSet)
                        .sort((a, b) => a - b)
                        .map(level => ({
                            level: level,
                            major: majorBreakpoints.has(level)
                        }));
                    
                    console.log("Extracted breakpoints:", characterBreakpoints);
                    
                    if (characterBreakpoints.length > 0) {
                        setInitialBreakpoints(characterBreakpoints);
                    }
                    
                    const statTypeGroups = new Map();
                    
                    selectedCharacter.characterStatScalingShowDtos.forEach(scaling => {
                        const statTypeName = scaling.statTypeName;
                        if (!statTypeGroups.has(statTypeName)) {
                            statTypeGroups.set(statTypeName, []);
                        }
                        statTypeGroups.get(statTypeName).push(scaling);
                    });
                    
                    console.log("Stat type groups:", statTypeGroups);
                    console.log("Available stat types:", statTypes);
                    
                    if (statTypes && Array.isArray(statTypes)) {
                        statTypes.forEach(statType => {
                            const matchingScalings = statTypeGroups.get(statType.name);
                            if (matchingScalings && matchingScalings.length > 0) {
                                if (!statValuesRef.current.has(statType.id)) {
                                    statValuesRef.current.set(statType.id, {});
                                }
                                
                                matchingScalings.forEach(scaling => {
                                    const breakpointKey = scaling.isBreakpoint ? `${scaling.level}+` : scaling.level.toString();
                                    statValuesRef.current.get(statType.id)[breakpointKey] = scaling.value;
                                });
                            }
                        });
                    }
                    console.log("Updated stat values ref:", statValuesRef.current);
                } else {
                    setInitialBreakpoints(null);
                }
                
                setDropzoneKey(prev => prev + 1);
                setIconDropzoneKey(prev => prev + 1);
            }, 100);
        }
    }, [selectedCharacter, isUpdate, setValue, reset, statTypes, getValues, setDropzoneKey, setIconDropzoneKey, setInitialIconMode, setInitialImageMode, setInitialBreakpoints]);

    return { statValuesRef };
};
