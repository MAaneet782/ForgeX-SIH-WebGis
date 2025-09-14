import { useParams, Link } from "react-router-dom";
import { claims, waterBodiesGeoJson } from "@/data/mockClaims";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, Fish, Briefcase } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import type { Claim } from "@/data/mockClaims";

// --- AI Recommendation Engine (Rule-Based Simulation) ---

const getCropRecommendations = (claim: Claim) => {
  const recommendations = [];
  if (claim.state === "Maharashtra") {
    recommendations.push({ name: "Cotton", reason: "Well-suited for the climate of Maharashtra." });
    recommendations.push({ name: "Sugarcane", reason: "High-yield crop if water is available." });
  } else if (claim.state === "Madhya Pradesh") {
    recommendations.push({ name: "Soybean", reason: "A major crop in Madhya Pradesh." });
    recommendations.push({ name: "Wheat", reason: "Suitable for the region's soil." });
  } else {
    recommendations.push({ name: "Millets", reason: "Drought-resistant and suitable for varied climates." });
  }
  if (claim.area < 2) {
    recommendations.push({ name: "Vegetables", reason: "High-value crops for small land holdings." });
  }
  return recommendations;
};

const getBusinessRecommendations = (claim: Claim) => {
  const recommendations = [];
  // A simple check to see if the claim is near a mock water body.
  // In a real scenario, this would involve geospatial analysis.
  const isNearWater = waterBodiesGeoJson.features.length > 0;

  if (isNearWater) {
    recommendations.push({ name: "Aquaculture/Fish Farming", reason: "Leverages proximity to water bodies.", icon: Fish });
  }
  recommendations.push({ name: "Beekeeping (Apiculture)", reason: "Low investment, high return from honey and wax.", icon: Briefcase });
  recommendations.push({ name: "Non-Timber Forest Products", reason: "Sustainable harvesting of products like medicinal herbs or tendu leaves.", icon: Leaf });
  
  return recommendations;
};

// --- Components ---

const SchemeEligibility = ({ claim }: { claim: Claim }) => {
  // Same logic as the DecisionSupportPanel
  const schemes = [
    { name: "PM-KISAN", isEligible: claim.status === 'Approved' && claim.area < 5 },
    { name: "National Food Security Mission", isEligible: claim.status === 'Approved' },
    { name: "Rashtriya Krishi Vikas Yojana", isEligible: claim.area > 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheme Eligibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {schemes.map(scheme => (
          <div key={scheme.name} className="flex items-center justify-between">
            <p>{scheme.name}</p>
            {scheme.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const AiRecommendations = ({ claim }: { claim: Claim }) => {
  const cropRecs = getCropRecommendations(claim);
  const businessRecs = getBusinessRecommendations(claim);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Recommendations</CardTitle>
        <CardDescription>Suggestions based on your claim's data and location.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Suggested Crops</h4>
          <div className="space-y-2">
            {cropRecs.map(rec => (
              <div key={rec.name} className="flex items-start space-x-2">
                <Leaf className="h-4 w-4 text-green-600 mt-1" />
                <div>
                  <p className="font-medium">{rec.name}</p>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="font-semibold mb-2">Potential Businesses</h4>
          <div className="space-y-2">
            {businessRecs.map(rec => (
              <div key={rec.name} className="flex items-start space-x-2">
                <rec.icon className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium">{rec.name}</p>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


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
          </CardHeader>
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

      <AiRecommendations claim={claim} />
    </div>
  );
};

export default ClaimDetail;