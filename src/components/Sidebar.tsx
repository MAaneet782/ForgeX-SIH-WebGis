import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Layers, Map, Filter, Compass, DollarSign, Droplets, FileText, Leaf, BarChart3, BookCopy, UserCog } from "lucide-react";
// Removed unused 'useDashboardState'
import { showInfo } from "@/utils/toast";
// Removed unused 'cn'
import SchemeInfoModal from "./SchemeInfoModal";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  onToggleLayersPanel: () => void;
  onGenerateReport: () => void;
  onFindMyParcel: () => void;
}

const Sidebar = ({ onToggleLayersPanel, onGenerateReport, onFindMyParcel }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: <></> });
  const { user } = useAuth();
  const navigate = useNavigate();

  const rightsContent = (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold">Individual Forest Rights (IFR)</h4>
        <p className="text-muted-foreground">Rights to hold and live in the forest land by the members of a forest dwelling Scheduled Tribe or other traditional forest dwellers.</p>
      </div>
      <div>
        <h4 className="font-semibold">Community Rights (CR)</h4>
        <p className="text-muted-foreground">Rights of the villagers to use and access resources from the forest which they have been traditionally protecting and conserving for sustainable use.</p>
      </div>
      <div>
        <h4 className="font-semibold">Community Forest Resource (CFR) Rights</h4>
        <p className="text-muted-foreground">Rights to protect, regenerate or conserve or manage any community forest resource which they have been traditionally protecting and conserving for sustainable use.</p>
      </div>
    </div>
  );

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

  const navItems = {
    "ROLES": [
      { icon: UserCog, label: "RFO Dashboard", action: () => navigate('/rfo-dashboard') },
      // { icon: Briefcase, label: "PDO Dashboard", action: () => navigate('/pdo-dashboard') }, // Will add this later
    ],
    "MAP TOOLS": [
      { icon: Layers, label: "Layers Panel", action: onToggleLayersPanel },
      { icon: Map, label: "Basemap Switcher", action: () => showInfo("Use the control on the map to switch basemaps.") },
      { icon: Filter, label: "Advanced Filters", action: () => showInfo("Use the 'Apply Filters' button in the header.") },
      { icon: BarChart3, label: "Thematic Analysis", action: () => navigate('/atlas/analytics') },
    ],
    "PATTA HOLDER": [
      { icon: Compass, label: "Find My Parcel", action: onFindMyParcel },
      { icon: BookCopy, label: "Types of Rights", action: () => openModal("Understanding Forest Rights", rightsContent) },
      { icon: DollarSign, label: "Schemes", action: () => openModal("Key Government Schemes", schemesContent) },
      { icon: Leaf, label: "Agriculture", action: () => openModal("Agriculture Schemes", agricultureContent) },
      { icon: Droplets, label: "Water Resources", action: () => openModal("Water Resource Schemes", waterResourcesContent) },
    ],
    "OFFICIALS": [
      { icon: FileText, label: "Generate Reports", action: onGenerateReport },
    ],
  };

  return (
    <>
      <aside className="bg-[#004d40] text-white flex flex-col h-full">
        <div className="p-4 border-b border-white/20">
          <Link to="/atlas" className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Leaf className="h-7 w-7" /> FRA Atlas
          </Link>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" alt={user?.email?.charAt(0).toUpperCase()} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold truncate max-w-[180px]">{user?.email}</p>
              <p className="text-xs text-gray-300">Local Government Official</p>
            </div>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-6 overflow-y-auto"> {/* Adjusted vertical spacing */}
          {Object.entries(navItems).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3"> {/* Adjusted bottom margin */}
                {section}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.label}>
                    <Button 
                      variant="ghost" 
                      onClick={item.action}
                      className="w-full justify-start text-white hover:bg-white/10 hover:text-white px-3 py-2" // Consistent padding
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