import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { TrackingProvider } from '../contexts/TrackingContext';
import TrackingForm from './TrackingForm';

const theme = createTheme();
const mockExercise = { id: '0001', name: 'Bench Press' };
const mockOnClose = jest.fn();

const renderWithProviders = (ui) =>
  render(
    <ThemeProvider theme={theme}>
      <TrackingProvider>{ui}</TrackingProvider>
    </ThemeProvider>
  );

describe('TrackingForm', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    localStorage.clear();
  });

  it('renders all form fields (sets, reps, weight, date, notes)', () => {
    renderWithProviders(
      <TrackingForm exercise={mockExercise} onClose={mockOnClose} />
    );
    expect(screen.getByLabelText(/sets/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reps/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders the exercise name in the heading', () => {
    renderWithProviders(
      <TrackingForm exercise={mockExercise} onClose={mockOnClose} />
    );
    expect(screen.getByText('Log: Bench Press')).toBeInTheDocument();
  });

  it('does NOT submit when required fields are empty', () => {
    renderWithProviders(
      <TrackingForm exercise={mockExercise} onClose={mockOnClose} />
    );
    fireEvent.click(screen.getByRole('button', { name: /save log/i }));
    // onClose should NOT be called because validation fails
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls addLog and onClose on valid submit', () => {
    renderWithProviders(
      <TrackingForm exercise={mockExercise} onClose={mockOnClose} />
    );

    fireEvent.change(screen.getByLabelText(/sets/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/reps/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '135' } });

    fireEvent.click(screen.getByRole('button', { name: /save log/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('cancel button calls onClose', () => {
    renderWithProviders(
      <TrackingForm exercise={mockExercise} onClose={mockOnClose} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

