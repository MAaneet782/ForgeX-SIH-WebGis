import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; // Re-enabling Toaster

import LandingPage from "./pages/Landing";
import Atlas from "./pages/Atlas"; // Re-enabled
import ClaimDetail from "./pages/ClaimDetail"; // Re-enabled
import Analytics from "./pages/Analytics"; // Re-enabled
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter> {/* BrowserRouter is now the direct return */}
      <Toaster richColors position="top-right" /> {/* Toaster moved inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} />
        <Route path="/atlas/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;