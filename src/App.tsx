import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Landing from "./pages/Landing";
import Atlas from "./pages/Atlas";
import ClaimDetail from "./pages/ClaimDetail";
import Analytics from "./pages/Analytics";

const App = () => {
  return (
    <div className="h-screen w-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} />
        <Route path="/atlas/analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
};

export default App;