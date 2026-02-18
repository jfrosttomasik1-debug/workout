import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ThemeContextProvider, useThemeContext } from './ThemeContext';

const wrapper = ({ children }) => <ThemeContextProvider>{children}</ThemeContextProvider>;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeContext', () => {
  test('defaults to light mode', () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    expect(result.current.mode).toBe('light');
  });

  test('toggleTheme switches between light and dark', () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    expect(result.current.mode).toBe('light');
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.mode).toBe('dark');
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.mode).toBe('light');
  });

  test('persists mode to localStorage', () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    act(() => {
      result.current.toggleTheme();
    });
    expect(localStorage.getItem('themeMode')).toBe('dark');
    act(() => {
      result.current.toggleTheme();
    });
    expect(localStorage.getItem('themeMode')).toBe('light');
  });

  test('reads stored mode from localStorage on mount', () => {
    localStorage.setItem('themeMode', 'dark');
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    expect(result.current.mode).toBe('dark');
  });

  test('sets data-theme attribute on document element', () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    act(() => {
      result.current.toggleTheme();
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('throws error when useThemeContext used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useThemeContext());
    }).toThrow('useThemeContext must be used within a ThemeContextProvider');
    spy.mockRestore();
  });
});

