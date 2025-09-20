import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Claim } from "@/data/mockClaims";

interface ClaimInfoCardProps {
  claim: Claim;
}

const ClaimInfoCard = ({ claim }: ClaimInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Information</CardTitle>
        <CardDescription>Key details about the land parcel and its holder.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between"><span>Claim ID:</span> <span className="font-mono">{claim.id}</span></div>
        <div className="flex justify-between"><span>Holder Name:</span> <span>{claim.holderName}</span></div>
        <div className="flex justify-between"><span>Village:</span> <span>{claim.village}</span></div>
        <div className="flex justify-between"><span>District:</span> <span>{claim.district}</span></div>
        <div className="flex justify-between"><span>State:</span> <span>{claim.state}</span></div>
        <div className="flex justify-between"><span>Area:</span> <span>{claim.area.toFixed(2)} acres</span></div>
        <div className="flex justify-between items-center"><span>Status:</span> <Badge variant={claim.status === 'Approved' ? 'default' : claim.status === 'Pending' ? 'secondary' : 'destructive'}>{claim.status}</Badge></div>
        <div className="flex justify-between"><span>Soil Type:</span> <span>{claim.soilType}</span></div>
        <div className="flex justify-between"><span>Water Availability:</span> <span>{claim.waterAvailability}</span></div>
        <div className="flex justify-between"><span>Estimated Crop Value:</span> <span>₹{claim.estimatedCropValue.toLocaleString()}</span></div>
      </CardContent>
    </Card>
  );
};

export default ClaimInfoCard;