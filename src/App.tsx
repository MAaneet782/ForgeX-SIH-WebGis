import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "./pages/Index";

const App = () => {
  return (
    <div className="h-screen w-screen">
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </div>
  );
};

export default App;