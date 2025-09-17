import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import { Geometry } from 'geojson';
import { LatLngExpression } from 'leaflet';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { Droplets } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

interface ClaimLocationMapProps {
  geometry: Geometry;
  waterIndexLocation?: LatLngExpression; // New prop for water index point
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

const ClaimLocationMap = ({ geometry, waterIndexLocation }: ClaimLocationMapProps) => {
  const center: LatLngExpression = [22.5937, 78.9629];

  if (!geometry) {
    return <div className="flex items-center justify-center h-full bg-muted"><p>No location data available.</p></div>;
  }

  // Custom icon for water index
  const waterIcon = L.divIcon({
    html: ReactDOMServer.renderToString(<Droplets className="h-6 w-6 text-blue-600 bg-white rounded-full p-1 shadow-md" />),
    className: 'custom-water-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24], // Center the icon bottom
    popupAnchor: [0, -20],
  });

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
      />
      <GeoJSON data={geometry} style={{ color: '#f59e0b', weight: 3, fillOpacity: 0.4 }} />
      
      {waterIndexLocation && (
        <Marker position={waterIndexLocation} icon={waterIcon}>
          <Popup>
            Water Index Location
          </Popup>
        </Marker>
      )}

      <MapController geometry={geometry} />
    </MapContainer>
  );
};

export default ClaimLocationMap;