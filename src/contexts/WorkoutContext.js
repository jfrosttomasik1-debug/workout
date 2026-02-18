import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const WorkoutContext = createContext();

const STORAGE_KEY = 'workoutExercises';

const getStoredWorkout = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // localStorage unavailable or corrupted
  }
  return [];
};

export const WorkoutProvider = ({ children }) => {
  const [workout, setWorkout] = useState(getStoredWorkout);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workout));
    } catch (e) {
      // localStorage unavailable
    }
  }, [workout]);

  const addExercise = useCallback((exercise) => {
    setWorkout((prev) => {
      // Prevent duplicates
      if (prev.some((ex) => ex.id === exercise.id)) return prev;
      return [...prev, exercise];
    });
  }, []);

  const removeExercise = useCallback((exerciseId) => {
    setWorkout((prev) => prev.filter((ex) => ex.id !== exerciseId));
  }, []);

  const reorderExercise = useCallback((fromIndex, toIndex) => {
    setWorkout((prev) => {
      if (
        fromIndex < 0 || fromIndex >= prev.length ||
        toIndex < 0 || toIndex >= prev.length
      ) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const clearWorkout = useCallback(() => {
    setWorkout([]);
  }, []);

  return (
    <WorkoutContext.Provider value={{ workout, addExercise, removeExercise, reorderExercise, clearWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export default WorkoutContext;

