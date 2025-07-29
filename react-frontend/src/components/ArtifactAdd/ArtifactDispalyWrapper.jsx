import { Box, Paper, IconButton, Dialog, DialogContent, DialogTitle, Slide, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArtifactShowcase from "./ArtifactShowcase";
import { useAllStatsState } from "../../hooks/useAllStatsState";
import ArtifactMiniCard from "./ArtifactMiniCard";
import ArtifactNameAutocomplete from "./ArtifactNameAutocomplete";
import { useApiArtifactData } from "../../hooks/useApiArtifactData";
import { useState, useRef, forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ArtifactDisplayWrapper({ stats, artifacts, apiGameData }) {
    const { allStats, setAllStats, nextIdRef } = useAllStatsState(stats);
    const { data: apiArtifactData, loading: artifactLoading } = useApiArtifactData();
    const [artifactName, setArtifactName] = useState(artifacts[0] || "");
    const [showShowcase, setShowShowcase] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const miniCardRef = useRef(null);

    const handleMiniCardClick = () => setShowShowcase(true);

    const handleCloseShowcase = () => {
        setShowShowcase(false);
        setIsHovering(false); 

        if (miniCardRef.current) {
            miniCardRef.current.blur();
        }
    };

    const handleHoverEnter = () => setIsHovering(true);
    const handleHoverLeave = () => setIsHovering(false);

    const handleArtifactNameChange = (newName) => {
        setArtifactName(newName);
    };

    return (
        <Box position="relative" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    width: 'auto',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    p: 0,
                    m: 0,
                }}
                onMouseEnter={handleHoverEnter}
                onMouseLeave={handleHoverLeave}
            >
                <Paper elevation={3} sx={{ borderRadius: 3, width: 'fit-content', position: 'relative', pointerEvents: 'auto', background: 'none', boxShadow: 0, p: 0, m: 0 }}>
                    <ArtifactMiniCard
                        ref={miniCardRef}
                        allStats={allStats}
                        artifactName={artifactName}
                        onClick={!showShowcase ? handleMiniCardClick : undefined}
                        hovered={isHovering && !showShowcase}
                        sx={{
                            cursor: !showShowcase ? 'pointer' : 'default',
                            width: 180,
                            hight: 400,
                            boxShadow: 0,
                            pointerEvents: !showShowcase ? 'auto' : 'none',
                            m: 0,
                            opacity: showShowcase ? 0.5 : 1,
                            filter: showShowcase ? 'blur(1px)' : 'none',
                            transition: 'opacity 0.2s, filter 0.2s',
                        }}
                    />
                    {showShowcase && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 10,
                            background: 'transparent',
                        }} />
                    )}
                </Paper>
            </Box>
            <Dialog
                open={showShowcase}
                onClose={handleCloseShowcase}
                maxWidth="sm"
                fullWidth
                slots={{transition: Transition}}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 6,
                            boxShadow: 8,
                            p: 0,
                            overflow: 'visible',
                            minWidth: 0,
                            minHeight: 0,
                            maxWidth: 500,
                        },
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        p: 0,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        background: 'transparent',
                        minHeight: 0,
                    }}
                >
                    <IconButton
                        onClick={handleCloseShowcase}
                        title="Close"
                        sx={{
                            backgroundColor: 'transparent',
                            color: 'text.primary',
                            boxShadow: 'none',
                            m: 1,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                        size="medium"
                        aria-label="close"
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 6,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: 0,
                        minHeight: 0,
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 440,
                            borderRadius: 4,
                            boxShadow: 0,
                            p: 0,
                        }}
                    >
                        <ArtifactShowcase
                            allStats={allStats}
                            setAllStats={setAllStats}
                            nextIdRef={nextIdRef}
                            apiGameData={apiGameData}
                            apiArtifactData={apiArtifactData}
                            artifactName={artifactName}
                            editMode={true}
                            bare={true}
                            sx={{
                                width: '100%',
                                boxShadow: 0,
                                pointerEvents: 'auto',
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default ArtifactDisplayWrapper;