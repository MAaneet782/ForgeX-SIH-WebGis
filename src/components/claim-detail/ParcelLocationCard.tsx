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
    color: '#004d40',
    weight: 3,
    fillColor: '#004d40',
    fillOpacity: 0.5,
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
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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