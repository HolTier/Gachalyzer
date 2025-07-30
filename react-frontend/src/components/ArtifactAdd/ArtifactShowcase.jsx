import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { Box, Divider, Paper } from '@mui/material'; 
import { useArtifactStats } from '../../hooks/useArtifactStats';
import { useDragHandlers } from '../../hooks/useDragHandlers';
import StatSection from './StatSection';
import DragPreview from './DragPreview';
import ArtifactNameAutocomplete from './ArtifactNameAutocomplete';
import CostInput from './CostInput';

function ArtifactShowcase(
    { allStats, 
        setAllStats, 
        nextIdRef, 
        apiGameData, 
        bare, 
        artifactName, 
        setArtifactName,
        apiArtifactData,
        costValue,
        setCostValue
    }) {
    const {
        findContainer, findStat, handleChange, togglePercentage, handleStatChange, addNewStat, deleteStat
    } = useArtifactStats({ allStats, setAllStats, nextIdRef });

    const {
        activeId, overId, handleDragStart, handleDragOver, handleDragEnd, isDragging
    } = useDragHandlers({ allStats, setAllStats, findContainer, deleteStat });

    const content = (
        <Box sx={{ 
            display: 'flex', 
            gap: 3,
            minHeight: '400px',
            alignItems: 'stretch'
        }}>
            <Box sx={{ 
                flex: '0 0 250px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ mb: 3 }}>
                    <ArtifactNameAutocomplete
                        value={artifactName}
                        onChangeValue={setArtifactName}
                        apiArtifactData={apiArtifactData}
                    />
                    <CostInput
                        costValue={costValue || ''}
                        setCostValue={setCostValue}
                    />
                </Box>
                <StatSection 
                    title={"Main Stats"} 
                    statsKey={"mainStats"} 
                    stats={allStats.mainStats}
                    apiGameData={apiGameData.filter((s) => s.statTypeName === 'Main')}
                    onChangeValue={handleChange}
                    onTogglePercentage={togglePercentage}
                    onGameStatChange={handleStatChange}
                    isDragging={isDragging}
                    onAddStat={addNewStat}
                />
            </Box>

            <Divider 
                orientation="vertical" 
                sx={{ 
                    borderColor: 'divider', 
                    opacity: 0.7,
                    alignSelf: 'stretch'
                }} 
            />

            <Box sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <StatSection 
                    title={"Sub Stats"} 
                    statsKey={"subStats"} 
                    stats={allStats.subStats}
                    apiGameData={apiGameData.filter((s) => s.statTypeName === 'Sub')}
                    onChangeValue={handleChange}
                    onTogglePercentage={togglePercentage}
                    onGameStatChange={handleStatChange}
                    isDragging={isDragging}
                    onAddStat={addNewStat}
                />
            </Box>
        </Box>
    );

    return (
        <Box>
            <DndContext
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {bare ? (
                    <Box sx={{ p: 2, width: '600px', mx: 'auto' }}>{content}</Box>
                ) : (
                    <Paper elevation={3} sx={{ 
                        p: 2, 
                        width: '600px', 
                        mx: 'auto', 
                        backgroundColor: 'background.paper', 
                        color: 'text.primary', 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}>
                        {content}
                    </Paper>
                )}
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