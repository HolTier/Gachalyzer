import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

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

export default DroppableContainer;