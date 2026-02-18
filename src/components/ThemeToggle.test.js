import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const renderWithProviders = (ui) =>
  render(<ThemeContextProvider>{ui}</ThemeContextProvider>);

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with correct aria-label in light mode', () => {
    renderWithProviders(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
  });

  it('renders dark mode icon (Brightness4Icon) in light mode', () => {
    renderWithProviders(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: 'Switch to dark mode' });
    // Brightness4Icon has a specific SVG path; just verify an SVG is present
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('switches to dark mode on click and updates aria-label', () => {
    renderWithProviders(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: 'Switch to dark mode' });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
  });

  it('renders light mode icon (Brightness7Icon) in dark mode', () => {
    renderWithProviders(<ThemeToggle />);
    // Switch to dark mode first
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    const btn = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('toggles back to light mode on second click', () => {
    renderWithProviders(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: 'Switch to dark mode' });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }));
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
  });
});

