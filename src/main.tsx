import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { Toaster as Sonner } from "@/components/ui/sonner"; // Import Sonner

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
    <Toaster /> {/* Render Toaster here */}
    <Sonner /> {/* Render Sonner here */}
  </ThemeProvider>,
);