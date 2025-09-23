import { Outlet } from "react-router-dom";
import PublicSidebar from "./PublicSidebar";
import PublicHeader from "./PublicHeader";

const PublicLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <PublicSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PublicHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;