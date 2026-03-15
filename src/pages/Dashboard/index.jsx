import React from 'react';
import { Box, Typography, Grid, List, ListItemButton, ListItemText, Chip, Button } from '@mui/material';
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import { KpiRow } from '../../components/dashboard/KpiRow';
import { RiskTrendChart } from '../../components/dashboard/RiskTrendChart';
import { ZoneDistributionChart } from '../../components/dashboard/ZoneDistributionChart';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { RainfallWidget } from '../../components/dashboard/RainfallWidget';
import { SectionCard } from '../../components/common/SectionCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { getRiskColor } from '../../utils/riskUtils';
import { formatTimeAgo } from '../../utils/formatUtils';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    kpis, recentAlerts, distribution, trendData,
    activityFeed, rainfallSummary, zones,
  } = useDashboardData();

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Dashboard</Typography>

      <KpiRow kpis={kpis} />

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        {/* Left: Mini Map */}
        <Grid item xs={12} md={7}>
          <SectionCard
            title="Zone Risk Map"
            action={<Button size="small" onClick={() => navigate('/map')}>Full Map</Button>}
          >
            <Box sx={{ height: 320, borderRadius: '8px', overflow: 'hidden' }}>
              <MapContainer
                center={[19.0, 75.0]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {zones.map((zone) => (
                  <Polygon
                    key={zone.id}
                    positions={zone.latlngs}
                    pathOptions={{
                      color: getRiskColor(zone.riskLevel),
                      fillColor: getRiskColor(zone.riskLevel),
                      fillOpacity: 0.5,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => navigate(`/zones/${zone.id}`),
                    }}
                  >
                    <Tooltip>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{zone.name}</Typography>
                      <Typography variant="caption">{zone.mineName}</Typography>
                    </Tooltip>
                  </Polygon>
                ))}
              </MapContainer>
            </Box>
          </SectionCard>
        </Grid>

        {/* Right: Recent Alerts */}
        <Grid item xs={12} md={5}>
          <SectionCard
            title="Recent Alerts"
            action={<Button size="small" onClick={() => navigate('/alerts')}>View All</Button>}
          >
            <List disablePadding>
              {recentAlerts.map((alert) => (
                <ListItemButton
                  key={alert.id}
                  sx={{
                    px: 1,
                    py: 1.5,
                    borderRadius: '8px',
                    mb: 0.5,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate('/alerts')}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RiskBadge level={alert.riskLevel} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {alert.zoneName}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                        {alert.triggerReason.substring(0, 80)}...
                      </Typography>
                    }
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', ml: 1 }}>
                    {formatTimeAgo(alert.timestamp)}
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          </SectionCard>
        </Grid>

        {/* Rainfall Widget */}
        <Grid item xs={12} md={4}>
          <SectionCard title="Rainfall Warning">
            <RainfallWidget data={rainfallSummary} />
          </SectionCard>
        </Grid>

        {/* Risk Trend */}
        <Grid item xs={12} md={8}>
          <SectionCard title="Risk Trend — Last 30 Days">
            <RiskTrendChart data={trendData} />
          </SectionCard>
        </Grid>

        {/* Zone Distribution */}
        <Grid item xs={12} md={5}>
          <SectionCard title="Zone Risk Distribution">
            <ZoneDistributionChart distribution={distribution} />
          </SectionCard>
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12} md={7}>
          <SectionCard title="Recent Activity">
            <ActivityFeed items={activityFeed} />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
