import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Paper,
    Divider,
    Grid,
    InputAdornment,
    Button,
} from "@mui/material";

const StatBox = ({ data }) => {
    const [stats, setStats] = useState(data);

    const mainStats = stats.filter(stat => stat.statType === "MainStat");
    const subStats = stats.filter(stat => stat.statType === "SubStat");

    // Ensure we always have 2 main stats (fill with empty if needed)
    const displayedMainStats = [...mainStats];
    while (displayedMainStats.length < 2) {
        displayedMainStats.push({
            stat: "Main Stat " + (displayedMainStats.length + 1),
            statType: "MainStat",
            rawValue: "",
            value: "",
            isPercentage: false
        });
    }

    // Ensure we have max 4 sub stats
    const displayedSubStats = subStats.slice(0, 4);

    const handleStatChange = (statType, index, newValue) => {
        const updatedStats = [...stats]
        let statIndex;

        if (statType === "MainStat") {
            statIndex = stats.findIndex(s => s.statType === "MainStat" && s.stat === displayedMainStats[index].stat);
        } else {
            statIndex = stats.findIndex(s => s.statType === "SubStat" && s.stat === displayedSubStats[index].stat);
        }

        if (statIndex === -1) {
            // Add new stat if it doesn't exist
            const newStat = {
                stat: statType === "MainStat" ? displayedMainStats[index].stat : displayedSubStats[index].stat,
                statType,
                rawValue: displayedMainStats[index].isPercentage ? `${newValue}%` : newValue.toString(),
                value: newValue,
                isPercentage: displayedMainStats[index].isPercentage
            };
            updatedStats.push(newStat);
        } else {
            // Update existing stat
            updatedStats[statIndex].value = newValue;
            updatedStats[statIndex].rawValue = updatedStats[statIndex].isPercentage
                ? `${newValue}%`
                : newValue.toString();
        }

        setStats(updatedStats);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
            <Typography variant="h6" gutterBottom>
                Statistics
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Main Stats
            </Typography>
            <Grid container spacing={2}>
                {displayedMainStats.map((stat, index) => (
                    <Grid item xs={6} key={`main-${index}`}>
                        <TextField
                            label={stat.stat}
                            value={stat.value}
                            onChange={(e) => handleStatChange("MainStat", index, e.target.value)}
                            fullWidth
                            InputProps={{
                                endAdornment: stat.isPercentage && (
                                    <InputAdornment position="end">%</InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Sub Stats
            </Typography>
            <Grid container spacing={2}>
                {displayedSubStats.map((stat, index) => (
                    <Grid item xs={6} key={`sub-${index}`}>
                        <TextField
                            label={stat.stat}
                            value={stat.value}
                            onChange={(e) => handleStatChange("SubStat", index, e.target.value)}
                            fullWidth
                            InputProps={{
                                endAdornment: stat.isPercentage && (
                                    <InputAdornment position="end">%</InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                ))}
                
                {/* Fill empty slots if less than 4 sub stats */}
                {Array.from({ length: 4 - displayedSubStats.length }).map((_, index) => (
                    <Grid item xs={6} key={`empty-${index}`}>
                        <TextField
                            label={`Sub Stat ${displayedSubStats.length + index + 1}`}
                            value=""
                            onChange={(e) => {
                                const newStat = {
                                    stat: `Sub Stat ${displayedSubStats.length + index + 1}`,
                                    statType: "SubStat",
                                    rawValue: "",
                                    value: e.target.value,
                                    isPercentage: false
                                };
                                setStats([...stats, newStat]);
                            }}
                            fullWidth
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

export default StatBox;