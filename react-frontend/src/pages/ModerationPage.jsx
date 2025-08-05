import { Outlet } from '@mui/icons-material';
import { Box, AppBar, Drawer, Link, ListItem, ListItemButton, ListItemText, Toolbar, Typography, List,ListItemIcon } from '@mui/material';
import { label, path, text } from 'framer-motion/client';
import React, { useState } from 'react';

const selections = [
    { label: "Characters", path: "/moderation/characters" },
    { label: "Weapons", path: "/moderation/weapons" },
    { label: "Artifacts", path: "/moderation/artifacts" },
    { label: "Image Upload", path: "/moderation/image-upload"}
];

function ModerationPage() {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar>
                <Toolbar position="fixed">
                    <Typography>
                        Moderation
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanet"
                anchor='left'
                sx={{
                    width: 200,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 200, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto'}}>
                    <List>
                        {selections.map((s) => (
                            <ListItem key={s.path} disablePadding>
                                <ListItemButton component={Link} to={s.path}>
                                    <ListItemIcon>

                                    </ListItemIcon>
                                    <ListItemText primary={s.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box component="main" p={3} ml={30}>
                <Outlet />
            </Box>
        </Box>
    );
    }

export default ModerationPage;
