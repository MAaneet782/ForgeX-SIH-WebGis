import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import LandingPage from "./pages/Landing";
import Atlas from "./pages/Atlas";
import ClaimDetail from "./pages/ClaimDetail";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      {/* BrowserRouter expects a single child, so we wrap Toaster and Routes in a fragment */}
      <React.Fragment>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} />
          <Route path="/atlas/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;