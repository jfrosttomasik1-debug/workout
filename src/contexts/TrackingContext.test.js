import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { TrackingProvider, useTracking } from './TrackingContext';

const wrapper = ({ children }) => <TrackingProvider>{children}</TrackingProvider>;

const makeLog = (exerciseId, sets = 3, reps = 10) => ({
  exerciseId,
  sets,
  reps,
  date: new Date().toISOString(),
});

beforeEach(() => {
  localStorage.clear();
});

describe('TrackingContext', () => {
  test('addLog appends a log entry', () => {
    const { result } = renderHook(() => useTracking(), { wrapper });
    act(() => {
      result.current.addLog(makeLog('ex1'));
    });
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].exerciseId).toBe('ex1');
  });

  test('deleteLog removes by index', () => {
    const { result } = renderHook(() => useTracking(), { wrapper });
    act(() => {
      result.current.addLog(makeLog('ex1'));
    });
    act(() => {
      result.current.addLog(makeLog('ex2'));
    });
    act(() => {
      result.current.addLog(makeLog('ex3'));
    });
    expect(result.current.logs).toHaveLength(3);
    act(() => {
      result.current.deleteLog(1);
    });
    expect(result.current.logs).toHaveLength(2);
    expect(result.current.logs[0].exerciseId).toBe('ex1');
    expect(result.current.logs[1].exerciseId).toBe('ex3');
  });

  test('getLogsForExercise filters correctly', () => {
    const { result } = renderHook(() => useTracking(), { wrapper });
    act(() => {
      result.current.addLog(makeLog('ex1'));
    });
    act(() => {
      result.current.addLog(makeLog('ex2'));
    });
    act(() => {
      result.current.addLog(makeLog('ex1'));
    });
    const filtered = result.current.getLogsForExercise('ex1');
    expect(filtered).toHaveLength(2);
    filtered.forEach((log) => {
      expect(log.exerciseId).toBe('ex1');
    });
  });

  test('localStorage is updated on add and delete', () => {
    const { result } = renderHook(() => useTracking(), { wrapper });
    act(() => {
      result.current.addLog(makeLog('ex1'));
    });
    let stored = JSON.parse(localStorage.getItem('exerciseTrackingLogs'));
    expect(stored).toHaveLength(1);
    expect(stored[0].exerciseId).toBe('ex1');

    act(() => {
      result.current.deleteLog(0);
    });
    stored = JSON.parse(localStorage.getItem('exerciseTrackingLogs'));
    expect(stored).toHaveLength(0);
  });

  test('throws error when useTracking used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useTracking());
    }).toThrow('useTracking must be used within a TrackingProvider');
    spy.mockRestore();
  });
});

