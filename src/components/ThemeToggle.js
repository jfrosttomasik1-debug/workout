import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      sx={{
        color: mode === 'light' ? '#3A1212' : '#F5F5F5',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgba(58, 18, 18, 0.08)' : 'rgba(245, 245, 245, 0.08)',
        },
      }}
    >
      {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
};

export default ThemeToggle;

