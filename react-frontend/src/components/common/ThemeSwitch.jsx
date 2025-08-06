import React from 'react';
import { Switch, FormControlLabel, Box } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../../themes/ThemeContext';

function ThemeSwitch() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LightMode sx={{ 
        color: isDarkMode ? 'text.secondary' : 'primary.main',
        fontSize: 20 
      }} />
      <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        color="primary"
        size="small"
        sx={{
          '& .MuiSwitch-thumb': {
            backgroundColor: isDarkMode ? '#58a6ff' : '#0969da',
          },
          '& .MuiSwitch-track': {
            backgroundColor: isDarkMode ? '#444c56' : '#d0d7de',
          }
        }}
      />
      <DarkMode sx={{ 
        color: isDarkMode ? 'primary.main' : 'text.secondary',
        fontSize: 20 
      }} />
    </Box>
  );
}

export default ThemeSwitch;
