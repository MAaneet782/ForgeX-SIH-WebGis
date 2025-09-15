import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Layers, Map, Filter, Compass, DollarSign, Droplets, BarChart, FileText, Users, Leaf } from "lucide-react";
import { useDashboardState } from "@/context/DashboardStateContext";
import { showInfo } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onToggleLayersPanel: () => void;
  onGenerateReport: () => void;
}

const Sidebar = ({ onToggleLayersPanel, onGenerateReport }: SidebarProps) => {
  const { state, dispatch } = useDashboardState();

  const navItems = {
    "MAP TOOLS": [
      { icon: Layers, label: "Layers Panel", action: onToggleLayersPanel },
      { icon: Map, label: "Basemap Switcher", action: () => showInfo("Use the control on the map to switch basemaps.") },
      { icon: Filter, label: "Saved Filters", action: () => showInfo("Feature coming soon!") },
    ],
    "PATTA HOLDER": [
      { icon: Compass, label: "Find My Parcel", action: () => showInfo("Feature coming soon!") },
      { icon: DollarSign, label: "Schemes", action: () => showInfo("Feature coming soon!") },
      { icon: Leaf, label: "Agriculture", action: () => showInfo("Feature coming soon!") },
      { icon: Droplets, label: "Water Resources", action: () => showInfo("Feature coming soon!") },
    ],
    "OFFICIALS": [
      { icon: BarChart, label: "Low Water Index", action: () => dispatch({ type: 'TOGGLE_LOW_WATER_FILTER' }), active: state.activeFilter === 'low-water-index' },
      { icon: Users, label: "MGNREGA: Eligible not Availing", action: () => showInfo("Feature coming soon!") },
      { icon: FileText, label: "Generate Reports", action: onGenerateReport },
    ],
  };

  return (
    <aside className="bg-[#004d40] text-white flex flex-col h-full">
      <div className="p-4 border-b border-white/20">
        <h2 className="text-2xl font-bold">FRA Atlas</h2>
        <div className="flex items-center gap-3 mt-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Anita Devi" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Anita Devi</p>
            <p className="text-xs text-gray-300">Local Government Official</p>
          </div>
        </div>
      </div>
      <nav className="flex-grow p-4 space-y-6 overflow-y-auto">
        {Object.entries(navItems).map(([section, items]) => (
          <div key={section}>
            <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">{section}</h3>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.label}>
                  <Button 
                    variant="ghost" 
                    onClick={item.action}
                    className={cn(
                      "w-full justify-start text-white hover:bg-white/10 hover:text-white",
                      item.active && "bg-white/20"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;