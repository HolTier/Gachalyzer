import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import { useState } from "react";

function ArtifactCardBox ({ stats }) {
    const [mainStats, setMainStats] = useState(stats?.filter((s) => s.statType == "MainStat"));
    const [subStats, setSubStats] = useState(stats?.filter((s) => s.statType == "SubStat"));

    return (
        <Card sx={{ maxWidth: 300, p: 1 }}>
            <CardContent>
                {mainStats.length > 0 && (
                    <Box sx={{ 
                        display: 'grid', 
                        gap: 1 
                    }}>
                    {mainStats.map((item) => (
                        <Box textAlign="center" 
                        sx={{
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                        }}>
                            <Typography variant="body1" fontWeight="bold">{item.stat}</Typography>
                            <Typography variant="body1">{item.rawValue}</Typography>
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
                    {subStats.map((item) => (
                        <Box key={item} 
                            textAlign="center" 
                            sx={{
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center'
                            }}>
                            <Typography variant="subtitle2">{item.stat}</Typography>
                            <Typography variant="caption">{item.rawValue}</Typography>
                        </Box>
                    ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default ArtifactCardBox;