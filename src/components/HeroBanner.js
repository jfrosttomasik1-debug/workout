import React from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import HeroBannerImage from '../assets/images/banner.png'

const HeroBanner = () => {
  return (
    <Box sx={{
        mt: { lg: '212px', xs: '70px'},
        ml: {sm: '50px'}
    }} position='relative' p='20px'>
        <Typography color='#FF2625' fontWeight="600" fontSize='26px'>
            Fitness Club
        </Typography>

        <Typography
          fontWeight={700}
          sx={{ fontSize: {lg: '44px', xs: '40px'}, mb: '23px', mt: '30px' }}
          component='h1'
        >
            Sweat, Smile <br/>
            And Repeat
        </Typography>

        <Typography fontSize='22px' fontFamily='Alegreya' lineHeight='35px'>
            Check out the most effective exercises
        </Typography>

        <Stack>
            <Button
              component='a'
              href="#exercises"
              variant='contained'
              sx={{
                marginTop: '45px',
                width: '200px',
                textAlign: 'center',
                background: '#FF2625',
                padding: '14px',
                fontSize: '22px',
                textTransform: 'none',
                color: 'white',
                borderRadius: '4px',
                '&:hover': {
                  background: '#E01E1E',
                  textDecoration: 'none'
                },
                '&:focus': {
                  outline: '2px solid white',
                  outlineOffset: '2px'
                }
              }}
            >
              Explore Exercises
            </Button>
        </Stack>

        <Typography fontWeight={600} color="#ff2625" sx={{
            opacity: 0.1,
            display: {lg: 'block', xs: 'none'}
            }} fontSize='200px'
            aria-hidden='true'
        >
            Exercise
        </Typography>
        <img src={HeroBannerImage} alt='Fitness banner showing exercise equipment' className='hero-banner-img' />

    </Box>
  )
}

export default HeroBanner