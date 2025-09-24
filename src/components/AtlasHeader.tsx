import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, MapPin, Filter as FilterIcon, BarChart2, RefreshCw, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/SessionContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ThemeToggle } from "./ThemeToggle";

const AtlasHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-card p-3 border-b flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by holder, village..." className="pl-9 bg-background" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost">
          <MapPin className="mr-2 h-4 w-4" /> My Parcel
        </Button>
        <Button variant="ghost">
          <FilterIcon className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/atlas/analytics">
            <BarChart2 className="mr-2 h-4 w-4" /> Open Analytics
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </Button>
        <Button variant="ghost" size="icon">
          <Mail className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 h-10">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user ? user.email?.charAt(0).toUpperCase() : 'G'}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium truncate">{user ? user.email : 'Guest'}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user ? (
              <>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link to="/login">Login</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AtlasHeader;