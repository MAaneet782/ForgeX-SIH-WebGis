import { Outlet } from "react-router-dom";
import AtlasSidebar from "./AtlasSidebar";
import AtlasHeader from "./AtlasHeader";

const AtlasLayout = () => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <AtlasSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AtlasHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AtlasLayout;