import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ClaimLocationMap from "@/components/ClaimLocationMap";
import type { Claim } from "@/data/mockClaims";
import { LatLngExpression } from "leaflet";

interface ParcelLocationCardProps {
  claim: Claim;
  waterIndexLocation?: LatLngExpression;
}

const ParcelLocationCard = ({ claim, waterIndexLocation }: ParcelLocationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parcel Location</CardTitle>
        <CardDescription>Geographical location of the claimed land.</CardDescription>
      </CardHeader>
      <CardContent className="h-64 p-0">
        <ClaimLocationMap geometry={claim.geometry!} waterIndexLocation={waterIndexLocation} />
      </CardContent>
    </Card>
  );
};

export default ParcelLocationCard;