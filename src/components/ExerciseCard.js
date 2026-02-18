import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material'
import FallbackImage from './FallbackImage';
import FavoriteButton from './FavoriteButton';

const ExerciseCard = ({ exercise }) => (
    <Link className='exercise-card' to={`/exercise/${exercise.id}`}>
        <Box sx={{ position: 'relative' }}>
            <FallbackImage src={exercise.gifUrl} alt={exercise.name} />
            <FavoriteButton
                exercise={exercise}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#FF2625' },
                }}
            />
        </Box>
        <Stack direction='row'>
            <Button sx={{ml: '21px', color: '#fff', background: '#FFA9A9',
            fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize'}}>
                {exercise.bodyPart}
            </Button>

            <Button sx={{ml: '21px', color: '#fff', background: '#FCC757',
            fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize'}}>
                {exercise.target}
            </Button>
        </Stack>
        <Typography ml='21px' color='#000' fontWeight='bold'sx={{ fontSize: {lg: '24px', xs:'20px'}}} mt='11px' pb='10px' textTransform='capitalize'> 
            {exercise.name}
        </Typography>
    </Link>
    )


export default ExerciseCard;