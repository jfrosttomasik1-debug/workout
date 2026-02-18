import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

const FallbackImage = ({ src, alt, className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <Box
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          minHeight: '200px',
        }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          textTransform="capitalize"
          textAlign="center"
          sx={{ p: 2 }}
        >
          {alt || 'Image unavailable'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {isLoading && (
        <Box
          className={className}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            minHeight: '200px',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={isLoading ? { display: 'none' } : undefined}
        {...props}
      />
    </>
  );
};

export default FallbackImage;

