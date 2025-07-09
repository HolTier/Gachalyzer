import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DroppableContainer from './DroppableContainer';
import SortableStat from './SortableStat';
import { Typography } from '@mui/material'

function StatSection({ title, statsKey, stats = [], apiGameData, isOver, onChangeValue, onTogglePercentage, onGameStatChange}) {
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
            </DroppableContainer>
        </>
    );
};

export default StatSection;