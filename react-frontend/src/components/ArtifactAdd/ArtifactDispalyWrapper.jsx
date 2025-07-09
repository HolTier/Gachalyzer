import { Box, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArtifactShowcase from "./ArtifactShowcase";
import { useAllStatsState } from "../../hooks/useAllStatsState";
import ArtifactMiniCard from "./ArtifactMiniCard";
import { useState, useRef } from "react";

function ArtifactDisplayWrapper({ stats, apiGameData }) {
    // Use the hook to get state and setters
    const { allStats, setAllStats, nextIdRef } = useAllStatsState(stats);
    const [showShowcase, setShowShowcase] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const miniCardRef = useRef(null);

    // Handler to open showcase
    const handleMiniCardClick = () => setShowShowcase(true);
    // Handler to close showcase
    const handleCloseShowcase = () => {
        setShowShowcase(false);
        setIsHovering(false); // Reset hover state when closing showcase
        // Blur MiniCard if focused
        if (miniCardRef.current) {
            miniCardRef.current.blur();
        }
    };

    // Handler for hover area
    const handleHoverEnter = () => setIsHovering(true);
    const handleHoverLeave = () => setIsHovering(false);

    return (
        <Box position="relative" minHeight={500} width={440} mx="auto" display="flex" justifyContent="center" alignItems="center">
            {!showShowcase && (
                <Box
                    sx={{
                        position: 'absolute',
                        zIndex: 2,
                        width: 220,
                        height: 220,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none', // only card is clickable
                    }}
                    onMouseEnter={handleHoverEnter}
                    onMouseLeave={handleHoverLeave}
                >
                    <Paper elevation={3} sx={{ borderRadius: 3, width: 180, position: 'relative', pointerEvents: 'auto', background: 'none', boxShadow: 0 }}>
                        <ArtifactMiniCard
                            ref={miniCardRef}
                            allStats={allStats}
                            onClick={handleMiniCardClick}
                            hovered={isHovering}
                            sx={{
                                cursor: 'pointer',
                                width: 180,
                                boxShadow: 0,
                                pointerEvents: 'auto',
                            }}
                        />
                    </Paper>
                </Box>
            )}
            {showShowcase && (
                <Paper elevation={6} sx={{ borderRadius: 3, width: 440, overflow: 'hidden', position: 'absolute', zIndex: 3 }}>
                    <ArtifactShowcase
                        allStats={allStats}
                        setAllStats={setAllStats}
                        nextIdRef={nextIdRef}
                        apiGameData={apiGameData}
                        editMode={true}
                        bare={true} // Pass bare prop to prevent double Paper
                        sx={{
                            width: 440,
                            boxShadow: 0,
                            pointerEvents: 'auto',
                        }}
                    />
                    <IconButton
                        onClick={handleCloseShowcase}
                        title="Close"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 20,
                            backgroundColor: 'transparent',
                            color: 'text.primary',
                            boxShadow: 'none',
                            p: 0.5,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                        size="small"
                        aria-label="close"
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                </Paper>
            )}
        </Box>
    );
}

export default ArtifactDisplayWrapper;