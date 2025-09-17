import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Atlas from "./pages/Atlas";
import NotFound from "./pages/NotFound";
import ClaimDetail from "./pages/ClaimDetail";
import Analytics from "./pages/Analytics";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import RfoDashboard from "./pages/RfoDashboard"; // Import the new RFO Dashboard

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/atlas/analytics" element={<Analytics />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/atlas/claim/:claimId" element={<ClaimDetail />} />
            <Route path="/rfo-dashboard" element={<RfoDashboard />} /> {/* New RFO Dashboard Route */}
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;