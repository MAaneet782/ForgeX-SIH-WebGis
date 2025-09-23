import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, BarChart2, Bell, Mail, ChevronDown, User, Settings, LogOut, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { showInfo } from "@/utils/toast";
import FiltersPanel from "./FiltersPanel";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onFindMyParcel: () => void;
}

const Header = ({ searchTerm, setSearchTerm, onFindMyParcel }: HeaderProps) => {
  return (
    <header className="bg-card border-b p-2 flex items-center justify-between gap-4">
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
              <>
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
              </>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <FiltersPanel />
          </PopoverContent>
        </Popover>
        <Button variant="outline" asChild>
          <Link to="/atlas/analytics">
            <BarChart2 className="mr-2 h-4 w-4" /> Open Analytics
          </Link>
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <>
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">2</Badge>
              </>
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
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Anita Devi" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span>Anita Devi</span>
                <ChevronDown className="h-4 w-4" />
              </>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => showInfo("Viewing user profile...")}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Opening settings...")}><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => showInfo("Logging out...")}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;