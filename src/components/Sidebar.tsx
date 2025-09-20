import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Layers, Map, Filter, Compass, DollarSign, Droplets, FileText, Leaf, BarChart2, LogOut, Settings, User } from "lucide-react";
import { useDashboardState } from "@/context/DashboardStateContext";
import { showInfo } from "@/utils/toast";
import { cn } from "@/lib/utils";
import SchemeInfoModal from "./SchemeInfoModal";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  onToggleLayersPanel: () => void;
  onGenerateReport: () => void;
  onFindMyParcel: () => void;
}

const Sidebar = ({ onToggleLayersPanel, onGenerateReport, onFindMyParcel }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: <></> });
  const { user, supabase } = useAuth();

  const schemesContent = (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold">Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)</h4>
        <p className="text-muted-foreground">Provides income support of ₹6,000 per year to all landholding farmer families.</p>
      </div>
      <div>
        <h4 className="font-semibold">Pradhan Mantri Fasal Bima Yojana (PMFBY)</h4>
        <p className="text-muted-foreground">An insurance service for farmers for their yields, covering losses due to natural calamities, pests, and diseases.</p>
      </div>
      <div>
        <h4 className="font-semibold">Kisan Credit Card (KCC) Scheme</h4>
        <p className="text-muted-foreground">Offers short-term formal credit to farmers for cultivation, post-harvest expenses, and consumption requirements.</p>
      </div>
    </div>
  );

  const agricultureContent = (
     <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold">National Food Security Mission (NFSM)</h4>
        <p className="text-muted-foreground">Aims to increase the production of rice, wheat, pulses, and coarse cereals through area expansion and productivity enhancement.</p>
      </div>
      <div>
        <h4 className="font-semibold">Rashtriya Krishi Vikas Yojana (RKVY)</h4>
        <p className="text-muted-foreground">Allows states to choose their own agriculture and allied sector development activities as per their district/state agriculture plans.</p>
      </div>
      <div>
        <h4 className="font-semibold">Soil Health Card Scheme</h4>
        <p className="text-muted-foreground">Provides farmers with soil health cards which carry crop-wise recommendations of nutrients and fertilizers required for the individual farms.</p>
      </div>
    </div>
  );

  const waterResourcesContent = (
     <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold">Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)</h4>
        <p className="text-muted-foreground">Focuses on enhancing water use efficiency at the farm level through 'Har Khet Ko Pani' (water to every field) and 'More Crop Per Drop'.</p>
      </div>
      <div>
        <h4 className="font-semibold">Jal Jeevan Mission</h4>
        <p className="text-muted-foreground">Aims to provide safe and adequate drinking water through individual household tap connections to all households in rural India.</p>
      </div>
       <div>
        <h4 className="font-semibold">Atal Bhujal Yojana</h4>
        <p className="text-muted-foreground">A central sector scheme for sustainable management of ground water resources with community participation.</p>
      </div>
    </div>
  );

  const openModal = (title: string, content: JSX.Element) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showInfo("Error logging out: " + error.message);
    } else {
      showInfo("Logged out successfully!");
    }
  };

  const navItems = {
    "MAP TOOLS": [
      { icon: Layers, label: "Layers Panel", action: onToggleLayersPanel },
      { icon: Map, label: "Basemap Switcher", action: () => showInfo("Use the control on the map to switch basemaps.") },
      { icon: Filter, label: "Advanced Filters", action: () => showInfo("Use the 'Apply Filters' button in the header.") },
    ],
    "PATTA HOLDER": [
      { icon: Compass, label: "Find My Parcel", action: onFindMyParcel },
      { icon: DollarSign, label: "Schemes", action: () => openModal("Key Government Schemes", schemesContent) },
      { icon: Leaf, label: "Agriculture", action: () => openModal("Agriculture Schemes", agricultureContent) },
      { icon: Droplets, label: "Water Resources", action: () => openModal("Water Resource Schemes", waterResourcesContent) },
    ],
    "OFFICIALS": [
      { icon: FileText, label: "Generate Reports", action: onGenerateReport },
      { icon: BarChart2, label: "Analytics Dashboard", action: () => window.location.href = '/atlas/analytics' },
    ],
  };

  return (
    <>
      <aside className="bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-border">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-foreground">
            <Leaf className="h-7 w-7 text-primary" /> FRA Atlas
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt={user?.user_metadata?.first_name || "User"} />
              <AvatarFallback>{user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{user?.user_metadata?.first_name || user?.email || "Guest User"}</p>
              <p className="text-xs text-muted-foreground">Local Government Official</p>
            </div>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-6 overflow-y-auto">
          {Object.entries(navItems).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-2">{section}</h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.label}>
                    <Button 
                      variant="ghost" 
                      onClick={item.action}
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            onClick={() => showInfo("Opening profile settings...")}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1"
          >
            <User className="mr-3 h-5 w-5" /> Profile
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => showInfo("Opening settings...")}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1"
          >
            <Settings className="mr-3 h-5 w-5" /> Settings
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="mr-3 h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>
      <SchemeInfoModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        title={modalContent.title}
      >
        {modalContent.content}
      </SchemeInfoModal>
    </>
  );
};

export default Sidebar;