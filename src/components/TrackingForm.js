import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';
import { useTracking } from '../contexts/TrackingContext';

const TrackingForm = ({ exercise, onClose }) => {
  const { addLog } = useTracking();
  const today = new Date().toISOString().split('T')[0];

  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sets || !reps || !weight) return;

    addLog({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      date,
      notes,
    });

    onClose();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: '20px',
        p: '20px',
        borderRadius: '10px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" mb="16px">
        Log: {exercise.name}
      </Typography>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            inputProps={{ min: 1 }}
            required
            size="small"
            fullWidth
          />
          <TextField
            label="Reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            inputProps={{ min: 1 }}
            required
            size="small"
            fullWidth
          />
          <TextField
            label="Weight (lbs)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            inputProps={{ min: 0 }}
            required
            size="small"
            fullWidth
          />
        </Stack>

        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          fullWidth
        />

        <TextField
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={2}
          size="small"
          fullWidth
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{ bgcolor: '#FF2625', '&:hover': { bgcolor: '#e02020' } }}
          >
            Save Log
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TrackingForm;

