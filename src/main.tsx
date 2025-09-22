import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "sonner"; // Re-importing Toaster

createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <Toaster richColors position="top-right" />
    <App />
  </React.Fragment>
);