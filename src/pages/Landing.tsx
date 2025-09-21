import { Link } from "react-router-dom";
import { Home, BookOpen, BarChart2, LogIn, HelpCircle, Search, Bell, Mail, User, Info, Map, TrendingUp, FileDigit, Users, Globe, Leaf, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ForestBackground } from "@/components/ForestBackground";

const StatCard = ({ icon: Icon, title, value, description }: { icon: React.ElementType, title: string, value: string, description: string }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-card border-b p-3 flex items-center justify-between flex-wrap gap-2 z-10">
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="flex items-center gap-2 text-primary font-semibold transition-colors duration-200"><Leaf className="h-5 w-5" /> FRA Platform</Link>
          <Link to="/atlas" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"><Map className="h-4 w-4" /> Explore Atlas</Link>
          <Link to="/atlas/analytics" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"><BarChart2 className="h-4 w-4" /> Analytics</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search site" className="pl-9 h-9 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary" />
          </div>
          <Button variant="ghost" size="icon" className="relative transition-colors duration-200 hover:bg-accent">
            <Bell className="h-5 w-5" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs leading-none">0</Badge>
          </Button>
          <Button variant="ghost" size="icon" className="transition-colors duration-200 hover:bg-accent"><Mail className="h-5 w-5" /></Button>
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline" className="flex items-center gap-2 transition-colors duration-200 hover:bg-accent">
              <LogIn className="h-4 w-4" /> Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        <Alert className="mb-8 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-500/50 dark:text-blue-300">
          <Info className="h-4 w-4 !text-blue-800 dark:!text-blue-300" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You are viewing the public preview of the FRA Platform. Some features require login.
          </AlertDescription>
        </Alert>

        <section className="relative py-16 md:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Empowering Forest Communities with <span className="text-primary">Digital Land Rights</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A unified platform to digitize claims, map community lands, and deliver benefits to FRA Patta Holders with transparency and accountability.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="px-8 py-6 text-lg transition-colors duration-200 hover:bg-primary/90">
                <Link to="/atlas"><Map className="mr-2 h-5 w-5" /> Explore FRA Atlas</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-6 text-lg transition-colors duration-200 hover:bg-accent">
                <Link to="/atlas/analytics"><TrendingUp className="mr-2 h-5 w-5" /> View Analytics</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* New section for the image */}
        <section className="mt-16 md:mt-24 max-w-6xl mx-auto">
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl">
            <img 
              src="https://picsum.photos/seed/fra-atlas/1200/600" 
              alt="Placeholder image for FRA Atlas project" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          </div>
        </section>

        <section className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <StatCard icon={FileDigit} title="Records Digitized" value="1.2 Million" description="Total land claims processed" />
          <StatCard icon={Map} title="Area Mapped (SQ KM)" value="45,231" description="Total land under FRA claims" />
          <StatCard icon={Users} title="Beneficiaries Served" value="850 Thousand" description="Number of households impacted" />
        </section>

        <section className="mt-16 md:mt-24 py-16 bg-card rounded-lg shadow-xl max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            <Card className="text-center p-6 transition-shadow duration-300 hover:shadow-lg">
              <Map className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Interactive GIS Map</CardTitle>
              <CardDescription>Visualize land claims, water bodies, and agricultural areas with rich geospatial data.</CardDescription>
            </Card>
            <Card className="text-center p-6 transition-shadow duration-300 hover:shadow-lg">
              <BarChart2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Advanced Analytics</CardTitle>
              <CardDescription>Gain insights into crop value, soil types, and demographic data across districts.</CardDescription>
            </Card>
            <Card className="text-center p-6 transition-shadow duration-300 hover:shadow-lg">
              <Info className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">AI-Powered Decision Support</CardTitle>
              <CardDescription>Receive intelligent recommendations for crop suitability, water management, and economic opportunities.</CardDescription>
            </Card>
            <Card className="text-center p-6 transition-shadow duration-300 hover:shadow-lg">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Scheme Eligibility</CardTitle>
              <CardDescription>Automated assessment of eligibility for various government welfare schemes.</CardDescription>
            </Card>
            <Card className="text-center p-6 transition-shadow duration-300 hover:shadow-lg">
              <FileDigit className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Digitized Claims Management</CardTitle>
              <CardDescription>Efficiently manage and track land claims with digital documentation.</CardDescription>
            </Card>
            <Card className="text-center p-6 transition-shadow duration-300 hover:shadow-lg">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Community Empowerment</CardTitle>
              <CardDescription>Foster transparency and accountability in land rights and resource management.</CardDescription>
            </Card>
          </div>
        </section>
      </main>

      {/* Forest Background */}
      <ForestBackground />
    </div>
  );
};

export default LandingPage;