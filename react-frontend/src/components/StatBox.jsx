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
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import { m } from "framer-motion";

const StatBox = ({ data, dataWuwa }) => {
    const [stats, setStats] = useState(data || []);;

    const safeDataWuwa = dataWuwa || {
        mainStats: [],
        subStats: []
    };

    const mainStats = stats.filter(stat => stat.statType === "MainStat") || [];
    const subStats = stats.filter(stat => stat.statType === "SubStat" && safeDataWuwa.subStats.some(s => s.name === stat.stat));

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

    const handleStatNameChange = (statType, index, newName) => {
        const updatedStats = [...stats];
        let statIndex;

        if (statType === "MainStat") {
            statIndex = stats.findIndex(s => s.statType === "MainStat" && s.stat === displayedMainStats[index].stat);
            
            if (statIndex === -1) {
                updatedStats.push({
                    stat: newName,
                    statType: "MainStat",
                    rawValue: "",
                    value: "",
                    isPercentage: newName.includes('%')
                });
            } else {
                updatedStats[statIndex].stat = newName;
                updatedStats[statIndex].isPercentage = newName.includes('%');
            }
            
            displayedMainStats[index].stat = newName;
            displayedMainStats[index].isPercentage = newName.includes('%');
        } else {
            statIndex = stats.findIndex(s => s.statType === "SubStat" && s.stat === displayedSubStats[index]?.stat);
            
            if (statIndex === -1) {
                updatedStats.push({
                    stat: newName,
                    statType: "SubStat",
                    rawValue: "",
                    value: "",
                    isPercentage: newName.includes('%')
                });
            } else {
                updatedStats[statIndex].stat = newName;
                updatedStats[statIndex].isPercentage = newName.includes('%');
            }
            
            if (displayedSubStats[index]) {
                displayedSubStats[index].stat = newName;
                displayedSubStats[index].isPercentage = newName.includes('%');
            }
        }

        setStats(updatedStats);
    };

    const minSubStats = 0;
    const maxSubStats = 4;
    const displayedSubStats = subStats.slice(minSubStats, maxSubStats);

    const handleStatChange = (statType, index, newValue) => {
        const updatedStats = [...stats]
        let statIndex;

        if (statType === "MainStat") {
            statIndex = stats.findIndex(s => s.statType === "MainStat" && s.stat === displayedMainStats[index].stat);
        } else {
            statIndex = stats.findIndex(s => s.statType === "SubStat" && s.stat === displayedSubStats[index].stat);
        }

        if (statIndex === -1) {
            const newStat = {
                stat: statType === "MainStat" ? displayedMainStats[index].stat : displayedSubStats[index].stat,
                statType,
                rawValue: displayedMainStats[index].isPercentage ? `${newValue}%` : newValue.toString(),
                value: newValue,
                isPercentage: displayedMainStats[index].isPercentage
            };
            updatedStats.push(newStat);
        } else {
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
                        <FormControl fullWidth>
                            <InputLabel>Main Stat {index + 1}</InputLabel>
                            <Select
                                value={stat.stat}
                                onChange={(e) => handleStatNameChange("MainStat", index, e.target.value)}
                                label={`Main Stat ${index + 1}`}
                            >
                                {safeDataWuwa.mainStats.map((mainStat) => (
                                    <MenuItem key={mainStat.id} value={mainStat.name}>
                                        {mainStat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            value={stat.value}
                            onChange={(e) => handleStatChange("MainStat", index, e.target.value)}
                            fullWidth
                            sx={{ mt: 1 }}
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
                        <FormControl fullWidth>
                            <InputLabel>Sub Stat {index + 1}</InputLabel>
                            <Select
                                value={stat.stat}
                                onChange={(e) => handleStatNameChange("SubStat", index, e.target.value)}
                                label={`Sub Stat ${index + 1}`}
                            >
                                {safeDataWuwa.subStats.map((subStat) => (
                                    <MenuItem key={subStat.id} value={subStat.name}>
                                        {subStat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            value={stat.value}
                            onChange={(e) => handleStatChange("SubStat", index, e.target.value)}
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                                endAdornment: stat.isPercentage && (
                                    <InputAdornment position="end">%</InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                ))}
                
                {Array.from({ length: 4 - displayedSubStats.length }).map((_, index) => (
                    <Grid item xs={6} key={`empty-${index}`}>
                        <FormControl fullWidth>
                            <InputLabel>Sub Stat {displayedSubStats.length + index + 1}</InputLabel>
                            <Select
                                value=""
                                onChange={(e) => handleStatNameChange("SubStat", displayedSubStats.length + index, e.target.value)}
                                label={`Sub Stat ${displayedSubStats.length + index + 1}`}
                            >
                                {safeDataWuwa.subStats.map((subStat) => (
                                    <MenuItem key={subStat.id} value={subStat.name}>
                                        {subStat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
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
                            sx={{ mt: 1 }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

export default StatBox;