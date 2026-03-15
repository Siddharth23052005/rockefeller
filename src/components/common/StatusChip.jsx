import React from 'react';
import { Chip } from '@mui/material';

const STATUS_STYLES = {
  active: { bgcolor: '#FFEBEE', color: '#B71C1C' },
  acknowledged: { bgcolor: '#FFF8E1', color: '#E65100' },
  resolved: { bgcolor: '#E8F5E9', color: '#2E7D32' },
  pending: { bgcolor: '#FFF8E1', color: '#E65100' },
  reviewed: { bgcolor: '#E8F5E9', color: '#2E7D32' },
  dismissed: { bgcolor: '#ECEFF1', color: '#546E7A' },
  confirmed_critical: { bgcolor: '#FFEBEE', color: '#B71C1C' },
  safe: { bgcolor: '#E8F5E9', color: '#2E7D32' },
  false_alarm: { bgcolor: '#ECEFF1', color: '#546E7A' },
  ai_scored: { bgcolor: '#E3F2FD', color: '#1565C0' },
};

const STATUS_LABELS = {
  active: 'Active',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
  pending: 'Pending',
  reviewed: 'Reviewed',
  dismissed: 'Dismissed',
  confirmed_critical: 'Confirmed Critical',
  safe: 'Safe',
  false_alarm: 'False Alarm',
  ai_scored: 'AI Scored',
};

export const StatusChip = ({ status, size = 'small', sx = {} }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const label = STATUS_LABELS[status] || status;

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        fontWeight: 600,
        fontSize: '0.7rem',
        borderRadius: '6px',
        ...style,
        ...sx,
      }}
    />
  );
};

export default StatusChip;
