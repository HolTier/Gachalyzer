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

const StatPreviewBox = ({ data }) => {
    const [stats, statsValue] = useState(data);

    const handleStatChange = (index, newValue) => {
        const updatedStats = [...stats];
        updatedStats[index].value = newValue;
        updatedStats[index].rawValue = updatedStats[index].isPercentage
            ? `${newValue}%`
            : newValue.toString();
        statsValue(updatedStats);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom>
            Stats Preview
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
            <Grid container spacing={2}>
                {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        {stat.stat} ({stat.statType})
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, e.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {stat.isPercentage ? '%' : ''}
                                    </InputAdornment>
                                ),
                            },
                        }}
                        type="number"
                        variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                        Raw: {stat.rawValue}
                    </Typography>
                    </Box>
                </Grid>
                ))}
            </Grid>
        </Paper>
    );
};