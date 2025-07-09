import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import SortableStat from "./SortableStat";
import { Box, Divider, Paper } from '@mui/material'; 
import { useArtifactStats } from '../../hooks/useArtifactStats';
import { useDragHandlers } from '../../hooks/useDragHandlers';
import StatSection from './StatSection';

function ArtifactCardBoxTmp({ stats, apiGameData }) {
    const {
        allStats, setAllStats, findContainer, findStat,
        handleChange, tooglePercentage, handleStatChange, nextIdRef
    } = useArtifactStats(stats);

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
                        apiGameData={apiGameData}
                        onChangeValue={handleChange}
                        onTogglePercentage={tooglePercentage}
                        onGameStatChange={handleStatChange}
                    />
                    <Divider sx={{ my: 1.5, borderColor: 'divider', opacity: 0.7, }} />
                    <StatSection 
                        title={"Sub Stats"} 
                        statsKey={"subStats"} 
                        stats={allStats.subStats}
                        apiGameData={apiGameData}
                        onChangeValue={handleChange}
                        onTogglePercentage={tooglePercentage}
                        onGameStatChange={handleStatChange}
                    />
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