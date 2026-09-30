'use client';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix leaflet default icon issue with webpack
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface ListingMapProps {
  lat: number;
  lng: number;
  onMapClick: (lat: number, lng: number) => void;
}

export default function ListingMap({ lat, lng, onMapClick }: ListingMapProps) {
  return (
    <MapContainer
      center={[lat || 37.7749, lng || -122.4194]}
      zoom={12}
      className="h-64 w-full rounded-xl z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler onMapClick={onMapClick} />
      {lat && lng && <Marker position={[lat, lng]} icon={defaultIcon} />}
    </MapContainer>
  );
}
