import React from 'react';
import { Box, Typography } from '@mui/material';
import Skeleton from 'react-loading-skeleton';

export const LoadingState = ({ message = 'Loading data...' }) => {
  return (
    <Box
      sx={{
        py: 4,
      }}
    >
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        <Skeleton height={14} width={180} />
        <Skeleton height={52} />
        <Skeleton height={52} />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;
