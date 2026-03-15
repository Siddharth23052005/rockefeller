import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingState = ({ message = 'Loading data...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <CircularProgress size={36} sx={{ mb: 2, color: 'primary.main' }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;
