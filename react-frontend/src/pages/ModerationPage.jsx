import { Box, AppBar, Drawer, ListItem, ListItemButton, ListItemText, Toolbar, Typography, List, ListItemIcon } from '@mui/material';
import { Person, Security, Shield, CloudUpload } from '@mui/icons-material';
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import ThemeSwitch from '../components/common/ThemeSwitch';

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
                    width: 72,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { 
                        width: drawerWidth, 
                        boxSizing: 'border-box',
                        height: '100vh',
                        borderRight: '1px solid',
                        borderColor: 'divider',
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
                    backgroundColor: 'background.paper', 
                    color: 'text.primary',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 64,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
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
                                        color: 'text.primary',
                                        minHeight: 48,
                                        justifyContent: isDrawerExpanded ? 'initial' : 'center',
                                        px: 2.5,
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                            color: 'primary.main'
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
                        backgroundColor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none'
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
                            Moderation Dashboard
                        </Typography>
                        <ThemeSwitch />
                    </Toolbar>
                </AppBar>
                
                <Box 
                    component="main"
                    sx={{ 
                        flexGrow: 1, 
                        bgcolor: 'background.default', 
                        p: 3,
                        overflow: 'auto',
                        color: 'text.primary'
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
    }

export default ModerationPage;
