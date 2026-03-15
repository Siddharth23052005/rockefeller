import React, { useState } from 'react';
import { Box, IconButton, Chip, Typography } from '@mui/material';
import { FilterAlt, Close as CloseIcon } from '@mui/icons-material';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useMapData } from './useMapData';
import { ZonePolygon } from '../../components/map/ZonePolygon';
import { MapLegend } from '../../components/map/MapLegend';
import { FilterDrawer } from '../../components/map/FilterDrawer';
import { ZoneDetailsDrawer } from '../../components/map/ZoneDetailsDrawer';

const MapViewPage = () => {
  const {
    zones, filters, updateFilter, clearFilters,
    selectedZone, setSelectedZone, filterOptions,
  } = useMapData();

  const [filterOpen, setFilterOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handlePolygonClick = (zone) => {
    setSelectedZone(zone);
    setDetailsOpen(true);
  };

  const activeFilterCount = Object.values(filters).reduce((sum, v) => sum + v.length, 0);

  return (
    <Box sx={{ position: 'relative', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Zone Risk Map</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            label={`${zones.length} zones`}
            size="small"
            sx={{ fontWeight: 500 }}
          />
          <IconButton
            onClick={() => setFilterOpen(!filterOpen)}
            sx={{
              bgcolor: filterOpen || activeFilterCount > 0 ? 'primary.main' : 'action.hover',
              color: filterOpen || activeFilterCount > 0 ? '#fff' : 'text.primary',
              '&:hover': {
                bgcolor: filterOpen || activeFilterCount > 0 ? 'primary.dark' : 'action.selected',
              },
            }}
            size="small"
          >
            <FilterAlt fontSize="small" />
          </IconButton>
          {activeFilterCount > 0 && (
            <Chip
              label={`${activeFilterCount} active`}
              size="small"
              onDelete={clearFilters}
              deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>
      </Box>

      {/* Map container */}
      <Box sx={{ flexGrow: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer
          center={[19.0, 75.0]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {zones.map((zone) => (
            <ZonePolygon
              key={zone.id}
              zone={zone}
              onClick={handlePolygonClick}
            />
          ))}
        </MapContainer>

        <MapLegend />

        {/* Filter Drawer overlay */}
        {filterOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              zIndex: 1001,
              bgcolor: '#fff',
              width: 300,
              borderRight: '1px solid',
              borderColor: 'divider',
              overflow: 'auto',
              borderRadius: '12px 0 0 12px',
            }}
          >
            <FilterDrawer
              open={true}
              onClose={() => setFilterOpen(false)}
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              options={filterOptions}
            />
          </Box>
        )}
      </Box>

      {/* Zone Details Drawer */}
      <ZoneDetailsDrawer
        zone={selectedZone}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedZone(null);
        }}
      />
    </Box>
  );
};

export default MapViewPage;
