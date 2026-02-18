import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkoutBuilder from './WorkoutBuilder';

const mockUseWorkout = jest.fn();

jest.mock('../contexts/WorkoutContext', () => ({
  useWorkout: () => mockUseWorkout(),
  WorkoutProvider: ({ children }) => children,
}));

describe('WorkoutBuilder page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows "Your Workout" heading', () => {
    mockUseWorkout.mockReturnValue({
      workout: [],
      removeExercise: jest.fn(),
      reorderExercise: jest.fn(),
      clearWorkout: jest.fn(),
    });
    render(<WorkoutBuilder />);
    expect(screen.getByText('Your Workout')).toBeInTheDocument();
  });

  test('shows empty state when workout is empty', () => {
    mockUseWorkout.mockReturnValue({
      workout: [],
      removeExercise: jest.fn(),
      reorderExercise: jest.fn(),
      clearWorkout: jest.fn(),
    });
    render(<WorkoutBuilder />);
    expect(
      screen.getByText(/No exercises added yet/i)
    ).toBeInTheDocument();
  });

  test('renders exercise list when workout has data', () => {
    mockUseWorkout.mockReturnValue({
      workout: [
        { id: '1', name: 'Push Up', target: 'chest', bodyPart: 'chest', equipment: 'body weight' },
        { id: '2', name: 'Pull Up', target: 'lats', bodyPart: 'back', equipment: 'body weight' },
      ],
      removeExercise: jest.fn(),
      reorderExercise: jest.fn(),
      clearWorkout: jest.fn(),
    });
    render(<WorkoutBuilder />);
    expect(screen.getByText('Push Up')).toBeInTheDocument();
    expect(screen.getByText('Pull Up')).toBeInTheDocument();
  });

  test('shows exercise count', () => {
    mockUseWorkout.mockReturnValue({
      workout: [
        { id: '1', name: 'Push Up', target: 'chest', bodyPart: 'chest', equipment: 'body weight' },
        { id: '2', name: 'Pull Up', target: 'lats', bodyPart: 'back', equipment: 'body weight' },
      ],
      removeExercise: jest.fn(),
      reorderExercise: jest.fn(),
      clearWorkout: jest.fn(),
    });
    render(<WorkoutBuilder />);
    expect(screen.getByText('2 exercises')).toBeInTheDocument();
  });

  test('shows targeted muscles summary', () => {
    mockUseWorkout.mockReturnValue({
      workout: [
        { id: '1', name: 'Push Up', target: 'chest', bodyPart: 'chest', equipment: 'body weight' },
        { id: '2', name: 'Pull Up', target: 'lats', bodyPart: 'back', equipment: 'body weight' },
      ],
      removeExercise: jest.fn(),
      reorderExercise: jest.fn(),
      clearWorkout: jest.fn(),
    });
    render(<WorkoutBuilder />);
    expect(screen.getByText('Targeted Muscles:')).toBeInTheDocument();
    expect(screen.getByText('chest, lats')).toBeInTheDocument();
  });

  test('has Clear All button', () => {
    mockUseWorkout.mockReturnValue({
      workout: [
        { id: '1', name: 'Push Up', target: 'chest', bodyPart: 'chest', equipment: 'body weight' },
      ],
      removeExercise: jest.fn(),
      reorderExercise: jest.fn(),
      clearWorkout: jest.fn(),
    });
    render(<WorkoutBuilder />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });
});

