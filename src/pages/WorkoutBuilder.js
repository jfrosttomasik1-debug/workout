import React from 'react';
import { Box, Typography, Stack, Button, IconButton } from '@mui/material';
import { useWorkout } from '../contexts/WorkoutContext';

const WorkoutBuilder = () => {
  const { workout, removeExercise, reorderExercise, clearWorkout } = useWorkout();

  const muscleGroups = [...new Set(workout.map((ex) => ex.target).filter(Boolean))];

  if (workout.length === 0) {
    return (
      <Box sx={{ p: '40px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <Typography variant="h4" mb="20px">
          Your Workout
        </Typography>
        <Typography variant="h6" color="text.secondary">
          No exercises added yet. Browse exercises and add them to your workout!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: '40px 20px', minHeight: '60vh' }}>
      <Typography variant="h4" mb="10px">
        Your Workout
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb="20px" flexWrap="wrap" gap="10px">
        <Typography variant="h6">
          {workout.length} exercise{workout.length !== 1 ? 's' : ''}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={clearWorkout}
          sx={{ textTransform: 'none' }}
        >
          Clear All
        </Button>
      </Stack>

      {muscleGroups.length > 0 && (
        <Box mb="20px">
          <Typography variant="subtitle1" fontWeight="bold" mb="5px">
            Targeted Muscles:
          </Typography>
          <Typography variant="body1" color="text.secondary" textTransform="capitalize">
            {muscleGroups.join(', ')}
          </Typography>
        </Box>
      )}

      <Stack gap="12px">
        {workout.map((exercise, index) => (
          <Stack
            key={exercise.id}
            direction="row"
            alignItems="center"
            sx={{
              p: '12px 16px',
              borderRadius: '8px',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
            gap="16px"
          >
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: '24px' }}>
              {index + 1}.
            </Typography>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" fontWeight="bold" textTransform="capitalize">
                {exercise.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                {exercise.target} · {exercise.bodyPart} · {exercise.equipment}
              </Typography>
            </Box>

            <Stack direction="row" gap="4px" alignItems="center">
              <IconButton
                size="small"
                onClick={() => reorderExercise(index, index - 1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                <span style={{ fontSize: '18px' }}>▲</span>
              </IconButton>
              <IconButton
                size="small"
                onClick={() => reorderExercise(index, index + 1)}
                disabled={index === workout.length - 1}
                aria-label="Move down"
              >
                <span style={{ fontSize: '18px' }}>▼</span>
              </IconButton>
              <IconButton
                size="small"
                onClick={() => removeExercise(exercise.id)}
                aria-label="Remove exercise"
                sx={{ color: '#FF2625' }}
              >
                <span style={{ fontSize: '18px' }}>✕</span>
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default WorkoutBuilder;

