import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { GeoJsonObject, Feature, Geometry } from 'geojson';
import { Layer, LatLngExpression, PathOptions } from 'leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

interface GisMapProps {
  data: GeoJsonObject;
  selectedClaimId: string | null;
}

const MapController = ({ selectedClaimId, data }: { selectedClaimId: string | null, data: GeoJsonObject }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedClaimId && data.type === 'FeatureCollection') {
      const feature = data.features.find(
        (f) => f.properties?.claimId === selectedClaimId
      );

      if (feature && feature.geometry) {
        // @ts-ignore
        const bounds = L.geoJSON(feature.geometry).getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  }, [selectedClaimId, data, map]);

  return null;
};

const GisMap = ({ data, selectedClaimId }: GisMapProps) => {
  const center: LatLngExpression = [22.5937, 78.9629]; // Centered on India

  const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
    if (feature.properties && feature.properties.holderName) {
      const popupContent = `
        <b>Claim Holder:</b> ${feature.properties.holderName}<br/>
        <b>Claim ID:</b> ${feature.properties.claimId}
      `;
      layer.bindPopup(popupContent);
    }
  };

  const styleFeature = (feature?: Feature): PathOptions => {
    if (feature?.properties?.claimId === selectedClaimId) {
      return {
        color: '#fb923c', // Orange
        weight: 3,
        fillColor: '#fdba74', // Lighter Orange
        fillOpacity: 0.6,
      };
    }
    // Default style
    return {
      color: '#3b82f6', // Blue
      weight: 2,
      fillOpacity: 0.2,
    };
  };

  return (
    <MapContainer center={center} zoom={5} className="h-[500px] w-full rounded-md">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON 
        data={data} 
        onEachFeature={onEachFeature} 
        style={styleFeature}
        key={selectedClaimId || 'default'} // Force re-render on selection change
      />
      <MapController selectedClaimId={selectedClaimId} data={data} />
    </MapContainer>
  );
};

export default GisMap;