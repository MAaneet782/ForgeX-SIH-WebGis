import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "leaflet/dist/leaflet.css";
// import { ThemeProvider } from "./components/theme-provider"; // Temporarily removed
import React from "react"; // Still needed for JSX, but StrictMode is removed

createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>
);