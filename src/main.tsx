import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "./components/theme-provider";
// Removed: import React from "react"; // No longer needed if StrictMode is removed

createRoot(document.getElementById("root")!).render(
  // Removed: <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  // Removed: </React.StrictMode>,
);