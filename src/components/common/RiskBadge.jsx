import React from 'react';
import { Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { getRiskColor, getRiskLabel } from '../../utils/riskUtils';

export const RiskBadge = ({ level, size = 'small', sx = {} }) => {
  const color = getRiskColor(level);
  const label = getRiskLabel(level);
  const normalized = String(level || '').toLowerCase();
  const riskClass = normalized === 'red' || normalized === 'critical'
    ? 'risk-red'
    : normalized === 'orange' || normalized === 'high'
      ? 'risk-orange'
      : 'risk-calm';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 24, delay: 0.08 }}
    >
      <Chip
        className={`risk-badge ${riskClass}`}
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
    </motion.div>
  );
};

export default RiskBadge;
