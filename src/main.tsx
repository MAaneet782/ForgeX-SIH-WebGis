import React from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import "leaflet/dist/leaflet.css";

// Temporarily import App, but not render it, to isolate the issue
// import App from "./App.tsx"; 

createRoot(document.getElementById("root")!).render(
  <>
    <div>Hello, Dyad! If you see this, the root rendering works.</div>
  </>
);