import { Box, AppBar, Drawer, ListItem, ListItemButton, ListItemText, Toolbar, Typography, List, ListItemIcon } from '@mui/material';
import { Person, Security, Shield, CloudUpload } from '@mui/icons-material';
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const selections = [
    { label: "Characters", path: "/moderation/characters", icon: <Person /> },
    { label: "Weapons", path: "/moderation/weapons", icon: <Security /> },
    { label: "Artifacts", path: "/moderation/artifacts", icon: <Shield /> },
    { label: "Image Upload", path: "/moderation/image-upload", icon: <CloudUpload /> }
];

function ModerationPage() {
    const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
    const drawerWidth = isDrawerExpanded ? 240 : 72;

    return (
        <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
            <Drawer
                variant="permanent"
                anchor='left'
                onMouseEnter={() => setIsDrawerExpanded(true)}
                onMouseLeave={() => setIsDrawerExpanded(false)}
                sx={{
                    width: 72, // Always reserve space for collapsed width
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { 
                        width: drawerWidth, 
                        boxSizing: 'border-box',
                        height: '100vh',
                        backgroundColor: '#1a1a1a',
                        borderRight: '1px solid',
                        borderColor: '#333',
                        transition: 'width 0.3s ease',
                        overflowX: 'hidden',
                        position: isDrawerExpanded ? 'fixed' : 'relative',
                        left: isDrawerExpanded ? 0 : 'auto',
                        top: isDrawerExpanded ? 0 : 'auto',
                        zIndex: isDrawerExpanded ? 1200 : 'auto',
                    },
                }}
            >
                <Box sx={{ 
                    backgroundColor: '#0d1117', 
                    color: '#f0f6fc',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 64,
                    borderBottom: '1px solid #333',
                    justifyContent: 'center'
                }}>
                    {isDrawerExpanded && (
                        <Typography 
                            variant="h6" 
                            component="div"
                            sx={{ 
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Moderation
                        </Typography>
                    )}
                </Box>
                <Box sx={{ overflow: 'hidden', flex: 1}}>
                    <List sx={{ pt: 0 }}>
                        {selections.map((s) => (
                            <ListItem key={s.path} disablePadding>
                                <ListItemButton 
                                    component={Link} 
                                    to={s.path}
                                    sx={{
                                        color: '#c9d1d9',
                                        minHeight: 48,
                                        justifyContent: isDrawerExpanded ? 'initial' : 'center',
                                        px: 2.5,
                                        '&:hover': {
                                            backgroundColor: '#21262d',
                                            color: '#58a6ff'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ 
                                        color: 'inherit',
                                        minWidth: 0,
                                        mr: isDrawerExpanded ? 3 : 0,
                                        justifyContent: 'center',
                                        width: 24,
                                        display: 'flex',
                                    }}>
                                        {s.icon}
                                    </ListItemIcon>
                                    {isDrawerExpanded && (
                                        <ListItemText 
                                            primary={s.label}
                                            sx={{ 
                                                opacity: isDrawerExpanded ? 1 : 0,
                                                transition: 'opacity 0.3s ease',
                                                whiteSpace: 'nowrap',
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <AppBar 
                    position="static"
                    sx={{
                        backgroundColor: '#2d333b',
                        borderBottom: '1px solid',
                        borderColor: '#444c56',
                        boxShadow: 'none'
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ color: '#f0f6fc' }}>
                            Moderation Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                
                <Box 
                    component="main"
                    sx={{ 
                        flexGrow: 1, 
                        bgcolor: '#22272e', 
                        p: 3,
                        overflow: 'auto',
                        color: '#c9d1d9'
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
    }

export default ModerationPage;
