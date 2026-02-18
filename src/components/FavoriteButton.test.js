import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import FavoriteButton from './FavoriteButton';

const mockExercise = { id: '0001', name: 'Push Up' };

const renderWithProviders = (ui) =>
  render(<FavoritesProvider>{ui}</FavoritesProvider>);

describe('FavoriteButton', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders unfavorited state with correct aria-label', () => {
    renderWithProviders(<FavoriteButton exercise={mockExercise} />);
    const btn = screen.getByRole('button', { name: 'Add to favorites' });
    expect(btn).toBeInTheDocument();
    // FavoriteBorderIcon is rendered (SVG with data-testid from MUI)
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('renders favorited state after clicking', () => {
    renderWithProviders(<FavoriteButton exercise={mockExercise} />);
    const btn = screen.getByRole('button', { name: 'Add to favorites' });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument();
  });

  it('calls toggleFavorite on click (toggles back to unfavorited)', () => {
    renderWithProviders(<FavoriteButton exercise={mockExercise} />);
    const btn = screen.getByRole('button', { name: 'Add to favorites' });
    // Toggle to favorited
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument();
    // Toggle back to unfavorited
    fireEvent.click(screen.getByRole('button', { name: 'Remove from favorites' }));
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
  });

  it('stops event propagation on click', () => {
    const parentClickHandler = jest.fn();
    render(
      <FavoritesProvider>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div onClick={parentClickHandler}>
          <FavoriteButton exercise={mockExercise} />
        </div>
      </FavoritesProvider>
    );
    const btn = screen.getByRole('button', { name: 'Add to favorites' });
    fireEvent.click(btn);
    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});

