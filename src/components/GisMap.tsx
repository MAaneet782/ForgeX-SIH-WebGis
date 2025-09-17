import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import { FeatureCollection, Feature, Geometry } from 'geojson';
import { Layer, LatLngExpression, PathOptions, LatLngBoundsExpression } from 'leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import { useDashboardState } from '@/context/DashboardStateContext';
import type { Claim } from '@/data/mockClaims';

interface GisMapProps {
  claims: Claim[];
  claimsData: FeatureCollection;
  waterData: FeatureCollection;
  agriData: FeatureCollection;
  selectedClaimDbId: string | null; // Now expects dbId
  onClaimSelect: (dbId: string | null) => void; // Now emits dbId
}

// Define India's approximate geographical bounds
const INDIA_BOUNDS: LatLngBoundsExpression = [
  [6.0, 68.0], // Southwest coordinates (min Lat, min Lon)
  [37.0, 98.0]  // Northeast coordinates (max Lat, max Lon)
];

const MapController = ({ selectedClaimDbId, data }: { selectedClaimDbId: string | null, data: FeatureCollection }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedClaimDbId && data.type === 'FeatureCollection') {
      const feature = data.features.find(
        (f) => f.properties?.dbId === selectedClaimDbId // Match by dbId
      );

      if (feature && feature.geometry) {
        // @ts-ignore
        const bounds = L.geoJSON(feature.geometry).getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  }, [selectedClaimDbId, data, map]);

  return null;
};

const GisMap = ({ claims, claimsData, waterData, agriData, selectedClaimDbId, onClaimSelect }: GisMapProps) => {
  const { state, isLowWaterClaim, isPendingClaim, isMgnregaEligible } = useDashboardState();
  const center: LatLngExpression = [22.5937, 78.9629]; // Centered on India

  const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
    if (feature.properties && feature.properties.holderName) {
      const tooltipContent = `
        <b>Holder:</b> ${feature.properties.holderName}<br/>
        <b>Claim ID:</b> ${feature.properties.claimId}
      `;
      layer.bindTooltip(tooltipContent, { sticky: true });

      layer.on({
        click: () => {
          onClaimSelect(feature.properties.dbId); // Emit dbId on click
        },
      });
    }
  };

  const styleClaimFeature = (feature?: Feature): PathOptions => {
    const claimDbId = feature?.properties?.dbId; // Use dbId for finding claim
    const claim = claims.find(c => c.dbId === claimDbId);
    
    let style: PathOptions = { color: '#166534', weight: 2, fillOpacity: 0.3 }; // Default

    if (claim) {
      if (isMgnregaEligible(claim)) {
        style = { ...style, color: '#8b5cf6', fillColor: '#c4b5fd', fillOpacity: 0.7 };
      }
      if (isPendingClaim(claim)) {
        style = { ...style, color: '#3b82f6', fillColor: '#93c5fd', fillOpacity: 0.7 };
      }
      if (isLowWaterClaim(claim)) {
        style = { ...style, color: '#f59e0b', fillColor: '#fcd34d', fillOpacity: 0.7 };
      }
    }

    // Highlight for selection (overrides other styles)
    if (claimDbId === selectedClaimDbId) { // Match by dbId
      style = { color: '#d97706', weight: 3, fillColor: '#f59e0b', fillOpacity: 0.6 };
    }
    
    return style;
  };

  const waterStyle: PathOptions = { color: '#0ea5e9', weight: 2, fillColor: '#38bdf8', fillOpacity: 0.5 };
  const agriStyle: PathOptions = { color: '#16a34a', weight: 2, fillColor: '#4ade80', fillOpacity: 0.4 };

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
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
              maxZoom={18}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite + Labels">
            <LayerGroup>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
                maxZoom={18}
              />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={18}
              />
            </LayerGroup>
          </LayersControl.BaseLayer>
          
          {/* Reordered layers: Water and Agri first, then Claims on top */}
          {state.visibleLayers.water && (
            <LayersControl.Overlay checked name="Water Bodies">
              <GeoJSON data={waterData} style={waterStyle} />
            </LayersControl.Overlay>
          )}
          {state.visibleLayers.agri && (
            <LayersControl.Overlay checked name="Agricultural Land">
              <GeoJSON data={agriData} style={agriStyle} />
            </LayersControl.Overlay>
          )}
          {state.visibleLayers.claims && (
            <LayersControl.Overlay checked name="FRA Claims">
              <GeoJSON 
                data={claimsData} 
                onEachFeature={onEachFeature} 
                style={styleClaimFeature}
                key={selectedClaimDbId + JSON.stringify(state.activeFilters)} // Force re-render on selection/filter change
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>
        <MapController selectedClaimDbId={selectedClaimDbId} data={claimsData} />
      </MapContainer>
    </div>
  );
};

export default GisMap;