import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from './FavoritesContext';

const wrapper = ({ children }) => <FavoritesProvider>{children}</FavoritesProvider>;

beforeEach(() => {
  localStorage.clear();
});

describe('FavoritesContext', () => {
  test('toggleFavorite adds exercise to favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => {
      result.current.toggleFavorite({ id: '1', name: 'Push Up' });
    });
    expect(result.current.isFavorite('1')).toBe(true);
    expect(result.current.favoriteIds).toContain('1');
  });

  test('toggleFavorite removes exercise when already favorited', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => {
      result.current.toggleFavorite({ id: '1', name: 'Push Up' });
    });
    expect(result.current.isFavorite('1')).toBe(true);
    act(() => {
      result.current.toggleFavorite({ id: '1', name: 'Push Up' });
    });
    expect(result.current.isFavorite('1')).toBe(false);
    expect(result.current.favoriteIds).not.toContain('1');
  });

  test('isFavorite returns correct boolean', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.isFavorite('1')).toBe(false);
    act(() => {
      result.current.toggleFavorite({ id: '1', name: 'Push Up' });
    });
    expect(result.current.isFavorite('1')).toBe(true);
    expect(result.current.isFavorite('2')).toBe(false);
  });

  test('localStorage is updated on toggle', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => {
      result.current.toggleFavorite({ id: '1', name: 'Push Up' });
    });
    const stored = JSON.parse(localStorage.getItem('favoriteExercises'));
    expect(stored).toContain('1');

    act(() => {
      result.current.toggleFavorite({ id: '1', name: 'Push Up' });
    });
    const storedAfter = JSON.parse(localStorage.getItem('favoriteExercises'));
    expect(storedAfter).not.toContain('1');
  });

  test('initializes from localStorage on mount', () => {
    localStorage.setItem('favoriteExercises', JSON.stringify(['10', '20']));
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.isFavorite('10')).toBe(true);
    expect(result.current.isFavorite('20')).toBe(true);
    expect(result.current.isFavorite('30')).toBe(false);
  });

  test('throws error when useFavorites used outside provider', () => {
    // Suppress console.error for expected error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useFavorites());
    }).toThrow('useFavorites must be used within a FavoritesProvider');
    spy.mockRestore();
  });
});

