import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const FavoritesContext = createContext();

const STORAGE_KEY = 'favoriteExercises';

const getStoredFavoriteIds = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // localStorage unavailable or corrupted
  }
  return [];
};

const saveFavoriteIds = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    // localStorage unavailable
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(getStoredFavoriteIds);

  const toggleFavorite = useCallback((exercise) => {
    setFavoriteIds((prevIds) => {
      const exists = prevIds.includes(exercise.id);
      const nextIds = exists
        ? prevIds.filter((id) => id !== exercise.id)
        : [...prevIds, exercise.id];
      saveFavoriteIds(nextIds);
      return nextIds;
    });

    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((fav) => fav.id === exercise.id);
      if (exists) {
        return prevFavorites.filter((fav) => fav.id !== exercise.id);
      }
      return [...prevFavorites, exercise];
    });
  }, []);

  const isFavorite = useCallback(
    (exerciseId) => favoriteIds.includes(exerciseId),
    [favoriteIds]
  );

  const value = useMemo(
    () => ({ favorites, favoriteIds, toggleFavorite, isFavorite }),
    [favorites, favoriteIds, toggleFavorite, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;

