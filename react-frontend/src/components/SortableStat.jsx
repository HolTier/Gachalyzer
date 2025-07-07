import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragIndicator } from "@mui/icons-material";
import { Box, Typography, IconButton } from "@mui/material";
import StatInput from "./StatInput";
import { DragOverlay } from "@dnd-kit/core";

const SortableStat = ({ stat, onChangeValue, onTogglePercentage, dragOverType }) => {
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

    const getVariant = () => {
        if (isDragging && dragOverType) {
            return dragOverType === "MainStat" ? "body1" : "subtitle2";
        }
        return stat.statType === "MainStat" ? "body1" : "subtitle2";
    };

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
            <Typography 
                variant={stat.statType === "MainStat" ? "body1" : "subtitle2"} 
                fontWeight={isDragging && dragOverType === 'MainStat' ? 'bold' : 
                           stat.statType === 'MainStat' ? 'bold' : 'normal'}
            >
                {stat.stat}
            </Typography>
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