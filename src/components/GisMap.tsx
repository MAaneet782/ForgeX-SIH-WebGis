import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import { FeatureCollection, Feature, Geometry } from 'geojson';
import { Layer, LatLngExpression, PathOptions } from 'leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import { useDashboardState } from '@/context/DashboardStateContext';
import type { Claim } from '@/types'; // Corrected import path

interface GisMapProps {
  claims: Claim[];
  claimsData: FeatureCollection;
  waterData: FeatureCollection;
  agriData: FeatureCollection;
  selectedClaimId: string | null;
  onClaimSelect: (id: string | null) => void;
}

const MapController = ({ selectedClaimId, data }: { selectedClaimId: string | null, data: FeatureCollection }) => {
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

const GisMap = ({ claims, claimsData, waterData, agriData, selectedClaimId, onClaimSelect }: GisMapProps) => {
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
          onClaimSelect(feature.properties.claimId);
        },
      });
    }
  };

  const styleClaimFeature = (feature?: Feature): PathOptions => {
    const claimId = feature?.properties?.claimId;
    const claim = claims.find(c => c.id === claimId);
    
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
    if (claimId === selectedClaimId) {
      style = { color: '#d97706', weight: 3, fillColor: '#f59e0b', fillOpacity: 0.6 };
    }
    
    return style;
  };

  const waterStyle: PathOptions = { color: '#0ea5e9', weight: 2, fillColor: '#38bdf8', fillOpacity: 0.5 };
  const agriStyle: PathOptions = { color: '#16a34a', weight: 2, fillColor: '#4ade80', fillOpacity: 0.4 };

  return (
    <MapContainer center={center} zoom={5} className="h-full w-full">
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
        
        {state.visibleLayers.claims && (
          <LayersControl.Overlay checked name="FRA Claims">
            <GeoJSON 
              data={claimsData} 
              onEachFeature={onEachFeature} 
              style={styleClaimFeature}
              key={selectedClaimId + JSON.stringify(state.activeFilters)} // Force re-render on selection/filter change
            />
          </LayersControl.Overlay>
        )}
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
      </LayersControl>
      <MapController selectedClaimId={selectedClaimId} data={claimsData} />
    </MapContainer>
  );
};

export default GisMap;