import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { WaterDrop, TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getRiskColor } from '../../utils/riskUtils';
import { SectionCard } from '../common/SectionCard';

const TREND_ICONS = {
  increasing: <TrendingUp fontSize="small" />,
  decreasing: <TrendingDown fontSize="small" />,
  stable: <TrendingFlat fontSize="small" />,
};

export const WeatherTab = ({ weatherData, rainfallTrend }) => {
  if (!weatherData) {
    return <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>No weather data available</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <SectionCard sx={{ flex: '1 1 200px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <WaterDrop sx={{ color: getRiskColor(weatherData.warningLevel) }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Rainfall Summary</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last 24h</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{weatherData.rainfallLast24h} mm</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last 7 days</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{weatherData.rainfallLast7d} mm</Typography>
            </Box>
          </Box>
        </SectionCard>
        <SectionCard sx={{ flex: '1 1 200px' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Warning Level</Typography>
          <Chip
            label={weatherData.warningLevel.toUpperCase()}
            sx={{
              bgcolor: getRiskColor(weatherData.warningLevel),
              color: '#fff',
              fontWeight: 600,
              mb: 1,
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            {TREND_ICONS[weatherData.trend]}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {weatherData.trend.charAt(0).toUpperCase() + weatherData.trend.slice(1)}
            </Typography>
          </Box>
        </SectionCard>
      </Box>

      <SectionCard title="14-Day Rainfall Trend">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={rainfallTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E4EA" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: 12 }} />
            <Bar dataKey="rainfall" fill="#0288D1" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </Box>
  );
};

export default WeatherTab;
