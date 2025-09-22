import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Atlas from "./pages/Atlas";
import NotFound from "./pages/NotFound";
import ClaimDetail from "./pages/ClaimDetail";
import Analytics from "./pages/Analytics";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Import Sonner here
import React from "react"; // Import React for Fragment

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <React.Fragment> {/* Wrap Sonner and Routes in a Fragment */}
          <Sonner /> {/* Render Sonner here */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} />
            <Route path="/atlas/analytics" element={<Analytics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Fragment>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;