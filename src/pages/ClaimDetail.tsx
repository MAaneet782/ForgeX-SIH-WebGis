import { useParams, Link } from "react-router-dom";
import { claims } from "@/data/mockClaims";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AiAnalysisPanel from "@/components/AiAnalysisPanel";
import SchemeEligibility from "@/components/SchemeEligibility";

const ClaimDetail = () => {
  const { claimId } = useParams();
  const claim = claims.find((c) => c.id === claimId);

  if (!claim) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Claim not found</h2>
        <Button asChild variant="link">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>
      
      <header>
        <h1 className="text-3xl font-bold">Personal Dashboard</h1>
        <p className="text-muted-foreground">Claim Holder: {claim.holderName}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claim Information</CardTitle>
          </Header>
          <CardContent className="space-y-2">
            <div className="flex justify-between"><span>Claim ID:</span> <span className="font-mono">{claim.id}</span></div>
            <div className="flex justify-between"><span>Village:</span> <span>{claim.village}</span></div>
            <div className="flex justify-between"><span>District:</span> <span>{claim.district}</span></div>
            <div className="flex justify-between"><span>State:</span> <span>{claim.state}</span></div>
            <div className="flex justify-between"><span>Area:</span> <span>{claim.area.toFixed(2)} acres</span></div>
            <div className="flex justify-between items-center"><span>Status:</span> <Badge variant={claim.status === 'Approved' ? 'default' : claim.status === 'Pending' ? 'secondary' : 'destructive'}>{claim.status}</Badge></div>
          </CardContent>
        </Card>
        <SchemeEligibility claim={claim} />
      </div>

      <AiAnalysisPanel claim={claim} />
    </div>
  );
};

export default ClaimDetail;