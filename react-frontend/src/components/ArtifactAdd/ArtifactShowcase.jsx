import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { Box, Divider, Paper } from '@mui/material'; 
import { useArtifactStats } from '../../hooks/useArtifactStats';
import { useDragHandlers } from '../../hooks/useDragHandlers';
import StatSection from './StatSection';
import DragPreview from './DragPreview';

function ArtifactShowcase({ allStats, setAllStats, nextIdRef, apiGameData }) {
    const {
        findContainer, findStat, handleChange, togglePercentage, handleStatChange,
    } = useArtifactStats({ allStats, setAllStats, nextIdRef });

    const {
        activeId, overId, handleDragStart, handleDragOver, handleDragEnd
    } = useDragHandlers({ allStats, setAllStats, findContainer });

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
                    <StatSection 
                        title={"Main Stats"} 
                        statsKey={"mainStats"} 
                        stats={allStats.mainStats}
                        apiGameData={apiGameData.filter((s) => s.statTypeName === 'Main')}
                        onChangeValue={handleChange}
                        onTogglePercentage={togglePercentage}
                        onGameStatChange={handleStatChange}
                    />
                    <Divider sx={{ my: 1.5, borderColor: 'divider', opacity: 0.7, }} />
                    <StatSection 
                        title={"Sub Stats"} 
                        statsKey={"subStats"} 
                        stats={allStats.subStats}
                        apiGameData={apiGameData.filter((s) => s.statTypeName === 'Sub')}
                        onChangeValue={handleChange}
                        onTogglePercentage={togglePercentage}
                        onGameStatChange={handleStatChange}
                    />
                </Paper>
                <DragOverlay>
                    {activeId ? (
                        <DragPreview stat={findStat(activeId)} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </Box>
    );
}

export default ArtifactShowcase;