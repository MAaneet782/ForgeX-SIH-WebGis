import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Claim } from "@/data/mockClaims";
import { MapPin, DollarSign, FileText } from "lucide-react";

interface ClaimInfoCardProps {
  claim: Claim;
}

const ClaimInfoCard = ({ claim }: ClaimInfoCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Claim Information</CardTitle>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Holder Name:</span>
          <span className="font-medium">{claim.holderName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Village:</span>
          <span className="font-medium">{claim.village}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">District:</span>
          <span className="font-medium">{claim.district}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">State:</span>
          <span className="font-medium">{claim.state}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Area (acres):</span>
          <span className="font-medium">{claim.area.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant={claim.status === 'Approved' ? 'default' : claim.status === 'Pending' ? 'secondary' : 'destructive'}>
            {claim.status}
          </Badge>
        </div>
        {claim.documentName && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Document:</span>
            <span className="font-medium truncate">{claim.documentName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Soil Type:</span>
          <span className="font-medium">{claim.soilType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Water Availability:</span>
          <span className="font-medium">{claim.waterAvailability}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Est. Crop Value:</span>
          <span className="font-medium">₹{claim.estimatedCropValue.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimInfoCard;