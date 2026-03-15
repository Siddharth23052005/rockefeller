import React from 'react';
import { Chip } from '@mui/material';
import { getRiskColor, getRiskLabel } from '../../utils/riskUtils';

export const RiskBadge = ({ level, size = 'small', sx = {} }) => {
  const color = getRiskColor(level);
  const label = getRiskLabel(level);

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: color,
        color: '#fff',
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.85rem',
        borderRadius: '6px',
        ...sx,
      }}
    />
  );
};

export default RiskBadge;
