import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const HistoryContext = createContext();

const STORAGE_KEY = 'exerciseHistory';
const MAX_ENTRIES = 50;

const getStoredHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // localStorage unavailable or corrupt
  }
  return [];
};

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(getStoredHistory);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      // localStorage unavailable
    }
  }, [history]);

  const addToHistory = useCallback((exercise) => {
    if (!exercise || !exercise.id) return;

    setHistory((prev) => {
      // Remove any existing entry for this exercise
      const filtered = prev.filter((entry) => entry.exercise.id !== exercise.id);

      // Add new entry at the beginning (most recent first)
      const newEntry = {
        exercise: {
          id: exercise.id,
          name: exercise.name,
          bodyPart: exercise.bodyPart,
          gifUrl: exercise.gifUrl,
          target: exercise.target,
          equipment: exercise.equipment,
        },
        viewedAt: new Date().toISOString(),
      };

      const updated = [newEntry, ...filtered];

      // Trim to max entries
      return updated.slice(0, MAX_ENTRIES);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // localStorage unavailable
    }
  }, []);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

export default HistoryContext;

