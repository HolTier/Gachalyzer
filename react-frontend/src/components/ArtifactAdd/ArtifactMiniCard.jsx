import { forwardRef, useEffect, useRef } from "react";
import { Box, Typography, Divider } from "@mui/material";

function StatRow({ stat, value }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 0.5,
                px: 0,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                minWidth: 0,
                width: '100%'
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '60%',
                    flex: '0 1 auto'
                }}
                title={stat}
            >
                {stat}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    ml: 0.5,
                    textAlign: 'right',
                    minWidth: 'fit-content',
                    flex: '0 0 auto',
                    fontSize: '0.8rem'
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

const ArtifactMiniCard = forwardRef(function ArtifactMiniCard({ allStats, onClick, sx, hovered, artifactName, costValue }, ref) {
    const mainStatsScrollRef = useRef(null);
    const subStatsScrollRef = useRef(null);

    const handleScroll = (scrollElement) => {
        if (!scrollElement) return;
        
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        const isScrolledFromTop = scrollTop > 5;
        const isScrollable = scrollHeight > clientHeight;
        const isScrolledFromBottom = scrollTop < scrollHeight - clientHeight - 5; // Small threshold
        
        scrollElement.classList.remove('scroll-top', 'scroll-bottom');
        
        if (isScrolledFromTop && isScrollable) {
            scrollElement.classList.add('scroll-top');
        }
        if (isScrolledFromBottom && isScrollable) {
            scrollElement.classList.add('scroll-bottom');
        }
    };

    useEffect(() => {
        const mainElement = mainStatsScrollRef.current;
        const subElement = subStatsScrollRef.current;

        if (mainElement) {
            handleScroll(mainElement);
        }
        if (subElement) {
            handleScroll(subElement);
        }

        const mainScrollHandler = () => handleScroll(mainElement);
        const subScrollHandler = () => handleScroll(subElement);

        if (mainElement) {
            mainElement.addEventListener('scroll', mainScrollHandler);
        }
        if (subElement) {
            subElement.addEventListener('scroll', subScrollHandler);
        }

        return () => {
            if (mainElement) {
                mainElement.removeEventListener('scroll', mainScrollHandler);
            }
            if (subElement) {
                subElement.removeEventListener('scroll', subScrollHandler);
            }
        };
    }, [allStats.mainStats, allStats.subStats]);

    return (
        <div
            ref={ref}
            onClick={onClick}
            tabIndex={onClick ? 0 : undefined}
            style={{ outline: 'none' }}
        >
            <Box
                sx={{
                    ...sx,
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    boxShadow: hovered ? '0 0 8px 0 rgba(144,202,249,0.12), 0 4px 16px 0 rgba(0,0,0,0.14)' : 3,
                    width: { xs: 320, sm: 400 },
                    height: 280, 
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'box-shadow 0.25s cubic-bezier(.4,0,.2,1), transform 0.22s cubic-bezier(.4,0,.2,1), z-index 0.2s',
                    position: 'relative',
                    zIndex: hovered ? 20 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    transform: hovered ? 'scale(1.12)' : 'none',
                    outline: 'none',
                    overflow: 'hidden',
                    '&:focus-visible': {
                        boxShadow: '0 0 10px 0 rgba(144,202,249,0.16), 0 4px 16px 0 rgba(0,0,0,0.14)',
                    },
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1,
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                        letterSpacing: '0.01em',
                        textAlign: 'center',
                    }}
                >
                    {artifactName || 'Artifact Name'}
                </Typography>

                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 500,
                        color: 'text.secondary',
                        mb: 2,
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                        letterSpacing: '0.01em',
                        textAlign: 'center',
                    }}
                >
                    Cost: {costValue || 'No cost'}
                </Typography>

                <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    alignItems: 'stretch',
                    flex: 1,
                    height: '120px'
                }}>
                    <Box sx={{ 
                        flex: '1 1 50%',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        position: 'relative'
                    }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 0.5,
                                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                letterSpacing: '0.01em',
                                flexShrink: 0,
                                zIndex: 2,
                                backgroundColor: 'background.paper',
                                pb: 0.5
                            }}
                        >
                            Main Stats
                        </Typography>
                        
                        <Box 
                            ref={mainStatsScrollRef}
                            sx={{
                            flex: 1,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            position: 'relative',
                            maxHeight: '100%',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '3px',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.5)',
                                },
                            },
                            // Scroll indicators
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '12px',
                                background: 'linear-gradient(to bottom, rgba(35,39,47,0.9), rgba(35,39,47,0))',
                                pointerEvents: 'none',
                                zIndex: 1,
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '12px',
                                background: 'linear-gradient(to top, rgba(35,39,47,0.9), rgba(35,39,47,0))',
                                pointerEvents: 'none',
                                zIndex: 1,
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                            },
                            '&.scroll-top::before': {
                                opacity: 1,
                            },
                            '&.scroll-bottom::after': {
                                opacity: 1,
                            },
                        }}>
                            {allStats.mainStats.length === 0 ? (
                                <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
                                    No main stats
                                </Typography>
                            ) : (
                                allStats.mainStats.map((stat) => (
                                    <StatRow key={stat.id} stat={stat.stat} value={stat.rawValue} />
                                ))
                            )}
                        </Box>
                    </Box>

                    {/* Vertical Divider */}
                    <Box sx={{ 
                        width: '1px',
                        backgroundColor: 'divider',
                        opacity: 0.7,
                        alignSelf: 'stretch',
                        flexShrink: 0
                    }} />

                    {/* Right Side - Sub Stats */}
                    <Box sx={{ 
                        flex: '1 1 50%',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        position: 'relative'
                    }}>
                        {/* Fixed Header */}
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 0.5,
                                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                letterSpacing: '0.01em',
                                flexShrink: 0,
                                zIndex: 2,
                                backgroundColor: 'background.paper',
                                pb: 0.5
                            }}
                        >
                            Sub Stats
                        </Typography>
                        
                        {/* Scrollable Content */}
                        <Box 
                            ref={subStatsScrollRef}
                            sx={{
                            flex: 1,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            position: 'relative',
                            maxHeight: '100%',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '3px',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.5)',
                                },
                            },
                            // Scroll indicators
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '12px',
                                background: 'linear-gradient(to bottom, rgba(35,39,47,0.9), rgba(35,39,47,0))',
                                pointerEvents: 'none',
                                zIndex: 1,
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '12px',
                                background: 'linear-gradient(to top, rgba(35,39,47,0.9), rgba(35,39,47,0))',
                                pointerEvents: 'none',
                                zIndex: 1,
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                            },
                            '&.scroll-top::before': {
                                opacity: 1,
                            },
                            '&.scroll-bottom::after': {
                                opacity: 1,
                            },
                        }}>
                            {allStats.subStats.length === 0 ? (
                                <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
                                    No sub stats
                                </Typography>
                            ) : (
                                allStats.subStats.map((stat) => (
                                    <StatRow key={stat.id} stat={stat.stat} value={stat.rawValue} />
                                ))
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
});

export default ArtifactMiniCard;