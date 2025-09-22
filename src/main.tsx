import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // Re-importing App
import "./globals.css";
import "leaflet/dist/leaflet.css";

// import { ThemeProvider } from "./components/theme-provider"; // Still commented out
// import React from "react"; // Still needed for JSX, but StrictMode is removed

createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>
);