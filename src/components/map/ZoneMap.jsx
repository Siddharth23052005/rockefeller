import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

export const ZoneMap = ({ children, center, zoom, style = {} }) => {
  return (
    <MapContainer
      center={center || [19.0, 75.0]}
      zoom={zoom || 7}
      style={{ height: '100%', width: '100%', ...style }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default ZoneMap;
