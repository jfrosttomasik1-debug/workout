import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import FallbackImage from './FallbackImage';

const theme = createTheme();

const renderWithTheme = (ui) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('FallbackImage', () => {
  it('shows loading placeholder initially', () => {
    renderWithTheme(<FallbackImage src="test.jpg" alt="Test image" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays image after successful load', () => {
    renderWithTheme(<FallbackImage src="test.jpg" alt="Test image" />);
    const img = screen.getByRole('img', { name: 'Test image' });
    fireEvent.load(img);
    expect(img).toBeVisible();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('shows error fallback with alt text when image fails', () => {
    renderWithTheme(<FallbackImage src="bad.jpg" alt="Broken image" />);
    const img = screen.getByRole('img', { name: 'Broken image' });
    fireEvent.error(img);
    expect(screen.getByText('Broken image')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows default fallback text when no alt provided', () => {
    renderWithTheme(<FallbackImage src="bad.jpg" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
  });

  it('passes className and extra props to img element', () => {
    renderWithTheme(
      <FallbackImage src="test.jpg" alt="Test" className="my-class" data-testid="my-img" />
    );
    const img = screen.getByTestId('my-img');
    expect(img).toHaveClass('my-class');
    expect(img.tagName).toBe('IMG');
  });

  it('uses loading="lazy" on the img tag', () => {
    renderWithTheme(<FallbackImage src="test.jpg" alt="Test" />);
    const img = screen.getByRole('img', { name: 'Test' });
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});

