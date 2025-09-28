import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, Info, FileText, Award, CheckSquare } from "lucide-react";
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
          <h1 className="text-5xl font-bold tracking-tight text-shadow">Forest Rights Act Digital Platform</h1>
          <p className="text-lg text-muted-foreground">
            A unified platform to digitize claims, map community lands, and deliver benefits to FRA Patta Holders with transparency and accountability.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg">
              <Link to="/atlas">
                Explore FRA Atlas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/atlas/state-wise-analytics">
                National FRA Report Card
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <img 
            src="/hero-image.webp" 
            alt="Community meeting" 
            className="rounded-lg w-full h-auto object-cover"
          />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Supporting communities through data and maps
          </p>
        </div>
      </div>

      <section className="pt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">National FRA Implementation Status</h2>
          <p className="text-muted-foreground mt-2">An overview of the Forest Rights Act implementation across the country.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Claims Filed
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{(5156090).toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {(4943662).toLocaleString('en-IN')} Individual
              </p>
              <p className="text-xs text-muted-foreground">
                {(212428).toLocaleString('en-IN')} Community
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Titles Distributed
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{(2513062).toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {(2391199).toLocaleString('en-IN')} Individual
              </p>
              <p className="text-xs text-muted-foreground">
                {(121863).toLocaleString('en-IN')} Community
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Claims Disposed Of</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{(4386436).toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="font-semibold text-primary">85.07%</span> of total claims have been processed.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;