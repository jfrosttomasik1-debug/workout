import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutProvider } from '../contexts/WorkoutContext';
import AddToWorkoutButton from './AddToWorkoutButton';

const mockExercise = { id: '0001', name: 'Push Up' };

const renderWithProviders = (ui) =>
  render(<WorkoutProvider>{ui}</WorkoutProvider>);

describe('AddToWorkoutButton', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows "Add to Workout" initially', () => {
    renderWithProviders(<AddToWorkoutButton exercise={mockExercise} />);
    expect(screen.getByRole('button', { name: 'Add to Workout' })).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('shows "In Workout" and is disabled after clicking', () => {
    renderWithProviders(<AddToWorkoutButton exercise={mockExercise} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add to Workout' }));
    // After click, addExercise updates context synchronously so alreadyInWorkout
    // becomes true on the next render, showing "In Workout" (not "Added!")
    expect(screen.getByRole('button', { name: 'In Workout' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows "In Workout" and is disabled when exercise already in workout', () => {
    // Render two buttons for the same exercise — first click adds it, then re-render
    const TestComponent = () => (
      <WorkoutProvider>
        <AddToWorkoutButton exercise={mockExercise} />
        <AddToWorkoutButton exercise={mockExercise} />
      </WorkoutProvider>
    );
    render(<TestComponent />);
    const buttons = screen.getAllByRole('button');
    // Click the first button to add the exercise
    fireEvent.click(buttons[0]);
    // The second button should show "In Workout" and be disabled
    // since the workout context now contains the exercise
    expect(buttons[1]).toBeDisabled();
    expect(buttons[1]).toHaveTextContent('In Workout');
  });

  it('calls addExercise from context on click', () => {
    renderWithProviders(<AddToWorkoutButton exercise={mockExercise} />);
    const btn = screen.getByRole('button', { name: 'Add to Workout' });
    fireEvent.click(btn);
    // After clicking, addExercise adds to context so alreadyInWorkout becomes true
    expect(screen.getByRole('button', { name: 'In Workout' })).toBeInTheDocument();
  });
});

