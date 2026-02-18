import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExerciseCard from '../components/ExerciseCard';
import { useFavorites } from '../contexts/FavoritesContext';

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <Box sx={{ mt: { lg: '100px', xs: '70px' }, p: '20px' }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{ fontSize: { lg: '44px', xs: '30px' } }}
        mb="46px"
        textAlign="center"
      >
        Your Favorite Exercises
      </Typography>

      {favorites.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '200px', gap: '16px' }}>
          <FavoriteBorderIcon sx={{ fontSize: '64px', color: 'rgba(0, 0, 0, 0.3)' }} />
          <Typography variant="h5" color="text.secondary" textAlign="center">
            No favorite exercises yet
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Click the heart icon on any exercise to save it here.
          </Typography>
        </Stack>
      ) : (
        <Stack
          direction="row"
          sx={{ gap: { lg: '107px', xs: '50px' } }}
          flexWrap="wrap"
          justifyContent="center"
        >
          {favorites.map((exercise) => (
            <Box key={exercise.id}>
              <ExerciseCard exercise={exercise} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Favorites;

