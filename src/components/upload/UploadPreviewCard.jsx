import React from 'react';
import { Card, CardContent, CardMedia, Box, Typography, Chip, Alert } from '@mui/material';
import { RiskBadge } from '../common/RiskBadge';

export const UploadPreviewCard = ({ photo, zone }) => {
  return (
    <Card sx={{ position: 'sticky', top: 80 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Report Preview</Typography>
        {photo ? (
          <CardMedia component="img" image={photo} sx={{ borderRadius: '8px', mb: 2, maxHeight: 200, objectFit: 'cover' }} />
        ) : (
          <Box sx={{ height: 150, bgcolor: '#F5F5F5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>No photo selected</Typography>
          </Box>
        )}
        {zone && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>{zone.name}</Typography>
            <RiskBadge level={zone.riskLevel} />
          </Box>
        )}
        {zone?.riskLevel === 'red' && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>This zone is already at CRITICAL risk level</Alert>
        )}
        <Chip label="AI Risk Score: Pending" sx={{ width: '100%', bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 500, py: 1 }} />
      </CardContent>
    </Card>
  );
};

export default UploadPreviewCard;
