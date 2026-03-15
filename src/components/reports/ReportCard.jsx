import React from 'react';
import { Card, CardContent, CardMedia, Box, Typography, Button, Chip } from '@mui/material';
import { Visibility, Check, Close } from '@mui/icons-material';
import { RiskBadge } from '../common/RiskBadge';
import { StatusChip } from '../common/StatusChip';
import { formatDateTime } from '../../utils/formatUtils';

export const ReportCard = ({ report, variant = 'list' }) => {
  const severityMap = { critical: 'red', high: 'orange', medium: 'yellow', low: 'green' };

  if (variant === 'gallery') {
    return (
      <Card sx={{ height: '100%' }}>
        <CardMedia component="img" height={160} image={report.image} alt="Report" sx={{ objectFit: 'cover' }} />
        <CardContent sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{report.zoneName}</Typography>
            <RiskBadge level={severityMap[report.severity]} />
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{report.reportedBy}</Typography>
          <Box sx={{ mt: 1 }}>
            <StatusChip status={report.reviewStatus} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'flex-start' }}>
        <CardMedia
          component="img"
          image={report.image}
          alt="Report"
          sx={{ width: 100, height: 80, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{report.zoneName}</Typography>
            <RiskBadge level={severityMap[report.severity]} />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{report.reportedBy}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            {formatDateTime(report.timestamp)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusChip status={report.reviewStatus} />
            <Button size="small" startIcon={<Visibility />} sx={{ fontSize: '0.7rem' }}>View</Button>
            <Button size="small" color="success" startIcon={<Check />} sx={{ fontSize: '0.7rem' }}>Verify</Button>
            <Button size="small" color="inherit" startIcon={<Close />} sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Dismiss</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
