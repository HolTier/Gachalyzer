import { Box, Card, CardContent, Typography, Divider, TextField } from "@mui/material";
import { useState } from "react";
import StatInput from "./StatInput";

function ArtifactCardBox ({ stats }) {
    const [mainStats, setMainStats] = useState(stats?.filter((s) => s.statType == "MainStat"));
    const [subStats, setSubStats] = useState(stats?.filter((s) => s.statType == "SubStat"));

    const handleChange = (setter, index, newRawValue) => {
        setter((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], rawValue: newRawValue, value: parseFloat(newRawValue) };
            return updated;
        });
    };

    const togglePercentage = (setter, index) => {
        setter((prev) => {
            const updated = [...prev];
            const stat = updated[index];
            const newIsPercentage = !stat.isPercentage;
            const newRawValue = newIsPercentage ? `${stat.value}%` : `${stat.value}`;
            updated[index] = { ...stat, isPercentage: newIsPercentage, rawValue: newRawValue };
            return updated;
        });
    };

    return (
        <Card sx={{ maxWidth: 700, minWidth: 300, p: 1 }}>
            <CardContent>
                {mainStats.length > 0 && (
                    <Box sx={{ 
                        display: 'grid', 
                        gap: 1 
                    }}>
                    {mainStats.map((item, index) => (
                        <Box
                            key={`main-${index}`} 
                            textAlign="center" 
                            sx={{
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center'
                        }}>
                            <Typography variant="body1" fontWeight="bold">{item.stat}</Typography>
                            <StatInput 
                                value={item.value}
                                isPercentage={item.isPercentage}
                                onChangeValue={(val) => handleChange(setMainStats, index, val)}
                                onTogglePercentage={() => togglePercentage(setMainStats, index)}
                            />
                        </Box>
                    ))}
                    </Box>
                )}
                
                <Divider sx={{ my: 1 }} />
                
                {subStats.length > 0 && (
                    <Box sx={{ 
                        display: 'grid',  
                        gap: 1 
                    }}>
                    {subStats.map((item, index) => (
                        <Box 
                            key={`sub-${index}`} 
                            textAlign="center" 
                            sx={{
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center'
                            }}
                        >
                            <Typography variant="subtitle2">{item.stat}</Typography>
                            <StatInput 
                                value={item.value}
                                isPercentage={item.isPercentage}
                                onChangeValue={(val) => handleChange(setSubStats, index, val)}
                                onTogglePercentage={() => togglePercentage(setSubStats, index)}
                            />
                        </Box>
                    ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default ArtifactCardBox;