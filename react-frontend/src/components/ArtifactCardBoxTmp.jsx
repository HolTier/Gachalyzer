import { closestCenter, DndContext, DragOverlay, pointerWithin, rectIntersection, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState, useRef } from 'react';
import SortableStat from "./SortableStat";
import { Box, Paper, Typography } from '@mui/material'; // or whatever UI library you're using

// Droppable container component
function DroppableContainer({ id, children, isEmpty, isOver }) {
    const { setNodeRef } = useDroppable({ id });
    
    return (
        <Box
            ref={setNodeRef}
            sx={{
                minHeight: isEmpty ? '100px' : 'auto',
                border: isEmpty && isOver ? '2px dashed #1976d2' : 'none',
                borderRadius: 1,
                backgroundColor: isEmpty && isOver ? '#f0f8ff' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            {isEmpty && isOver && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100px',
                        color: '#1976d2',
                        fontStyle: 'italic'
                    }}
                >
                    Drop here
                </Box>
            )}
            {children}
        </Box>
    );
}

function ArtifactCardBoxTmp({ stats }) {
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
        mainStats: addIdsToStats(stats.filter((s) => s.statType === 'MainStat')),
        subStats: addIdsToStats(stats.filter((s) => s.statType === 'SubStat')),
    });

    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);

    // Track drag state
    const [dragState, setDragState] = useState({
        activeId: null,
        sourceList: null,
        sourceIndex: null,
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

    const handleDragStart = (event) => {
        const { id } = event.active;
        const sourceList = findContainer(id);
        const sourceIndex = allStats[sourceList].findIndex(stat => stat.id === id);
        setDragState({ activeId: id, sourceList, sourceIndex });
        setActiveId(id);
    };

    // Helper to get insert index based on pointer position
    const getInsertIndex = (over, containerList, event) => {
        // If hovering over the container itself (not an item), always insert at end
        if (!over || over.id === 'mainStats' || over.id === 'subStats') return containerList.length;
        const overIndex = containerList.findIndex(stat => stat.id === over.id);
        const overElement = document.querySelector(`[data-id='${over.id}']`);
        if (!overElement) return overIndex;
        const rect = overElement.getBoundingClientRect();
        // Use event.clientY if available, else fallback to event.delta
        const pointerY = event.clientY !== undefined ? event.clientY : (event.delta ? event.delta.y + rect.top : rect.top);
        const midY = rect.top + rect.height / 2;
        // If pointer is below the last item, insert at end, but add a threshold for easier above-last-item drop
        if (overIndex === containerList.length - 1) {
            const threshold = 10; // px from bottom
            if (pointerY > rect.bottom - threshold) {
                return containerList.length;
            } else if (pointerY < midY) {
                return overIndex;
            } else {
                return overIndex + 1;
            }
        }
        if (pointerY < midY) return overIndex; // insert above
        return overIndex + 1; // insert below
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        setOverId(over ? over.id : null);
        if (!over || active.id === over.id) return;

        const sourceList = findContainer(active.id);
        let targetList = findContainer(over.id);
        if (!sourceList) return;
        if (!targetList) return;

        // Only handle moving between containers here (live reparenting)
        if (sourceList !== targetList) {
            setAllStats((prev) => {
                const sourceArr = [...prev[sourceList]];
                const targetArr = [...prev[targetList]];
                const statToMove = sourceArr.find(stat => stat.id === active.id);
                const updatedSource = sourceArr.filter(stat => stat.id !== active.id);
                let insertIndex = (over.id === 'mainStats' || over.id === 'subStats')
                    ? targetArr.length
                    : getInsertIndex(over, targetArr, event);
                // Prevent duplicate insert if already present in target
                if (targetArr.some(stat => stat.id === active.id)) {
                    return prev;
                }
                const updatedTarget = [...targetArr];
                updatedTarget.splice(insertIndex, 0, {
                    ...statToMove,
                    statType: targetList === 'mainStats' ? 'MainStat' : 'SubStat',
                });
                return {
                    ...prev,
                    [sourceList]: updatedSource,
                    [targetList]: updatedTarget,
                };
            });
            setDragState((state) => ({ ...state, sourceList: targetList }));
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setOverId(null);
        // Only handle reordering within the same container
        if (!over || active.id === over.id) {
            setDragState({ activeId: null, sourceList: null, sourceIndex: null });
            return;
        }
        const sourceList = findContainer(active.id);
        const targetList = findContainer(over.id);
        if (sourceList && targetList && sourceList === targetList) {
            setAllStats((prev) => {
                const arr = [...prev[sourceList]];
                const oldIndex = arr.findIndex(stat => stat.id === active.id);
                let newIndex;
                // If dropped over the container, always insert at end
                if (over.id === sourceList) {
                    newIndex = arr.length - 1;
                } else {
                    newIndex = getInsertIndex(over, arr, event);
                    // If dropped over the last item and pointer is below, insert at end
                    const overIndex = arr.findIndex(stat => stat.id === over.id);
                    if (overIndex === arr.length - 1 && newIndex > overIndex) {
                        newIndex = arr.length - 1;
                    }
                }
                // Remove index adjustment: always use getInsertIndex result for consistency with live drop indicator
                if (newIndex >= arr.length) {
                    newIndex = arr.length - 1;
                }
                if (oldIndex === newIndex) return prev;
                const reordered = arrayMove(arr, oldIndex, newIndex);
                return {
                    ...prev,
                    [sourceList]: reordered,
                };
            });
        }
        setDragState({ activeId: null, sourceList: null, sourceIndex: null });
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

    return (
        <DndContext
            collisionDetection={rectIntersection} 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <Box display="flex" gap={4}>
                {Object.entries(allStats).map(([key, list]) => (
                    <Paper key={key} elevation={3} sx={{ p: 2, width: '250px' }}>
                        <Typography variant="h6" gutterBottom>
                            {key === 'mainStats' ? 'Main Stats' : 'Sub Stats'}
                        </Typography>
                        
                        <DroppableContainer 
                            id={key} 
                            isEmpty={list.length === 0}
                            isOver={overId === key}
                        >
                            <SortableContext items={list.map(stat => stat.id)} strategy={verticalListSortingStrategy}>
                                {list.map((stat, index) => (
                                    <div key={stat.id}>
                                        <SortableStat
                                            stat={stat}
                                            onChangeValue={handleChange}
                                            onTogglePercentage={togglePercentage}
                                            data-id={stat.id}
                                        />
                                    </div>
                                ))}
                                {/* No indicator */}
                            </SortableContext>
                        </DroppableContainer>
                    </Paper>
                ))}
            </Box>
            
            <DragOverlay>
                {activeId ? (
                    <Box
                        sx={{
                            opacity: 0.8,
                            transform: 'rotate(5deg)',
                            border: '2px dashed #1976d2',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1
                        }}
                    >
                        <SortableStat
                            stat={findStat(activeId)}
                            onChangeValue={() => {}}
                            onTogglePercentage={() => {}}
                        />
                    </Box>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default ArtifactCardBoxTmp;