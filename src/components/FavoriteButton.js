import React from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavorites } from '../contexts/FavoritesContext';

const FavoriteButton = ({ exercise, sx = {} }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(exercise.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(exercise);
  };

  return (
    <IconButton
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      sx={{
        color: favorited ? '#FF2625' : 'rgba(0, 0, 0, 0.54)',
        '&:hover': {
          color: '#FF2625',
        },
        ...sx,
      }}
    >
      {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};

export default FavoriteButton;

