import { forwardRef } from "react";
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
                    maxWidth: 90,
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
                    ml: 1,
                    textAlign: 'right',
                    minWidth: 32,
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

const ArtifactMiniCard = forwardRef(function ArtifactMiniCard({ allStats, onClick, sx, hovered, artifactName }, ref) {
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
                    width: { xs: 160, sm: 180 },
                    minHeight: 120,
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'box-shadow 0.25s cubic-bezier(.4,0,.2,1), transform 0.22s cubic-bezier(.4,0,.2,1), z-index 0.2s',
                    position: 'relative',
                    zIndex: hovered ? 20 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transform: hovered ? 'scale(1.12)' : 'none',
                    outline: 'none',
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
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                        letterSpacing: '0.01em',
                    }}
                >
                    Main Stats
                </Typography>
                {allStats.mainStats.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                        No main stats
                    </Typography>
                )}
                {allStats.mainStats.map((stat) => (
                    <StatRow key={stat.id} stat={stat.stat} value={stat.rawValue} />
                ))}
                <Divider sx={{ my: 1, borderColor: 'divider', opacity: 0.7 }} />
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                        letterSpacing: '0.01em',
                    }}
                >
                    Sub Stats
                </Typography>
                {allStats.subStats.length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                        No sub stats
                    </Typography>
                )}
                {allStats.subStats.map((stat) => (
                    <StatRow key={stat.id} stat={stat.stat} value={stat.rawValue} />
                ))}
            </Box>
        </div>
    );
});

export default ArtifactMiniCard;