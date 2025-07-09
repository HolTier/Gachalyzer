import { Paper } from "@mui/material";
import SortableStat from "./SortableStat";

function DragPreview({stat}) {
    return (
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
                stat={stat}
                apiGameData={null}
                onChangeValue={() => {}}
                onTogglePercentage={() => {}}
            />
        </Paper>
    );
}

export default DragPreview;