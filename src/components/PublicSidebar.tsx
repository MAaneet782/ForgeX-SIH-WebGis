import { Link, useNavigate } from "react-router-dom";
import { Home, BarChart2, LogIn, HelpCircle, Shield, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/SessionContext";
import { Button } from "./ui/button";

const PublicSidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-primary text-primary-foreground p-4 flex-col justify-between hidden md:flex">
      <div>
        <div className="p-4 mb-8 text-center">
          <h2 className="text-2xl font-bold">FRA Platform</h2>
          <p className="text-sm opacity-90">Empowering communities</p>
        </div>
        <div className="flex items-center p-4 mb-4 rounded-lg bg-primary-foreground/10">
          <Avatar>
            <AvatarFallback>{user ? user.email?.charAt(0).toUpperCase() : 'G'}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-semibold truncate">{user ? user.email : 'Guest'}</p>
            <p className="text-xs opacity-90">{user ? "Authenticated" : "Public Access"}</p>
          </div>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link to="/" className="flex items-center p-3 rounded-md bg-primary-foreground/20 font-semibold">
            <Home className="mr-3 h-5 w-5" />
            Home
          </Link>
          <Link to="/atlas" className="flex items-center p-3 rounded-md hover:bg-primary-foreground/10">
            <Shield className="mr-3 h-5 w-5" />
            FRA Atlas
          </Link>
          <Link to="/atlas/analytics" className="flex items-center p-3 rounded-md hover:bg-primary-foreground/10">
            <BarChart2 className="mr-3 h-5 w-5" />
            Analytics (Public)
          </Link>
        </nav>
      </div>
      <div className="flex flex-col space-y-2">
         {user ? (
            <Button onClick={handleLogout} variant="ghost" className="justify-start p-3 text-primary-foreground hover:bg-primary-foreground/10 h-auto">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
         ) : (
            <Link to="/login" className="flex items-center p-3 rounded-md hover:bg-primary-foreground/10">
              <LogIn className="mr-3 h-5 w-5" />
              Login
            </Link>
         )}
          <Link to="#" className="flex items-center p-3 rounded-md hover:bg-primary-foreground/10">
            <HelpCircle className="mr-3 h-5 w-5" />
            Help
          </Link>
      </div>
    </aside>
  );
};

export default PublicSidebar;