import React from 'react';
import { Box } from '@mui/material';
import { AlertCard } from './AlertCard';
import { EmptyState } from '../common/EmptyState';

export const AlertList = ({ alerts, onAcknowledge, onResolve, onViewMap }) => {
  if (!alerts || alerts.length === 0) {
    return <EmptyState title="No alerts" message="No alerts match the current filter criteria" />;
  }

  return (
    <Box>
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onAcknowledge={onAcknowledge}
          onResolve={onResolve}
          onViewMap={onViewMap}
        />
      ))}
    </Box>
  );
};

export default AlertList;
