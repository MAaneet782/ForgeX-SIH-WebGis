import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Geometry } from 'geojson';
import { LatLngExpression } from 'leaflet';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';

interface ClaimLocationMapProps {
  geometry: Geometry;
}

const MapController = ({ geometry }: { geometry: Geometry }) => {
  const map = useMap();
  const bounds = useMemo(() => {
    if (!geometry) return null;
    // @ts-ignore
    return L.geoJSON(geometry).getBounds();
  }, [geometry]);

  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bounds, map]);

  return null;
};

const ClaimLocationMap = ({ geometry }: ClaimLocationMapProps) => {
  const center: LatLngExpression = [22.5937, 78.9629];

  if (!geometry) {
    return <div className="flex items-center justify-center h-full bg-muted"><p>No location data available.</p></div>;
  }

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
      />
      <GeoJSON data={geometry} style={{ color: '#f59e0b', weight: 3, fillOpacity: 0.4 }} />
      <MapController geometry={geometry} />
    </MapContainer>
  );
};

export default ClaimLocationMap;