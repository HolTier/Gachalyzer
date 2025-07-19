import { Box, Card, CardContent, Divider, ListItem } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import SortableStat from "./ArtifactAdd/SortableStat";
import { closestCenter, DndContext, DragOverlay, useDroppable } from "@dnd-kit/core";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

function DroppableList({ id, children }) {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <Box ref={setNodeRef}>
            {children}
        </Box>
    );
}

function ArtifactCardBox ({ stats }) {
    const nextIdRef = useRef(1000);
    const createStat = (data) => {
        // If data is not an array, return an empty array
        if (!Array.isArray(data)) return [];
        // Otherwise, map through the array and add keys
        return data.map(item => ({
            ...item,
            id: `custom-${nextIdRef.current++}`,
            key: `custom-${nextIdRef.current}`,
        }));
    };

    const [allStats, setAllStats] = useState(createStat(stats));
    const [mainStats, setMainStats] = useState(allStats.filter(s => s.statType === 'MainStat'))
    const [subStats, setSubStats] = useState(allStats.filter(s => s.statType === 'SubStat'))
    const [activeDragOver, setActiveDragOver] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const lastOverRef = useRef(null);
    const [dragOverInfo, setDragOverInfo] = useState(null);

    const handleChange = (key, newRawValue) => {
        setAllStats((prev) =>
            prev.map((item) =>
            item.key === key
                ? { ...item, rawValue: newRawValue, value: parseFloat(newRawValue) }
                : item
            )
        );
    };

    const togglePercentage = (key) => {
        setAllStats((prev) =>
            prev.map((item) => {
            if (item.key !== key) return item;
            const newIsPercentage = !item.isPercentage;
            return {
                ...item,
                isPercentage: newIsPercentage,
                rawValue: newIsPercentage ? `${item.value}%` : `${item.value}`,
            };
            })
        );
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
        })
    );

    const findContainer = (id) => {
        if (id === 'MainList' || mainStats.some(item => item.key === id)) return 'MainList';
        if (id === 'SubList' || subStats.some(item => item.key === id)) return 'SubList';
        return null;
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        setDragOverInfo(null);

        // Find and set the active drag item
        const item = 
            mainStats.find(stat => stat.key === active.id) || 
            subStats.find(stat => stat.key === active.id);
        setActiveDragOver(item);
    };

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setActiveId(null);
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer) {
            setActiveId(null);
            return;
        }

        let activeItem = null;
        if (activeContainer === 'MainList') {
            activeItem = mainStats.find(item => item.key === active.id);
        } else {
            activeItem = subStats.find(item => item.key === active.id);
        }

        if (!activeItem) {
            setActiveId(null);
            return;
        }

        if (activeContainer === overContainer) {
            // same list reordering
            if (activeContainer === 'MainList') {
                const oldIndex = mainStats.findIndex(item => item.key === active.id);
                const newIndex = over.id === 'MainList' 
                    ? mainStats.length 
                    : mainStats.findIndex(item => item.key === over.id);
                setMainStats(arrayMove(mainStats, oldIndex, newIndex));
            } else {
                const oldIndex = subStats.findIndex(item => item.key === active.id);
                const newIndex = over.id === 'SubList' 
                    ? subStats.length 
                    : subStats.findIndex(item => item.key === over.id);
                setSubStats(arrayMove(subStats, oldIndex, newIndex));
            }
        } else {
            // moving between lists
            if (activeContainer === 'MainList') {
                setMainStats(mainStats.filter(item => item.key !== active.id));
                setSubStats((items) => {
                    const overIndex = over.id === 'SubList' 
                        ? items.length 
                        : items.findIndex(item => item.key === over.id);
                    const insertIndex = overIndex >= 0 ? overIndex : items.length;
                    const newItems = [...items];
                    newItems.splice(insertIndex, 0, { ...activeItem, statType: 'SubStat' });
                    return newItems;
                });
            } else {
                setSubStats(subStats.filter(item => item.key !== active.id));
                setMainStats((items) => {
                    const overIndex = over.id === 'MainList' 
                        ? items.length 
                        : items.findIndex(item => item.key === over.id);
                    const insertIndex = overIndex >= 0 ? overIndex : items.length;
                    const newItems = [...items];
                    newItems.splice(insertIndex, 0, { ...activeItem, statType: 'MainStat' });
                    return newItems;
                });
            }
        }

        setDragOverInfo(null);
        setActiveId(null);
        setActiveDragOver(null);
    }, [mainStats, subStats]);

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setDragOverInfo(null);
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);
        if (!activeContainer || !overContainer) {
            setDragOverInfo(null);
            return;
        }

        const overList = overContainer === 'MainList' ? mainStats : subStats;
        let overIndex;
        
        if (over.id === overContainer) {
            overIndex = overList.length;
        } else {
            // Dragging over an item
            const itemIndex = overList.findIndex(item => item.key === over.id);
            if (itemIndex === -1) {
                setDragOverInfo(null);
                return;
            }
            
            if (activeContainer === overContainer) {
                const activeIndex = overList.findIndex(item => item.key === active.id);
                if (activeIndex !== -1) {
                    // If dragging down, insert after the target item
                    // If dragging up, insert before the target item
                    overIndex = activeIndex < itemIndex ? itemIndex + 1 : itemIndex;
                } else {
                    overIndex = itemIndex;
                }
            } else {
                // Moving between containers, always insert before the hovered item
                overIndex = itemIndex;
            }
        }

        setDragOverInfo({
            activeId: active.id,
            overId: over.id,
            targetContainer: overContainer,
            overIndex,
        });
    };
    return (
        <Card sx={{ maxWidth: 700, minWidth: 300, p: 1 }}>
            <CardContent>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                >
                    <DroppableList id="MainList">
                        <SortableContext 
                            items={mainStats.map(s => s.key)}
                            strategy={verticalListSortingStrategy}
                        >
                            {mainStats.length === 0 ? (
                                <Box
                                    sx={{
                                        border: '1px dashed gray',
                                        borderRadius: 1,
                                        p: 1,
                                        my: 1,
                                        textAlign: 'center',
                                        color: 'gray',
                                    }}
                                >
                                    Drop a stat here
                                </Box>
                            ) : (
                                <>
                                    {mainStats.map((stat, index) => {
                                        // Filter out the currently dragged item for placeholder calculation
                                        const filteredStats = mainStats.filter(s => s.key !== activeId);
                                        const adjustedIndex = activeId && dragOverInfo?.targetContainer === 'MainList' 
                                            ? filteredStats.findIndex(s => s.key === stat.key)
                                            : index;
                                        
                                        const isPlaceholderBefore = dragOverInfo &&
                                            dragOverInfo.targetContainer === 'MainList' &&
                                            dragOverInfo.overIndex === adjustedIndex &&
                                            stat.key !== activeId;

                                        return (
                                            <Box key={stat.key} sx={{ position: 'relative' }}>
                                                {isPlaceholderBefore && (
                                                    <Box
                                                        sx={{
                                                            height: 48,
                                                            border: '2px dashed #aaa',
                                                            borderRadius: 1,
                                                            my: 0.5,
                                                            mx: 0.5,
                                                        }}
                                                    />
                                                )}
                                                {stat.key !== activeId && (
                                                    <SortableStat
                                                        stat={stat}
                                                        onChangeValue={handleChange}
                                                        onTogglePercentage={togglePercentage}
                                                    />
                                                )}
                                            </Box>
                                        );
                                    })}
                                    {/* Placeholder for dropping at the end */}
                                    {dragOverInfo &&
                                        dragOverInfo.targetContainer === 'MainList' &&
                                        dragOverInfo.overIndex >= (mainStats.filter(s => s.key !== activeId).length) && (
                                            <Box
                                                sx={{
                                                    height: 48,
                                                    border: '2px dashed #aaa',
                                                    borderRadius: 1,
                                                    my: 0.5,
                                                    mx: 0.5,
                                                }}
                                            />
                                        )}
                                </>
                            )}
                        </SortableContext>
                    </DroppableList>

                    <Divider sx={{ my: 1 }} />
                    
                    <DroppableList id="SubList">
                        <SortableContext 
                            items={subStats.map(s => s.key)}
                            strategy={verticalListSortingStrategy}
                        >
                            {subStats.length === 0 ? (
                                <Box
                                    sx={{
                                        border: '1px dashed gray',
                                        borderRadius: 1,
                                        p: 1,
                                        my: 1,
                                        textAlign: 'center',
                                        color: 'gray',
                                    }}
                                >
                                    Drop a stat here
                                </Box>
                            ) : (
                                <>
                                    {subStats.map((stat, index) => {
                                        // Filter out the currently dragged item for placeholder calculation
                                        const filteredStats = subStats.filter(s => s.key !== activeId);
                                        const adjustedIndex = activeId && dragOverInfo?.targetContainer === 'SubList' 
                                            ? filteredStats.findIndex(s => s.key === stat.key)
                                            : index;
                                        
                                        const isPlaceholderBefore = dragOverInfo &&
                                            dragOverInfo.targetContainer === 'SubList' &&
                                            dragOverInfo.overIndex === adjustedIndex &&
                                            stat.key !== activeId;

                                        return (
                                            <Box key={stat.key} sx={{ position: 'relative' }}>
                                                {isPlaceholderBefore && (
                                                    <Box
                                                        sx={{
                                                            height: 48,
                                                            border: '2px dashed #aaa',
                                                            borderRadius: 1,
                                                            my: 0.5,
                                                            mx: 0.5,
                                                        }}
                                                    />
                                                )}
                                                {stat.key !== activeId && (
                                                    <SortableStat
                                                        stat={stat}
                                                        onChangeValue={handleChange}
                                                        onTogglePercentage={togglePercentage}
                                                    />
                                                )}
                                            </Box>
                                        );
                                    })}
                                    {/* Placeholder for dropping at the end */}
                                    {dragOverInfo &&
                                        dragOverInfo.targetContainer === 'SubList' &&
                                        dragOverInfo.overIndex >= (subStats.filter(s => s.key !== activeId).length) && (
                                            <Box
                                                sx={{
                                                    height: 48,
                                                    border: '2px dashed #aaa',
                                                    borderRadius: 1,
                                                    my: 0.5,
                                                    mx: 0.5,
                                                }}
                                            />
                                        )}
                                </>
                            )}
                        </SortableContext>
                    </DroppableList>

                    <DragOverlay>
                        {activeDragOver ? (
                            <SortableStat
                                stat={activeDragOver}
                                dragOverlay
                                onChangeValue={handleChange}
                                onTogglePercentage={togglePercentage}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </CardContent>
        </Card>
    );
}

export default ArtifactCardBox;