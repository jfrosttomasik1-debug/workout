import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Favorites from './Favorites';

const mockUseFavorites = jest.fn();

jest.mock('../contexts/FavoritesContext', () => ({
  useFavorites: () => mockUseFavorites(),
  FavoritesProvider: ({ children }) => children,
}));

// ExerciseCard uses FavoriteButton which also calls useFavorites,
// so the mock above covers both.

const renderFavorites = () =>
  render(
    <BrowserRouter>
      <Favorites />
    </BrowserRouter>
  );

describe('Favorites page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows "Your Favorite Exercises" heading', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      favoriteIds: [],
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn().mockReturnValue(false),
    });
    renderFavorites();
    expect(screen.getByText('Your Favorite Exercises')).toBeInTheDocument();
  });

  test('shows empty state when favorites is empty', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      favoriteIds: [],
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn().mockReturnValue(false),
    });
    renderFavorites();
    expect(screen.getByText('No favorite exercises yet')).toBeInTheDocument();
    expect(
      screen.getByText('Click the heart icon on any exercise to save it here.')
    ).toBeInTheDocument();
  });

  test('renders exercise cards when favorites exist', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [
        {
          id: '1',
          name: 'Push Up',
          bodyPart: 'chest',
          target: 'pectorals',
          equipment: 'body weight',
          gifUrl: 'test.gif',
        },
        {
          id: '2',
          name: 'Pull Up',
          bodyPart: 'back',
          target: 'lats',
          equipment: 'body weight',
          gifUrl: 'test2.gif',
        },
      ],
      favoriteIds: ['1', '2'],
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn().mockReturnValue(true),
    });
    renderFavorites();
    expect(screen.queryByText('No favorite exercises yet')).not.toBeInTheDocument();
    expect(screen.getByText('Push Up')).toBeInTheDocument();
    expect(screen.getByText('Pull Up')).toBeInTheDocument();
  });
});

