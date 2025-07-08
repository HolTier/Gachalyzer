import { closestCenter, DndContext, DragOverlay, pointerWithin, rectIntersection, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState, useRef, useEffect } from 'react';
import SortableStat from "./SortableStat";
import { Box, Divider, Paper, Typography } from '@mui/material'; 

function DroppableContainer({ id, children, isEmpty, isOver }) {
    const { setNodeRef } = useDroppable({ id });
    
    return (
        <Box
            ref={setNodeRef}
            sx={{
                minHeight: isEmpty ? '80px' : 'auto',
                border: isEmpty && isOver ? '2px dashed' : 'none',
                borderColor: isEmpty && isOver ? 'primary.main' : 'transparent',
                borderRadius: 2,
                backgroundColor: isEmpty && isOver ? 'primary.50' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.75,
                padding: isEmpty ? 1 : 0,
                transition: 'all 0.2s ease-in-out',
            }}
        >
            {isEmpty && isOver && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80px',
                        color: 'primary.main',
                        fontStyle: 'italic',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                    }}
                >
                    Drop stat here
                </Box>
            )}
            {children}
        </Box>
    );
}

// TODO: Split this component into smaller parts for better readability and maintainability
// This component handles the artifact card box with sortable stats
function ArtifactCardBoxTmp({ stats, apiGameData }) {
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

    // TODO: Replace with game parametrs
    const apiMainGameData = (apiGameData || []).filter(s => s.gameName === 'Wuthering Waves' && s.statTypeName === 'Main');
    const apiSubGameData = (apiGameData || []).filter(s => s.gameName === 'Wuthering Waves' && s.statTypeName === 'Sub');

    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);

    // Track drag state
    const [dragState, setDragState] = useState({
        activeId: null,
        sourceList: null,
        sourceIndex: null,
    });

    const renderStatSection = (title, statsKey, gameData) => (
        <>
            <Typography 
                variant="subtitle2" 
                sx={{ 
                    mb: 1,
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: 'text.primary',
                    letterSpacing: '0.02em',
                }}
            >
                {title}
            </Typography>
            <DroppableContainer
                id={statsKey}
                isEmpty={allStats[statsKey].length === 0}
                isOver={overId === statsKey}
            >
                <SortableContext
                    items={allStats[statsKey].map(stat => stat.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {allStats[statsKey].map((stat) => (
                        <SortableStat
                        key={stat.id}
                        stat={stat}
                        onChangeValue={handleChange}
                        onTogglePercentage={togglePercentage}
                        onGameStatChange={handleStatChange}
                        data-id={stat.id}
                        apiGameData={gameData}
                        />
                    ))}
                </SortableContext>
            </DroppableContainer>
        </>
    );

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
                
                // Prevent duplicates
                if (targetArr.some(stat => stat.id === active.id)) return prev;

                // Calculate insertion index
                const overIndex = targetArr.findIndex(stat => stat.id === over.id);
                const insertIndex = overIndex >= 0 ? overIndex : targetArr.length;

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

    return (
        <Box>
            <DndContext
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Paper elevation={3} sx={{ 
                        p: 2, 
                        width: '400px', 
                        mx: 'auto', 
                        backgroundColor: 'background.paper', 
                        color: 'text.primary', 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    {renderStatSection("Main Stats", "mainStats", apiMainGameData)}
                    <Divider sx={{ 
                        my: 1.5, 
                        borderColor: 'divider',
                        opacity: 0.7,
                    }} />
                    {renderStatSection("Sub Stats", "subStats", apiSubGameData)}
                </Paper>
                <DragOverlay>
                    {activeId ? (
                        <Paper
                            elevation={8}
                            sx={{
                                pointerEvents: 'none',
                                opacity: 0.95,
                                transform: 'rotate(3deg) scale(1.02)',
                                border: '2px solid',
                                borderColor: 'primary.main',
                                backgroundColor: 'background.paper',
                                borderRadius: 2,
                                p: 1,
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            }}
                        >
                            <SortableStat
                                stat={findStat(activeId)}
                                apiGameData={null}
                                onChangeValue={() => {}}
                                onTogglePercentage={() => {}}
                            />
                        </Paper>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </Box>
    );
}

export default ArtifactCardBoxTmp;