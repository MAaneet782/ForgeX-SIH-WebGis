import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; // Import motion and AnimatePresence
import Landing from "./pages/Landing";
import Atlas from "./pages/Atlas";
import NotFound from "./pages/NotFound";
import ClaimDetail from "./pages/ClaimDetail";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import PageTransition from "./components/PageTransition"; // Import PageTransition

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation(); // Get current location for AnimatePresence

  return (
    <AnimatePresence mode="wait"> {/* Use mode="wait" to ensure exit animation completes before new component mounts */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/atlas" element={<PageTransition><Atlas /></PageTransition>} />
        <Route path="/atlas/claim/:claimId" element={<PageTransition><ClaimDetail /></PageTransition>} />
        <Route path="/atlas/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent /> {/* Render AppContent inside BrowserRouter */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;