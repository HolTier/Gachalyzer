import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import DroppableContainer from './DroppableContainer';
import SortableStat from './SortableStat';
import { Typography, Box, Fade, Button } from '@mui/material'
import { Delete } from '@mui/icons-material';
import { useState } from 'react';

function StatSection({ 
    title, 
    statsKey, 
    stats = [], 
    apiGameData, 
    isOver, 
    onChangeValue, 
    onTogglePercentage, 
    onGameStatChange, 
    isDragging,
    onAddStat
}) {
    const [hoverBottom, setHoverBottom] = useState(false);
    const { setNodeRef: setDeleteRef, isOver: isOverDelete } = useDroppable({
        id: 'delete-zone'
    });

    return (
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
                isEmpty={stats.length === 0}
                isOver={isOver}
            >
                <SortableContext
                    items={stats.map(stat => stat.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {stats.map((stat) => (
                        <SortableStat
                            key={stat.id}
                            stat={stat}
                            onChangeValue={onChangeValue}
                            onTogglePercentage={onTogglePercentage}
                            onGameStatChange={onGameStatChange}
                            data-id={stat.id}
                            apiGameData={apiGameData}
                        />
                    ))}
                </SortableContext>

                <Box
                    ref={isDragging ? setDeleteRef : undefined}
                    onMouseEnter={() => setHoverBottom(true)}
                    onMouseLeave={() => setHoverBottom(false)}
                    sx={{
                        height: 36,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 0.5,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        ...(isDragging && {
                            border: '2px dashed',
                            borderColor: isOverDelete ? 'error.main' : 'error.light',
                            backgroundColor: isOverDelete ? 'error.light' : 'rgba(244, 67, 54, 0.04)',
                            color: isOverDelete ? 'error.contrastText' : 'error.main',
                        })
                    }}
                >
                    {isDragging ? (
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            opacity: isOverDelete ? 1 : 0.7,
                            transform: isOverDelete ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.2s ease-in-out'
                        }}>
                            <Delete fontSize="small" />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                Drop here to delete
                            </Typography>
                        </Box>
                    ) : (
                        <Fade in={hoverBottom}>
                            <Button
                                size="small"
                                variant="text"
                                onClick={onAddStat}
                                sx={{
                                    fontSize: '0.75rem',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 1.5,
                                }}
                            >
                                + Add Stat
                            </Button>
                        </Fade>
                    )}
                </Box>
            </DroppableContainer>
        </>
    );
};

export default StatSection;