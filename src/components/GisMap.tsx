import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { GeoJsonObject, Feature, Geometry } from 'geojson';
import { Layer, LatLngExpression } from 'leaflet';

interface GisMapProps {
  data: GeoJsonObject;
}

const GisMap = ({ data }: GisMapProps) => {
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

  return (
    <MapContainer center={center} zoom={5} className="h-[500px] w-full rounded-md">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={data} onEachFeature={onEachFeature} />
    </MapContainer>
  );
};

export default GisMap;