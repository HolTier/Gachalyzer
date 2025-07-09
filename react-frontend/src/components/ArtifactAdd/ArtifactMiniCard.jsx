import { Box, Paper, TextField, Typography } from "@mui/material";

function ArtifactMiniCard({allStats, onClick, sx}) {
    return (
        <Box onClick={onClick} sx={sx}>
            <Paper>
                <Typography>Main Stats</Typography>
                {allStats.mainStats.map((stat, index) => (
                    <Box key={stat.id}>
                        <Typography>{stat.stat}</Typography>
                        <Typography>{stat.rawValue}</Typography>
                    </Box>
                ))}
                <Typography>Sub Stats</Typography>
                {allStats.subStats.map((stat) => (
                    <Box key={stat.id}>
                        <Typography>{stat.stat}</Typography>
                        <Typography>{stat.rawValue}</Typography>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}

export default ArtifactMiniCard;