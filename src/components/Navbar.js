import React from 'react'
import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'

import Logo from '../assets/images/Logo.png'
import ThemeToggle from './ThemeToggle'
import { useThemeContext } from '../contexts/ThemeContext'

const Navbar = () => {
  const { mode } = useThemeContext();
  const linkColor = mode === 'light' ? '#3A1212' : '#F5F5F5';

  return (
    <Stack
      direction='row'
      justifyContent='space-around'
      sx={{
        gap: { sm: '123px', xs: '40px'},
        mt: { sm: '32px', xs: '20px'}
      }}
      px='20px'
      role='navigation'
      aria-label='Main navigation'
    >
        <Link to='/' aria-label='Fitness Club Home'>
            <img src={Logo} alt='Fitness Club Logo' style={{
                width: '48px', height: '48px', margin: '0px 20px'
            }} />
        </Link>

            <Stack
              direction='row'
              gap='40px'
              fontSize='24px'
              fontFamily="Alegreya"
              alignItems='center'
            >
                <Link
                  to='/'
                  style={{
                    textDecoration: 'none',
                    color: linkColor,
                    borderBottom: '3px solid #FF2625',
                    padding: '8px 0',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.outline = '2px solid #FF2625'}
                  onBlur={(e) => e.target.style.outline = 'none'}
                >
                  Home
                </Link>
                <a
                  href='#exercises'
                  style={{
                    textDecoration: 'none',
                    color: linkColor,
                    padding: '8px 0',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.outline = '2px solid #FF2625'}
                  onBlur={(e) => e.target.style.outline = 'none'}
                >
                  Exercises
                </a>
                <ThemeToggle />
            </Stack>

    </Stack>
  );
}

export default Navbar