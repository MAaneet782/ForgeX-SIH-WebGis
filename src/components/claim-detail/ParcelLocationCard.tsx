import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { LatLngExpression, PathOptions } from 'leaflet';
import type { Claim } from "@/data/mockClaims";
import { MapPin } from "lucide-react";

interface ParcelLocationCardProps {
  claim: Claim;
  waterIndexLocation?: LatLngExpression;
}

const ParcelLocationCard = ({ claim, waterIndexLocation }: ParcelLocationCardProps) => {
  const defaultCenter: LatLngExpression = [22.5937, 78.9629]; // Centered on India
  const defaultZoom = 5;

  const claimStyle: PathOptions = {
    color: '#2dd4bf', // A vibrant teal for the border
    weight: 3,
    fillColor: '#2dd4bf', // Same vibrant teal for the fill
    fillOpacity: 0.4, // Slightly lower opacity for a softer look
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-primary" /> Parcel Location
        </CardTitle>
        <CardDescription>Geospatial overview of the claim area.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full rounded-md overflow-hidden">
        {claim.geometry ? (
          <MapContainer 
            center={waterIndexLocation || defaultCenter} 
            zoom={waterIndexLocation ? 13 : defaultZoom} 
            className="h-full w-full"
            scrollWheelZoom={true} // Re-enabled interactivity
            dragging={true} // Re-enabled interactivity
            doubleClickZoom={true} // Re-enabled interactivity
            zoomControl={true} // Show zoom controls
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              maxZoom={18}
            />
            <GeoJSON data={claim.geometry} style={claimStyle} />
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
            No GeoJSON data available for this claim.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParcelLocationCard;