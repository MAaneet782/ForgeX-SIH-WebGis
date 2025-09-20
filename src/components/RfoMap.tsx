import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { FeatureCollection, Feature, Geometry } from 'geojson';
import { LatLngExpression, Layer, PathOptions, LatLngBoundsExpression } from 'leaflet';
// Removed unused L import

interface RfoMapProps {
  claimsData: FeatureCollection;
}

// Define India's approximate geographical bounds
const INDIA_BOUNDS: LatLngBoundsExpression = [
  [6.0, 68.0], // Southwest coordinates (min Lat, min Lon)
  [37.0, 98.0]  // Northeast coordinates (max Lat, max Lon)
];

const RfoMap = ({ claimsData }: RfoMapProps) => {
  const center: LatLngExpression = [22.5937, 78.9629]; // Centered on India

  const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
    if (feature.properties) {
      const holderName = feature.properties.holderName || 'N/A';
      const claimId = feature.properties.claimId || 'N/A';
      const village = feature.properties.village || 'N/A';
      const areaAcres = feature.properties.area;
      const areaHectares = areaAcres ? (areaAcres * 0.404686).toFixed(2) : 'N/A';

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; padding: 8px; color: hsl(var(--foreground));">
          <h4 style="margin: 0 0 10px 0; font-weight: 600; font-size: 1.1em; color: hsl(var(--primary));">Land Parcel Details</h4>
          <p style="margin: 0 0 6px 0; font-size: 0.9em;"><strong>Holder Name:</strong> ${holderName}</p>
          <p style="margin: 0 0 6px 0; font-size: 0.9em;"><strong>Village:</strong> ${village}</p>
          <p style="margin: 0 0 6px 0; font-size: 0.9em;"><strong>Title ID:</strong> ${claimId}</p>
          <p style="margin: 0; font-size: 0.9em;"><strong>Area:</strong> ${areaHectares} Hectares</p>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  const defaultClaimStyle: PathOptions = {
    color: '#166534', // Dark green
    weight: 2,
    fillColor: '#22c55e', // Lighter green
    fillOpacity: 0.4,
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={center} 
        zoom={5} 
        minZoom={5} // Prevent zooming out beyond India
        maxBounds={INDIA_BOUNDS} // Restrict panning to India
        maxBoundsViscosity={1.0} // Make bounds sticky
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON 
          data={claimsData} 
          onEachFeature={onEachFeature} 
          style={defaultClaimStyle}
          key={JSON.stringify(claimsData)} // Force re-render if data changes
        />
      </MapContainer>
    </div>
  );
};

export default RfoMap;