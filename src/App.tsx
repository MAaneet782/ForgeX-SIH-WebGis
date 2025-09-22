import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "sonner"; // Temporarily removed to diagnose rendering issue

import LandingPage from "./pages/Landing";
// import Atlas from "./pages/Atlas"; // Temporarily removed
// import ClaimDetail from "./pages/ClaimDetail"; // Temporarily removed
// import Analytics from "./pages/Analytics"; // Temporarily removed
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <>
      {/* <Toaster richColors position="top-right" /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Temporarily removed Supabase-dependent routes */}
          {/* <Route path="/atlas" element={<Atlas />} /> */}
          {/* <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} /> */}
          {/* <Route path="/atlas/analytics" element={<Analytics />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;