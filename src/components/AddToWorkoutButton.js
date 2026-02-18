import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useWorkout } from '../contexts/WorkoutContext';

const AddToWorkoutButton = ({ exercise }) => {
  const { workout, addExercise } = useWorkout();
  const [added, setAdded] = useState(false);

  const alreadyInWorkout = workout.some((ex) => ex.id === exercise.id);

  const handleClick = () => {
    if (alreadyInWorkout || added) return;
    addExercise(exercise);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={alreadyInWorkout}
      sx={{
        mt: '20px',
        background: added ? '#4CAF50' : '#FF2625',
        color: '#fff',
        fontSize: '16px',
        textTransform: 'none',
        padding: '10px 30px',
        '&:hover': {
          background: added ? '#4CAF50' : '#e02020',
        },
        '&.Mui-disabled': {
          background: '#ccc',
          color: '#888',
        },
      }}
    >
      {alreadyInWorkout ? 'In Workout' : added ? 'Added!' : 'Add to Workout'}
    </Button>
  );
};

export default AddToWorkoutButton;

