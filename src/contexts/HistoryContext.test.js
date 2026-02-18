import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { HistoryProvider, useHistory } from './HistoryContext';

const wrapper = ({ children }) => <HistoryProvider>{children}</HistoryProvider>;

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

describe('HistoryContext', () => {
  test('addToHistory adds exercise entry with viewedAt timestamp', () => {
    const { result } = renderHook(() => useHistory(), { wrapper });
    act(() => {
      result.current.addToHistory(makeExercise('1', 'Push Up'));
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].exercise.id).toBe('1');
    expect(result.current.history[0].viewedAt).toBeDefined();
  });

  test('duplicate exercise replaces older entry (moved to front)', () => {
    const { result } = renderHook(() => useHistory(), { wrapper });
    act(() => {
      result.current.addToHistory(makeExercise('1', 'Push Up'));
    });
    act(() => {
      result.current.addToHistory(makeExercise('2', 'Squat'));
    });
    act(() => {
      result.current.addToHistory(makeExercise('1', 'Push Up'));
    });
    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].exercise.id).toBe('1');
    expect(result.current.history[1].exercise.id).toBe('2');
  });

  test('max 50 entries (oldest trimmed)', () => {
    const { result } = renderHook(() => useHistory(), { wrapper });
    for (let i = 0; i < 55; i++) {
      act(() => {
        result.current.addToHistory(makeExercise(String(i), `Ex ${i}`));
      });
    }
    expect(result.current.history).toHaveLength(50);
    // Most recent should be first
    expect(result.current.history[0].exercise.id).toBe('54');
  });

  test('clearHistory empties history and localStorage', () => {
    const { result } = renderHook(() => useHistory(), { wrapper });
    act(() => {
      result.current.addToHistory(makeExercise('1', 'Push Up'));
    });
    expect(result.current.history).toHaveLength(1);
    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.history).toHaveLength(0);
    expect(localStorage.getItem('exerciseHistory')).toBeNull();
  });

  test('ignores exercise without id', () => {
    const { result } = renderHook(() => useHistory(), { wrapper });
    act(() => {
      result.current.addToHistory({ name: 'No ID' });
    });
    act(() => {
      result.current.addToHistory(null);
    });
    expect(result.current.history).toHaveLength(0);
  });

  test('throws error when useHistory used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useHistory());
    }).toThrow('useHistory must be used within a HistoryProvider');
    spy.mockRestore();
  });
});

