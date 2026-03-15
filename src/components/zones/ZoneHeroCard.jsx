import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Grid } from '@mui/material';
import { LocationOn, Terrain, Update } from '@mui/icons-material';
import { RiskBadge } from '../../components/common/RiskBadge';
import { formatDateTime } from '../../utils/formatUtils';

export const ZoneHeroCard = ({ zone }) => {
  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2B3C 100%)', color: '#fff' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {zone.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Terrain sx={{ fontSize: 16, opacity: 0.7 }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {zone.mineName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 16, opacity: 0.7 }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {zone.district} District
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <RiskBadge level={zone.riskLevel} size="medium" sx={{ mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {zone.riskScore}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>Risk Score</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Chip label={zone.status} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 500 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Update sx={{ fontSize: 14, opacity: 0.6 }} />
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Updated: {formatDateTime(zone.lastUpdated)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ZoneHeroCard;
