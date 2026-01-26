import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast/Toast";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Overview from "./components/Dashboard/Overview";
import APIAccess from "./components/Dashboard/APIAccess";
import ClientScript from "./components/Dashboard/ClientScript";
import Logs from "./components/Dashboard/Logs";
import Documentation from "./components/Dashboard/Documentation";
import Terms from "./components/LandingPage/Terms";
import Privacy from "./components/LandingPage/Privacy";
import LandingDocs from "./components/LandingPage/Documentation";
import Blog from "./components/LandingPage/Blog";
import CaseStudies from "./components/LandingPage/CaseStudies";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="api-access" element={<APIAccess />} />
            <Route path="client-script" element={<ClientScript />} />
            <Route path="logs" element={<Logs />} />
            <Route path="documentation" element={<Documentation />} />
          </Route>
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/documentation" element={<LandingDocs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/case-studies" element={<CaseStudies />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
