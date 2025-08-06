import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { darkFormTheme, lightFormTheme } from './formThemes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const currentTheme = isDarkMode ? darkFormTheme : lightFormTheme;

  const value = {
    isDarkMode,
    toggleTheme,
    theme: currentTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
