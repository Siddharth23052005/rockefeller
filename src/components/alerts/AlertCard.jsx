import React from 'react';
import {
  Card, CardContent, Box, Typography, Button, Chip, Grid,
} from '@mui/material';
import { Visibility, Check, Done } from '@mui/icons-material';
import { RiskBadge } from '../common/RiskBadge';
import { StatusChip } from '../common/StatusChip';
import { formatDateTime } from '../../utils/formatUtils';

export const AlertCard = ({ alert, onAcknowledge, onResolve, onViewMap }) => {
  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RiskBadge level={alert.riskLevel} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {alert.zoneName}
            </Typography>
          </Box>
          <StatusChip status={alert.status} />
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
          {alert.district} District
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {alert.triggerReason}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
          {formatDateTime(alert.timestamp)}
        </Typography>

        <Box
          sx={{
            p: 1.5,
            bgcolor: '#F8F9FA',
            borderRadius: '6px',
            mb: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.3 }}>
            Recommended Action
          </Typography>
          <Typography variant="body2">{alert.recommendedAction}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {alert.status === 'active' && (
            <Button size="small" variant="contained" startIcon={<Check />} onClick={() => onAcknowledge?.(alert.id)}>
              Acknowledge
            </Button>
          )}
          <Button size="small" variant="outlined" startIcon={<Visibility />} onClick={() => onViewMap?.(alert)}>
            View on Map
          </Button>
          {(alert.status === 'active' || alert.status === 'acknowledged') && (
            <Button size="small" variant="outlined" color="success" startIcon={<Done />} onClick={() => onResolve?.(alert.id)}>
              Mark Resolved
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
