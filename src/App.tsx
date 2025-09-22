import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; // Import Toaster for notifications

import LandingPage from "./pages/Landing";
import Atlas from "./pages/Atlas";
import ClaimDetail from "./pages/ClaimDetail";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      {/* Wrap Toaster and Routes in a React.Fragment to provide a single child to BrowserRouter */}
      <React.Fragment>
        <Toaster richColors position="top-right" /> {/* Toaster for notifications */}
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