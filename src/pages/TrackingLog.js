import React from 'react';
import { Box, Typography, Stack, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTracking } from '../contexts/TrackingContext';

const groupLogsByDate = (logs) => {
  const groups = {};
  logs.forEach((log, index) => {
    const dateKey = log.date || 'Unknown';
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push({ ...log, originalIndex: index });
  });
  // Sort dates descending (most recent first)
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
};

const TrackingLog = () => {
  const { logs, deleteLog } = useTracking();

  const groupedLogs = groupLogsByDate(logs);

  if (logs.length === 0) {
    return (
      <Box sx={{ mt: { lg: '100px', xs: '60px' }, p: '20px', textAlign: 'center' }}>
        <Typography variant="h4" mb="20px" fontWeight="bold">
          Exercise Log
        </Typography>
        <Typography variant="h6" color="text.secondary">
          No exercises logged yet. Go to an exercise and click "Log Exercise" to start tracking!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: { lg: '100px', xs: '60px' }, p: '20px' }}>
      <Typography variant="h4" mb="30px" fontWeight="bold" textAlign="center">
        Exercise Log
      </Typography>

      <Stack spacing={4} sx={{ maxWidth: '800px', mx: 'auto' }}>
        {groupedLogs.map(([date, entries]) => (
          <Box key={date}>
            <Typography variant="h6" fontWeight="bold" mb="10px" sx={{ borderBottom: '2px solid #FF2625', pb: '5px' }}>
              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>

            <Stack spacing={1}>
              {entries.map((entry) => (
                <Paper
                  key={entry.originalIndex}
                  sx={{
                    p: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  elevation={1}
                >
                  <Box>
                    <Typography fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                      {entry.exerciseName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.sets} × {entry.reps} @ {entry.weight} lbs
                    </Typography>
                    {entry.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: '4px' }}>
                        {entry.notes}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    onClick={() => deleteLog(entry.originalIndex)}
                    color="error"
                    size="small"
                    aria-label="Delete log entry"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TrackingLog;

