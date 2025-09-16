import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>,
);