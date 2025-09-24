import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const RfoDashboard = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <Construction className="mr-4 h-8 w-8 text-primary" />
            RFO Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is under construction. The dashboard for Range Forest Officers will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RfoDashboard;