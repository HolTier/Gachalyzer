import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Opacity } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import StatInput from "./StatInput";
import { DragOverlay } from "@dnd-kit/core";

const SortableStat = ({ stat, onChangeValue, onTogglePercentage, dragOverType }) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = 
        useSortable({ id: stat.key });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        Opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        
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
            {...attributes}
            {...listeners}
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
                onChangeValue={(val) => onChangeValue(stat.key, val)}
                onTogglePercentage={() => onTogglePercentage()}
            />
        </Box>
    );
}
export default SortableStat;