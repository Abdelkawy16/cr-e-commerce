import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  latitude: number;
  longitude: number;
  height?: string;
  width?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  isSelectable?: boolean;
  zoom?: number;
}

const GoogleMapComponent: React.FC<MapProps> = ({
  latitude,
  longitude,
  height = '400px',
  width = '100%',
  onLocationSelect,
  isSelectable = false,
  zoom = 15
}) => {
  const mapContainerStyle = {
    width,
    height,
  };

  const center = {
    lat: latitude,
    lng: longitude
  };

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (isSelectable && onLocationSelect && e.latLng) {
      onLocationSelect(e.latLng.lat(), e.latLng.lng());
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAVwR9jsWhxjLnhIvWXiFDvnxdE1TuvldQ'}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        onClick={handleClick}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;