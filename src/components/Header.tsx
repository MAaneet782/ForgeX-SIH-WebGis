import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MapPin, BarChart2, Bell, Mail, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";

const Header = () => {
  return (
    <header className="bg-card border-b p-2 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-grow">
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search State, District, Village or Patta Holder" className="pl-10" />
        </div>
        <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
          Go
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline">
          <MapPin className="mr-2 h-4 w-4" /> My Parcel
        </Button>
        <Button variant="outline">
          Apply Filters
        </Button>
        <Button variant="outline">
          <BarChart2 className="mr-2 h-4 w-4" /> Open Analytics
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">2</Badge>
        </Button>
        <Button variant="ghost" size="icon">
          <Mail className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="Anita Devi" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span>Anita Devi</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;