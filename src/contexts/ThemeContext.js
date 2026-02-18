import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

const getStoredMode = () => {
  try {
    const stored = localStorage.getItem('themeMode');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch (e) {
    // localStorage unavailable
  }
  return 'light';
};

const lightPalette = {
  mode: 'light',
  primary: { main: '#FF2625' },
  background: {
    default: '#FFFAFB',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#3A1212',
    secondary: '#5A3A3A',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: { main: '#FF2625' },
  background: {
    default: '#1A1A1A',
    paper: '#2A2A2A',
  },
  text: {
    primary: '#F5F5F5',
    secondary: '#B0B0B0',
  },
};

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(getStoredMode);

  // Sync data-theme attribute on <html> for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('themeMode', next);
      } catch (e) {
        // localStorage unavailable
      }
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: mode === 'light' ? lightPalette : darkPalette,
        typography: {
          fontFamily: "'Josefin Sans', sans-serif",
        },
      }),
    [mode]
  );

  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

export default ThemeContext;

