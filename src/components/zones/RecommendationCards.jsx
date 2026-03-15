import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import {
  Shield as SafeIcon,
  Visibility as MonitorIcon,
  Block as RestrictIcon,
  Warning as EvacuateIcon,
} from '@mui/icons-material';

const ICON_MAP = {
  Safe: <SafeIcon />,
  Monitor: <MonitorIcon />,
  Restrict: <RestrictIcon />,
  Evacuate: <EvacuateIcon />,
};

const SEVERITY_COLORS = {
  low: { bg: '#E8F5E9', border: '#2E7D32', text: '#2E7D32' },
  medium: { bg: '#FFF8E1', border: '#F9A825', text: '#E65100' },
  high: { bg: '#FFF3E0', border: '#E65100', text: '#E65100' },
  critical: { bg: '#FFEBEE', border: '#B71C1C', text: '#B71C1C' },
};

export const RecommendationCards = ({ recommendations }) => {
  return (
    <Grid container spacing={2}>
      {recommendations.map((rec, idx) => {
        const colors = SEVERITY_COLORS[rec.severity] || SEVERITY_COLORS.low;
        return (
          <Grid item xs={12} sm={6} key={idx}>
            <Card
              sx={{
                borderLeft: `4px solid ${colors.border}`,
                bgcolor: colors.bg,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ color: colors.text }}>{ICON_MAP[rec.type]}</Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text }}>
                    {rec.type}
                  </Typography>
                  <Chip
                    label={rec.severity.toUpperCase()}
                    size="small"
                    sx={{
                      ml: 'auto',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      bgcolor: colors.border,
                      color: '#fff',
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {rec.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default RecommendationCards;
