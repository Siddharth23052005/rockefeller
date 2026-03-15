import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export const SectionCard = ({ title, action, children, sx = {} }) => {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent sx={{ p: 2.5 }}>
        {(title || action) && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {title}
              </Typography>
            )}
            {action && <Box>{action}</Box>}
          </Box>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
