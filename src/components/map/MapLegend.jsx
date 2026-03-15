import React from 'react';
import { Box, Typography } from '@mui/material';
import { getRiskColor, getRiskLabel } from '../../utils/riskUtils';

const LEVELS = ['green', 'yellow', 'orange', 'red'];

export const MapLegend = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        zIndex: 1000,
        bgcolor: 'rgba(255,255,255,0.95)',
        borderRadius: '8px',
        p: 1.5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: 140,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
        Risk Levels
      </Typography>
      {LEVELS.map((level) => (
        <Box key={level} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: '3px',
              bgcolor: getRiskColor(level),
            }}
          />
          <Typography variant="caption">{getRiskLabel(level)}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default MapLegend;
