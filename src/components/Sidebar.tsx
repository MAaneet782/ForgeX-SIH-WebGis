import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Layers, Map, Filter, Compass, DollarSign, Droplets, BarChart, FileText, Users, Leaf } from "lucide-react";

const Sidebar = () => {
  const navItems = {
    "MAP TOOLS": [
      { icon: Layers, label: "Layers Panel" },
      { icon: Map, label: "Basemap Switcher" },
      { icon: Filter, label: "Saved Filters" },
    ],
    "PATTA HOLDER": [
      { icon: Compass, label: "Find My Parcel" },
      { icon: DollarSign, label: "Schemes" },
      { icon: Leaf, label: "Agriculture" },
      { icon: Droplets, label: "Water Resources" },
    ],
    "OFFICIALS": [
      { icon: BarChart, label: "Low Water Index" },
      { icon: Users, label: "MGNREGA: Eligible not Availing" },
      { icon: FileText, label: "Generate Reports" },
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
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
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