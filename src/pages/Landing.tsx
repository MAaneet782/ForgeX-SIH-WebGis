import { Link } from "react-router-dom";
import { Home, BookOpen, BarChart2, LogIn, HelpCircle, Search, Bell, Mail, User, Info, Map, TrendingUp, FileDigit, Users, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const LandingPage = () => {
  const { session, user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-primary-foreground flex flex-col">
        <div className="p-6 border-b border-primary-foreground/20">
          <h1 className="text-2xl font-bold">FRA Platform</h1>
          <p className="text-sm opacity-80">Empowering communities</p>
        </div>
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 text-gray-800 rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
              {session ? user?.email?.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <p className="font-semibold">{session ? user?.email : 'Guest'}</p>
              <p className="text-xs opacity-80">{session ? 'Official Access' : 'Public Access'}</p>
            </div>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <Link to="/" className="flex items-center px-4 py-2 bg-primary-foreground/10 rounded-md">
            <Home className="mr-3 h-5 w-5" /> Home
          </Link>
          <Link to="/atlas" className="flex items-center px-4 py-2 hover:bg-primary-foreground/10 rounded-md">
            <BookOpen className="mr-3 h-5 w-5" /> FRA Atlas
          </Link>
          <Link to="/atlas/analytics" className="flex items-center px-4 py-2 hover:bg-primary-foreground/10 rounded-md">
            <BarChart2 className="mr-3 h-5 w-5" /> Analytics (Public)
          </Link>
        </nav>
        <div className="p-4 border-t border-primary-foreground/20 space-y-2">
          {session ? (
            <button onClick={signOut} className="w-full flex items-center px-4 py-2 hover:bg-primary-foreground/10 rounded-md text-left">
              <LogOut className="mr-3 h-5 w-5" /> Logout
            </button>
          ) : (
            <Link to="/login" className="flex items-center px-4 py-2 hover:bg-primary-foreground/10 rounded-md">
              <LogIn className="mr-3 h-5 w-5" /> Login
            </Link>
          )}
          <Link to="/" className="flex items-center px-4 py-2 hover:bg-primary-foreground/10 rounded-md">
            <HelpCircle className="mr-3 h-5 w-5" /> Help
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b p-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="flex items-center gap-2 text-primary"><Home className="h-4 w-4" /> Home</Link>
            <Link to="/atlas" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><BookOpen className="h-4 w-4" /> Explore Atlas</Link>
            <Link to="/atlas/analytics" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><BarChart2 className="h-4 w-4" /> Analytics</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search site" className="pl-9 h-9" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs leading-none">0</Badge>
            </Button>
            <Button variant="ghost" size="icon"><Mail className="h-5 w-5" /></Button>
            {session ? (
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link to="/atlas">
                  <User className="h-4 w-4" /> {user?.email?.split('@')[0]} <span className="text-xs">▼</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link to="/login">
                  <User className="h-4 w-4" /> Guest <span className="text-xs">▼</span>
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Alert className="mb-8 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-500/50 dark:text-blue-300">
            <Info className="h-4 w-4 !text-blue-800 dark:!text-blue-300" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              {session ? `You are logged in as ${user?.email}.` : 'You are viewing the public preview of the FRA Platform. Some features require login.'}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Forest Rights Act Digital Platform</h1>
              <p className="text-lg text-muted-foreground mb-8">
                A unified platform to digitize claims, map community lands, and deliver benefits to FRA Patta Holders with transparency and accountability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/atlas"><Map className="mr-2 h-5 w-5" /> Explore FRA Atlas</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/atlas/analytics"><TrendingUp className="mr-2 h-5 w-5" /> View Analytics</Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"> {/* Added hover effect */}
                <img src="/modi-farmers.webp" alt="Prime Minister Modi with Indian farmers" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                <Globe className="inline-block mr-1 h-4 w-4 text-green-500" />
                Supporting communities through data and maps
              </p>
            </div>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={FileDigit} title="Records Digitized" value="1.2 M" />
            <StatCard icon={Map} title="Area Mapped (SQ KM)" value="45,231" />
            <StatCard icon={Users} title="Beneficiaries Served" value="850 K" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;