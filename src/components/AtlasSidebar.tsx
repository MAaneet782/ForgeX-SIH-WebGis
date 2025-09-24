import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Map,
  Filter,
  BarChart3,
  Search,
  Shield,
  DollarSign,
  Leaf,
  Mountain,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/SessionContext";
import { showInfo } from "@/utils/toast";
import { Button } from "./ui/button";

const AtlasSidebar = () => {
  const { user } = useAuth();

  const baseLinkClasses = "flex items-center p-3 rounded-md text-sidebar-foreground/80 transition-colors";
  const hoverClasses = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const activeClasses = "bg-sidebar-accent text-sidebar-accent-foreground font-semibold";

  const NavItem = ({ icon: Icon, text, to }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseLinkClasses} ${hoverClasses} ${isActive ? activeClasses : ""}`
      }
    >
      <Icon className="mr-3 h-5 w-5" />
      <span>{text}</span>
    </NavLink>
  );

  const ActionItem = ({ icon: Icon, text }) => (
    <Button
      variant="ghost"
      onClick={() => showInfo(`${text} feature is coming soon!`)}
      className={`${baseLinkClasses} ${hoverClasses} w-full justify-start`}
    >
      <Icon className="mr-3 h-5 w-5" />
      <span>{text}</span>
    </Button>
  );

  const SectionTitle = ({ text }: { text: string }) => (
    <h3 className="px-3 pt-4 pb-2 text-xs font-semibold uppercase text-sidebar-foreground/60 tracking-wider">
      {text}
    </h3>
  );

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 flex flex-col justify-between">
      <div>
        <div className="p-4 mb-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Mountain className="h-8 w-8 text-sidebar-primary" />
            <h2 className="text-2xl font-bold">FRA Atlas</h2>
          </div>
        </div>
        <div className="flex items-center p-3 mb-4 rounded-lg bg-sidebar-accent/50">
          <Avatar>
            <AvatarFallback>{user ? user.email?.charAt(0).toUpperCase() : "G"}</AvatarFallback>
          </Avatar>
          <div className="ml-3 overflow-hidden">
            <p className="font-semibold text-sm truncate">{user ? user.email : "Guest User"}</p>
            <p className="text-xs opacity-80">Local Government Official</p>
          </div>
        </div>
        <nav className="flex flex-col space-y-1">
          <SectionTitle text="Roles" />
          <NavItem icon={LayoutDashboard} text="RFO Dashboard" to="/atlas/rfo-dashboard" />

          <SectionTitle text="Map Tools" />
          <ActionItem icon={Layers} text="Layers Panel" />
          <ActionItem icon={Map} text="Basemap Switcher" />
          <ActionItem icon={Filter} text="Advanced Filters" />
          <NavItem icon={BarChart3} text="Thematic Analysis" to="/atlas/analytics" />

          <SectionTitle text="Patta Holder" />
          <ActionItem icon={Search} text="Find My Parcel" />
          <ActionItem icon={Shield} text="Types of Rights" />
          <NavItem icon={DollarSign} text="Schemes" to="/atlas/schemes" />
          <ActionItem icon={Leaf} text="Agriculture" />
        </nav>
      </div>
    </aside>
  );
};

export default AtlasSidebar;