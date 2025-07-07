import { closestCenter, DndContext, DragOverlay, rectIntersection, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState, useRef } from 'react';
import SortableStat from "./SortableStat";
import { Box, Paper, Typography } from '@mui/material'; 

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
                const insertIndex = targetArr.length; // Always insert at the end for now
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
                const newIndex = arr.findIndex(stat => stat.id === over.id);
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
        <Box>
            <DndContext
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Paper elevation={3} sx={{ p: 2, width: '400px', mx: 'auto' }}>
                    <Typography variant="h6" gutterBottom>Main Stats</Typography>
                    <DroppableContainer
                        id="mainStats"
                        isEmpty={allStats.mainStats.length === 0}
                        isOver={overId === 'mainStats'}
                    >
                        <SortableContext items={allStats.mainStats.map(stat => stat.id)} strategy={verticalListSortingStrategy}>
                            {allStats.mainStats.map((stat) => (
                                <div key={stat.id}>
                                    <SortableStat
                                        stat={stat}
                                        onChangeValue={handleChange}
                                        onTogglePercentage={togglePercentage}
                                        data-id={stat.id}
                                    />
                                </div>
                            ))}
                        </SortableContext>
                    </DroppableContainer>
                    <Box my={2}><hr style={{ border: 'none', borderTop: '2px solid #eee' }} /></Box>
                    <Typography variant="h6" gutterBottom>Sub Stats</Typography>
                    <DroppableContainer
                        id="subStats"
                        isEmpty={allStats.subStats.length === 0}
                        isOver={overId === 'subStats'}
                    >
                        <SortableContext items={allStats.subStats.map(stat => stat.id)} strategy={verticalListSortingStrategy}>
                            {allStats.subStats.map((stat) => (
                                <div key={stat.id}>
                                    <SortableStat
                                        stat={stat}
                                        onChangeValue={handleChange}
                                        onTogglePercentage={togglePercentage}
                                        data-id={stat.id}
                                    />
                                </div>
                            ))}
                        </SortableContext>
                    </DroppableContainer>
                </Paper>
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
        </Box>
    );
}

export default ArtifactCardBoxTmp;