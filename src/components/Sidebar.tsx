import { Link } from "react-router-dom";
import { Home, Map, BarChart2 } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-card text-card-foreground p-4 flex-col hidden md:flex">
      <h2 className="text-2xl font-bold mb-8">FRA Atlas</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="flex items-center p-2 rounded-md hover:bg-accent">
          <Home className="mr-3 h-5 w-5" />
          Home
        </Link>
        <Link to="/atlas" className="flex items-center p-2 rounded-md hover:bg-accent">
          <Map className="mr-3 h-5 w-5" />
          Atlas Dashboard
        </Link>
        <Link to="/atlas/analytics" className="flex items-center p-2 rounded-md hover:bg-accent">
          <BarChart2 className="mr-3 h-5 w-5" />
          Analytics
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;