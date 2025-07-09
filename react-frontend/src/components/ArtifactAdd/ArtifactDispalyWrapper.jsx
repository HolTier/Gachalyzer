import { Box, Paper } from "@mui/material";
import ArtifactShowcase from "./ArtifactShowcase";
import { useAllStatsState } from "../../hooks/useAllStatsState";
import ArtifactMiniCard from "./ArtifactMiniCard";
import { useState } from "react";

function ArtifactDisplayWrapper({ stats, apiGameData }) {
    const allStatsState = useAllStatsState(stats);
    const [showShowcase, setShowShowcase] = useState(false);

    // Handler to open showcase
    const handleMiniCardClick = () => setShowShowcase(true);
    // Handler to close showcase
    const handleCloseShowcase = () => setShowShowcase(false);

    return (
        <Box position="relative" minHeight={500} width={440} mx="auto" display="flex" justifyContent="center" alignItems="center">
            {!showShowcase && (
                <Paper elevation={3} sx={{ borderRadius: 3, width: 180, overflow: 'hidden', position: 'absolute', zIndex: 2 }}>
                    <ArtifactMiniCard
                        allStats={allStatsState.allStats}
                        onClick={handleMiniCardClick}
                        sx={{
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.08)',
                            },
                            width: 180,
                            boxShadow: 0,
                        }}
                    />
                </Paper>
            )}
            {showShowcase && (
                <Paper elevation={6} sx={{ borderRadius: 3, width: 440, overflow: 'hidden', position: 'absolute', zIndex: 3 }}>
                    <ArtifactShowcase
                        {...allStatsState}
                        apiGameData={apiGameData}
                        editMode={true}
                        sx={{
                            width: 440,
                            boxShadow: 0,
                            pointerEvents: 'auto',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 20,
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 20,
                        }}
                        onClick={handleCloseShowcase}
                        title="Close"
                    >
                        ×
                    </Box>
                </Paper>
            )}
        </Box>
    );
}

export default ArtifactDisplayWrapper;