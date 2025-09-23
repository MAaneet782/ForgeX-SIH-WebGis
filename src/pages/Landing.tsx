import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, BarChartHorizontal, BookOpen, Users, Info } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="space-y-8">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You are viewing the public preview of the FRA Platform. Some features require login.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-3 space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Forest Rights Act Digital Platform</h1>
          <p className="text-lg text-muted-foreground">
            A unified platform to digitize claims, map community lands, and deliver benefits to FRA Patta Holders with transparency and accountability.
          </p>
          <div className="flex space-x-4 pt-4">
            <Button asChild size="lg">
              <Link to="/atlas">
                Explore FRA Atlas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/atlas/analytics">
                View Analytics
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <img 
            src="/placeholder.svg" 
            alt="Community meeting" 
            className="rounded-lg shadow-lg w-full h-auto object-cover bg-card"
          />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Supporting communities through data and maps
          </p>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Records Digitized
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 M</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Area Mapped (SQ KM)
            </CardTitle>
            <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">
              +180.1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiaries Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850 K</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Landing;