import React from 'react';
import { Box, Typography } from '@mui/material';
import { InboxOutlined as EmptyIcon } from '@mui/icons-material';

export const EmptyState = ({ title = 'No data found', message, icon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Box sx={{ color: 'text.secondary', mb: 2, opacity: 0.5 }}>
        {icon || <EmptyIcon sx={{ fontSize: 48 }} />}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;
