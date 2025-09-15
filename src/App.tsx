import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Atlas from "./pages/Atlas";
import NotFound from "./pages/NotFound";
import ClaimDetail from "./pages/ClaimDetail";
import { ClaimsProvider } from "./context/ClaimsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClaimsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ClaimsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;