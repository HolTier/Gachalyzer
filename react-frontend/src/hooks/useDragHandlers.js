import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

export function useDragHandlers({ allStats, setAllStats, findContainer }) {
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (event) => {
        const { id } = event.active;
        setActiveId(id);
        setIsDragging(true);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        setOverId(over ? over.id : null);
        if (!over || active.id === over.id) return;

        const sourceList = findContainer(active.id);
        let targetList = findContainer(over.id);
        if (!sourceList) return;
        if (!targetList) return;

        // Only handle moving between containers here (live reparenting)
        if (sourceList !== targetList) {
            setAllStats((prev) => {
                const sourceArr = [...prev[sourceList]];
                const targetArr = [...prev[targetList]];
                const statToMove = sourceArr.find(stat => stat.id === active.id);
                const updatedSource = sourceArr.filter(stat => stat.id !== active.id);
                
                // Prevent duplicates
                if (targetArr.some(stat => stat.id === active.id)) return prev;

                // Calculate insertion index
                const overIndex = targetArr.findIndex(stat => stat.id === over.id);
                const insertIndex = overIndex >= 0 ? overIndex : targetArr.length;

                const updatedTarget = [...targetArr];
                updatedTarget.splice(insertIndex, 0, {
                    ...statToMove,
                    statType: targetList === 'mainStats' ? 'MainStat' : 
                             targetList === 'subStats' ? 'SubStat' : 'Cost',
                });
                return {
                    ...prev,
                    [sourceList]: updatedSource,
                    [targetList]: updatedTarget,
                };
            });
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setOverId(null);
        if (!over || active.id === over.id) {
            return;
        }
        const sourceList = findContainer(active.id);
        const targetList = findContainer(over.id);
        if (sourceList && targetList && sourceList === targetList) {
            setAllStats((prev) => {
                const arr = [...prev[sourceList]];
                const oldIndex = arr.findIndex(stat => stat.id === active.id);
                const newIndex = arr.findIndex(stat => stat.id === over.id);
                if (oldIndex === newIndex) return prev;
                const reordered = arrayMove(arr, oldIndex, newIndex);
                return {
                    ...prev,
                    [sourceList]: reordered,
                };
            });
        }
        setIsDragging(false);
    };

    return {
        activeId,
        overId,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        isDragging
    };
}