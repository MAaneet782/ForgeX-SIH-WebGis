import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import PublicLayout from "./components/PublicLayout";
import AtlasLayout from "./components/AtlasLayout";
import Landing from "./pages/Landing";
import Atlas from "./pages/Atlas";
import ClaimDetail from "./pages/ClaimDetail";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Schemes from "./pages/Schemes";
import RfoDashboard from "./pages/RfoDashboard";
import Agriculture from "./pages/Agriculture";
import Rights from "./pages/Rights";
import FindMyParcel from "./pages/FindMyParcel";
import AddClaimPage from "./pages/AddClaimPage"; // Import the new AddClaimPage

const App = () => {
  return (
    <div className="h-screen w-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>
        
        <Route element={<AtlasLayout />}>
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/atlas/analytics" element={<Analytics />} />
          <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} />
          <Route path="/atlas/schemes" element={<Schemes />} />
          <Route path="/atlas/rfo-dashboard" element={<RfoDashboard />} />
          <Route path="/atlas/agriculture" element={<Agriculture />} />
          <Route path="/atlas/rights" element={<Rights />} />
          <Route path="/atlas/find-my-parcel" element={<FindMyParcel />} />
          <Route path="/atlas/add-claim" element={<AddClaimPage />} /> {/* New route for adding claims */}
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;