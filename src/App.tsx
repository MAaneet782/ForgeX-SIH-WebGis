import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Atlas from "./pages/Atlas";
import NotFound from "./pages/NotFound";
import ClaimDetail from "./pages/ClaimDetail";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter key="root-router"> {/* Added key here */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} />
          <Route path="/atlas/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;