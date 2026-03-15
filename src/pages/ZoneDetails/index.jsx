import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Info as OverviewIcon, History as HistoryIcon, CameraAlt as PhotoIcon,
  Cloud as WeatherIcon, Recommend as RecIcon, Terrain, Landscape, WaterDrop, Explore,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import { useZoneData } from './useZoneData';
import { ZoneHeroCard } from '../../components/zones/ZoneHeroCard';
import { ZoneTabs } from '../../components/zones/ZoneTabs';
import { HistoryTable } from '../../components/zones/HistoryTable';
import { ZonePhotos } from '../../components/zones/ZonePhotos';
import { WeatherTab } from '../../components/zones/WeatherTab';
import { RecommendationCards } from '../../components/zones/RecommendationCards';
import { getRiskColor } from '../../utils/riskUtils';

const TAB_CONFIG = [
  { id: 'overview', label: 'Overview', icon: <OverviewIcon fontSize="small" /> },
  { id: 'history', label: 'History', icon: <HistoryIcon fontSize="small" /> },
  { id: 'photos', label: 'Photos', icon: <PhotoIcon fontSize="small" /> },
  { id: 'weather', label: 'Weather', icon: <WeatherIcon fontSize="small" /> },
  { id: 'recommendations', label: 'Recommendations', icon: <RecIcon fontSize="small" /> },
];

const OverviewInfoCard = ({ icon, title, value, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{title}</Typography>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{value}</Typography>
      {subtitle && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{subtitle}</Typography>}
    </CardContent>
  </Card>
);

const ZoneDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const { zone, zoneHistory, zoneReports, zoneWeather, recommendations, rainfallTrend } = useZoneData(id);

  if (!zone) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6">Zone not found</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          The zone ID &quot;{id}&quot; does not exist.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <ZoneHeroCard zone={zone} />
      <ZoneTabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} tabs={TAB_CONFIG} />

      {/* Overview Tab */}
      {tabIndex === 0 && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <OverviewInfoCard icon={<Terrain />} title="Slope Angle" value={`${zone.slopeAngle}\u00B0`} subtitle="Measured inclination" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <OverviewInfoCard icon={<Landscape />} title="Soil Type" value={zone.soilType} subtitle="Primary composition" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <OverviewInfoCard icon={<WaterDrop />} title="Rainfall (7d)" value={`${zone.recentRainfall} mm`} subtitle="Last 7 days total" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <OverviewInfoCard icon={<Explore />} title="Blasts (7d)" value={zone.blastCount7d} subtitle="Recent blast events" />
            </Grid>
          </Grid>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Zone Location</Typography>
              <Box sx={{ height: 250, borderRadius: '8px', overflow: 'hidden' }}>
                <MapContainer
                  center={zone.latlngs[0]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Polygon
                    positions={zone.latlngs}
                    pathOptions={{ color: getRiskColor(zone.riskLevel), fillColor: getRiskColor(zone.riskLevel), fillOpacity: 0.4 }}
                  />
                </MapContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* History Tab */}
      {tabIndex === 1 && <HistoryTable historyData={zoneHistory} />}

      {/* Photos Tab */}
      {tabIndex === 2 && <ZonePhotos reports={zoneReports} />}

      {/* Weather Tab */}
      {tabIndex === 3 && <WeatherTab weatherData={zoneWeather} rainfallTrend={rainfallTrend} />}

      {/* Recommendations Tab */}
      {tabIndex === 4 && <RecommendationCards recommendations={recommendations} />}
    </Box>
  );
};

export default ZoneDetailsPage;
