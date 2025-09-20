import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, BarChart2, Bell, Mail, ChevronDown, User, Settings, LogOut, Filter, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { showInfo } from "@/utils/toast";
import FiltersPanel from "./FiltersPanel";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onFindMyParcel: () => void;
}

const Header = ({ searchTerm, setSearchTerm, onFindMyParcel }: HeaderProps) => {
  const { user, supabase } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showInfo("Error logging out: " + error.message);
    } else {
      showInfo("Logged out successfully!");
    }
  };

  return (
    <header className="bg-card border-b p-3 flex items-center justify-between gap-4">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
        <Leaf className="h-6 w-6" /> FRA Atlas
      </Link>
      <div className="flex items-center gap-4 flex-grow">
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by holder, village..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onFindMyParcel}>
          <MapPin className="mr-2 h-4 w-4" /> My Parcel
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <FiltersPanel />
          </PopoverContent>
        </Popover>
        <Button variant="outline" asChild>
          <Link to="/atlas/analytics">
            <BarChart2 className="mr-2 h-4 w-4" /> Analytics
          </Link>
        </Button>
        <ThemeToggle />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">2</Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="font-bold mb-2">Notifications</div>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-green-600">Approved:</span> Claim C015 for Anil Bhil has been approved.</p>
              <p><span className="font-semibold text-yellow-600">Update:</span> New satellite imagery available for the Mandla district.</p>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Mail className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="font-bold mb-2">Messages</div>
            <p className="text-sm text-muted-foreground">No new messages.</p>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt={user?.user_metadata?.first_name || "User"} />
                <AvatarFallback>{user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span>{user?.user_metadata?.first_name || user?.email?.split('@')[0] || "Guest"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => showInfo("Viewing user profile...")}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Opening settings...")}><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;