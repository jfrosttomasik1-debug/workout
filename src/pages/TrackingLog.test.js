import React from 'react';
import { render, screen } from '@testing-library/react';
import TrackingLog from './TrackingLog';

const mockUseTracking = jest.fn();

jest.mock('../contexts/TrackingContext', () => ({
  useTracking: () => mockUseTracking(),
  TrackingProvider: ({ children }) => children,
}));

describe('TrackingLog page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows "Exercise Log" heading', () => {
    mockUseTracking.mockReturnValue({
      logs: [],
      deleteLog: jest.fn(),
    });
    render(<TrackingLog />);
    expect(screen.getByText('Exercise Log')).toBeInTheDocument();
  });

  test('shows empty state when no logs', () => {
    mockUseTracking.mockReturnValue({
      logs: [],
      deleteLog: jest.fn(),
    });
    render(<TrackingLog />);
    expect(
      screen.getByText(/No exercises logged yet/i)
    ).toBeInTheDocument();
  });

  test('renders entries grouped by date when logs exist', () => {
    mockUseTracking.mockReturnValue({
      logs: [
        {
          exerciseName: 'Bench Press',
          sets: 3,
          reps: 10,
          weight: 135,
          date: '2025-06-15',
          notes: '',
        },
        {
          exerciseName: 'Squat',
          sets: 4,
          reps: 8,
          weight: 225,
          date: '2025-06-15',
          notes: 'Felt strong',
        },
        {
          exerciseName: 'Deadlift',
          sets: 3,
          reps: 5,
          weight: 315,
          date: '2025-06-14',
          notes: '',
        },
      ],
      deleteLog: jest.fn(),
    });
    render(<TrackingLog />);
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('Deadlift')).toBeInTheDocument();
  });

  test('shows "sets × reps @ weight lbs" format', () => {
    mockUseTracking.mockReturnValue({
      logs: [
        {
          exerciseName: 'Bench Press',
          sets: 3,
          reps: 10,
          weight: 135,
          date: '2025-06-15',
          notes: '',
        },
      ],
      deleteLog: jest.fn(),
    });
    render(<TrackingLog />);
    expect(screen.getByText('3 × 10 @ 135 lbs')).toBeInTheDocument();
  });

  test('has delete button per entry', () => {
    mockUseTracking.mockReturnValue({
      logs: [
        {
          exerciseName: 'Bench Press',
          sets: 3,
          reps: 10,
          weight: 135,
          date: '2025-06-15',
          notes: '',
        },
        {
          exerciseName: 'Squat',
          sets: 4,
          reps: 8,
          weight: 225,
          date: '2025-06-15',
          notes: '',
        },
      ],
      deleteLog: jest.fn(),
    });
    render(<TrackingLog />);
    const deleteButtons = screen.getAllByLabelText('Delete log entry');
    expect(deleteButtons).toHaveLength(2);
  });
});

