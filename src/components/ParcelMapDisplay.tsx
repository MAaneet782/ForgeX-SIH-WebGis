import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Feature, Geometry } from 'geojson';
import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

interface ParcelMapDisplayProps {
  geometry: Geometry;
  claimId: string; // Used for unique key and potential future features
}

const MapBoundsAdjuster = ({ geometry }: { geometry: Geometry }) => {
  const map = useMap();

  useEffect(() => {
    if (geometry) {
      // @ts-ignore
      const bounds = L.geoJSON(geometry).getBounds();
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [10, 10], maxZoom: 14 });
      }
    }
  }, [geometry, map]);

  return null;
};

const ParcelMapDisplay = ({ geometry, claimId }: ParcelMapDisplayProps) => {
  const defaultCenter: LatLngExpression = [22.5937, 78.9629]; // Centered on India
  const defaultZoom = 5;

  const geoJsonStyle = {
    color: '#d97706', // Orange for selected parcel
    weight: 3,
    fillColor: '#f59e0b',
    fillOpacity: 0.6,
  };

  const feature: Feature = {
    type: "Feature",
    properties: { claimId: claimId },
    geometry: geometry,
  };

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border">
      <MapContainer center={defaultCenter} zoom={defaultZoom} className="h-full w-full" zoomControl={false} attributionControl={false}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
          maxZoom={18}
        />
        <GeoJSON data={feature} style={geoJsonStyle} />
        <MapBoundsAdjuster geometry={geometry} />
      </MapContainer>
    </div>
  );
};

export default ParcelMapDisplay;