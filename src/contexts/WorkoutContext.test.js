import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { WorkoutProvider, useWorkout } from './WorkoutContext';

const wrapper = ({ children }) => <WorkoutProvider>{children}</WorkoutProvider>;

const makeExercise = (id, name = 'Exercise') => ({
  id,
  name,
  bodyPart: 'chest',
  gifUrl: '',
  target: 'pecs',
  equipment: 'barbell',
});

beforeEach(() => {
  localStorage.clear();
});

describe('WorkoutContext', () => {
  test('addExercise adds to workout', () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });
    act(() => {
      result.current.addExercise(makeExercise('1', 'Push Up'));
    });
    expect(result.current.workout).toHaveLength(1);
    expect(result.current.workout[0].id).toBe('1');
  });

  test('addExercise prevents duplicates (same id)', () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });
    act(() => {
      result.current.addExercise(makeExercise('1', 'Push Up'));
    });
    act(() => {
      result.current.addExercise(makeExercise('1', 'Push Up'));
    });
    expect(result.current.workout).toHaveLength(1);
  });

  test('removeExercise removes by id', () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });
    act(() => {
      result.current.addExercise(makeExercise('1', 'Push Up'));
    });
    act(() => {
      result.current.addExercise(makeExercise('2', 'Squat'));
    });
    act(() => {
      result.current.removeExercise('1');
    });
    expect(result.current.workout).toHaveLength(1);
    expect(result.current.workout[0].id).toBe('2');
  });

  test('reorderExercise swaps positions correctly', () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });
    act(() => {
      result.current.addExercise(makeExercise('1', 'A'));
    });
    act(() => {
      result.current.addExercise(makeExercise('2', 'B'));
    });
    act(() => {
      result.current.addExercise(makeExercise('3', 'C'));
    });
    act(() => {
      result.current.reorderExercise(0, 2);
    });
    expect(result.current.workout[0].id).toBe('2');
    expect(result.current.workout[1].id).toBe('3');
    expect(result.current.workout[2].id).toBe('1');
  });

  test('reorderExercise ignores out-of-bounds indices', () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });
    act(() => {
      result.current.addExercise(makeExercise('1', 'A'));
    });
    act(() => {
      result.current.addExercise(makeExercise('2', 'B'));
    });
    act(() => {
      result.current.reorderExercise(-1, 1);
    });
    expect(result.current.workout[0].id).toBe('1');
    expect(result.current.workout[1].id).toBe('2');
    act(() => {
      result.current.reorderExercise(0, 99);
    });
    expect(result.current.workout[0].id).toBe('1');
    expect(result.current.workout[1].id).toBe('2');
  });

  test('clearWorkout empties workout', () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });
    act(() => {
      result.current.addExercise(makeExercise('1', 'Push Up'));
    });
    expect(result.current.workout).toHaveLength(1);
    act(() => {
      result.current.clearWorkout();
    });
    expect(result.current.workout).toHaveLength(0);
  });

  test('localStorage persistence', () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });
    act(() => {
      result.current.addExercise(makeExercise('1', 'Push Up'));
    });
    const stored = JSON.parse(localStorage.getItem('workoutExercises'));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('1');
  });

  test('throws error when useWorkout used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useWorkout());
    }).toThrow('useWorkout must be used within a WorkoutProvider');
    spy.mockRestore();
  });
});

