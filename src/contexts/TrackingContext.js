import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const TrackingContext = createContext();

const STORAGE_KEY = 'exerciseTrackingLogs';

const getStoredLogs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    // localStorage unavailable or corrupt
  }
  return [];
};

const saveLogs = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    // localStorage unavailable
  }
};

export const TrackingProvider = ({ children }) => {
  const [logs, setLogs] = useState(getStoredLogs);

  const addLog = useCallback((logEntry) => {
    setLogs((prev) => {
      const updated = [...prev, logEntry];
      saveLogs(updated);
      return updated;
    });
  }, []);

  const deleteLog = useCallback((logIndex) => {
    setLogs((prev) => {
      const updated = prev.filter((_, i) => i !== logIndex);
      saveLogs(updated);
      return updated;
    });
  }, []);

  const getLogsForExercise = useCallback(
    (exerciseId) => logs.filter((log) => log.exerciseId === exerciseId),
    [logs]
  );

  const value = useMemo(
    () => ({ logs, addLog, deleteLog, getLogsForExercise }),
    [logs, addLog, deleteLog, getLogsForExercise]
  );

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};

export default TrackingContext;

