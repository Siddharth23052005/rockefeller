import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { WaterDrop, TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { getRiskColor } from '../../utils/riskUtils';

const TREND_ICON = {
  increasing: <TrendingUp fontSize="small" />,
  decreasing: <TrendingDown fontSize="small" />,
  stable: <TrendingFlat fontSize="small" />,
};

export const RainfallWidget = ({ data }) => {
  const riskColor = getRiskColor(data.warningLevel);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <WaterDrop sx={{ color: riskColor }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {data.district} District
        </Typography>
        <Chip
          label={data.warningLevel.toUpperCase()}
          size="small"
          sx={{ bgcolor: riskColor, color: '#fff', fontWeight: 600, fontSize: '0.65rem', ml: 'auto' }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last 24h</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{data.rainfallLast24h} mm</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last 7 days</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{data.rainfallLast7d} mm</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
        {TREND_ICON[data.trend]}
        <Typography variant="body2">
          Trend: {data.trend.charAt(0).toUpperCase() + data.trend.slice(1)}
        </Typography>
      </Box>
    </Box>
  );
};

export default RainfallWidget;
