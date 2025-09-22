import React from "react";
import LandingPage from "./pages/Landing";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <LandingPage />
    </>
  );
};

export default App;