import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import { Toaster } from "./components/ui/toaster";
import { UrlAnalyticsPage } from "./pages/analytics/UrlAnalyticsPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analytics/:shortCode" element={<UrlAnalyticsPage />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
  </StrictMode>
);
