import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DroppableContainer from './DroppableContainer';
import SortableStat from './SortableStat';
import { Typography, Box, Fade, Button } from '@mui/material'
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

    const handleAddStat = () => {
        if (statsKey === 'costStats') {
            if (stats.length >= 1) {
                return;
            }
            const statType = 'Cost';
            const statData = {
                stat: 'Cost',
                value: 0,
                rawValue: '0',
                isPercentage: false
            };
            onAddStat(statType, statData);
        } else {
            onAddStat();
        }
    };

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

                {/* Hover-sensitive bottom area */}
                <Box
                    onMouseEnter={() => setHoverBottom(true)}
                    onMouseLeave={() => setHoverBottom(false)}
                    sx={{
                        height: 36,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 0.5,
                    }}
                >
                    <Fade in={hoverBottom && !isDragging && !(statsKey === 'costStats' && stats.length >= 1)}>
                        <Button
                            size="small"
                            variant="text"
                            onClick={handleAddStat}
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
                </Box>
            </DroppableContainer>
        </>
    );
};

export default StatSection;