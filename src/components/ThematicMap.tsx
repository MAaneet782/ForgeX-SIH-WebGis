import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import { FeatureCollection, Feature, Geometry } from 'geojson';
import { LatLngExpression, PathOptions } from 'leaflet';
import type { Claim } from '@/data/mockClaims';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ThematicMapProps {
  claims: Claim[];
  geoJsonData: FeatureCollection;
}

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center space-x-2">
    <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
    <span className="text-sm">{label}</span>
  </div>
);

const MapLegend = () => {
  const soilColors = {
    Alluvial: '#a67c52',
    Clay: '#8c564b',
    Loamy: '#7c6c5c',
    Laterite: '#d6616b',
  };

  const waterColors = {
    High: '#1f77b4',
    Medium: '#aec7e8',
    Low: '#ff7f0e',
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-3">
          <CardTitle className="text-base">Map Legend</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">Soil Type</h4>
            {Object.entries(soilColors).map(([label, color]) => (
              <LegendItem key={label} color={color} label={label} />
            ))}
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Water Availability</h4>
            {Object.entries(waterColors).map(([label, color]) => (
              <LegendItem key={label} color={color} label={label} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ThematicMap = ({ claims, geoJsonData }: ThematicMapProps) => {
  const center: LatLngExpression = [22.5937, 78.9629];

  const styleSoilFeature = (feature?: Feature): PathOptions => {
    const claimId = feature?.properties?.id;
    const claim = claims.find(c => c.id === claimId);
    const soilColors = {
      Alluvial: '#a67c52',
      Clay: '#8c564b',
      Loamy: '#7c6c5c',
      Laterite: '#d6616b',
    };
    const color = claim ? soilColors[claim.soilType] || '#cccccc' : '#cccccc';
    return { color: color, weight: 1, fillColor: color, fillOpacity: 0.6 };
  };

  const styleWaterFeature = (feature?: Feature): PathOptions => {
    const claimId = feature?.properties?.id;
    const claim = claims.find(c => c.id === claimId);
    const waterColors = {
      High: '#1f77b4',
      Medium: '#aec7e8',
      Low: '#ff7f0e',
    };
    const color = claim ? waterColors[claim.waterAvailability] || '#cccccc' : '#cccccc';
    return { color: color, weight: 1, fillColor: color, fillOpacity: 0.6 };
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={5} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Soil Type">
            <GeoJSON 
              data={geoJsonData} 
              style={styleSoilFeature}
              key={'soil-layer-' + claims.length}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Water Availability">
            <GeoJSON 
              data={geoJsonData} 
              style={styleWaterFeature}
              key={'water-layer-' + claims.length}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      <MapLegend />
    </div>
  );
};

export default ThematicMap;