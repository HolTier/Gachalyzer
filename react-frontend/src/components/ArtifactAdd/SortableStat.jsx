import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragIndicator } from "@mui/icons-material";
import { Box, Typography, IconButton } from "@mui/material";
import StatInput from "./StatInput";
import GameStatAutocomplete from "./GameStatAutocomplete";

const SortableStat = ({ stat, onChangeValue, onTogglePercentage, dragOverType, apiGameData, onGameStatChange }) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = 
        useSortable({ 
            id: stat.id,
            activationConstraint: {
                delay: 400, // ms to hold before drag starts
                tolerance: 5 // px movement allowed before drag
            }
        });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "default",
        
    }

    return (
        <Box
            ref={setNodeRef}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 1,
                marginBottom: 1,
                backgroundColor: isDragging ? '#f0f0f0' : '#fff',
                ...style,
            }}
        >
            <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{ cursor: 'grab', mr: 1 }}
                aria-label="Drag to reorder"
            >
                <DragIndicator fontSize="small" />
            </IconButton>
            <GameStatAutocomplete 
                value={stat.stat}
                apiGameData={apiGameData}
                onChangeValue={(val) => onGameStatChange(stat.id, val)}
            />
            <StatInput
                value={stat.value}
                isPercentage={stat.isPercentage}
                onChangeValue={(val) => onChangeValue(stat.id, val)}
                onTogglePercentage={() => onTogglePercentage(stat.id)}
            />
        </Box>
    );
}
export default SortableStat;