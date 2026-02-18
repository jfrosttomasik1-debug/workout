import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Stack, Button } from '@mui/material';
import { useHistory } from '../contexts/HistoryContext';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const History = () => {
  const { history, clearHistory } = useHistory();

  return (
    <Box sx={{ mt: { lg: '100px', xs: '60px' }, p: '20px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb="40px">
        <Typography variant="h3" fontWeight="bold">
          Recently Viewed
        </Typography>
        {history.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={clearHistory}
            sx={{ textTransform: 'none' }}
          >
            Clear History
          </Button>
        )}
      </Stack>

      {history.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: '80px' }}>
          <Typography variant="h5" color="text.secondary">
            No exercises viewed yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mt="10px">
            Browse exercises and they'll appear here automatically.
          </Typography>
        </Box>
      ) : (
        <Stack gap="20px">
          {history.map((entry) => (
            <Link
              key={entry.exercise.id + entry.viewedAt}
              to={`/exercise/${entry.exercise.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap="20px"
                sx={{
                  p: '16px',
                  borderRadius: '10px',
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <img
                  src={entry.exercise.gifUrl}
                  alt={entry.exercise.name}
                  loading="lazy"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    textTransform="capitalize"
                    color="text.primary"
                  >
                    {entry.exercise.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                    {entry.exercise.bodyPart}
                    {entry.exercise.target ? ` · ${entry.exercise.target}` : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Viewed {formatDate(entry.viewedAt)}
                  </Typography>
                </Box>
              </Stack>
            </Link>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default History;

