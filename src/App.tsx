import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import DashboardA from "./pages/DashboardA";
import DashboardB from "./pages/DashboardB";
import Eventos from "./pages/Eventos";
import BotAdmin from "./pages/BotAdmin";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import AlertsGenerator from "./components/AlertsGenerator";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Component to handle dashboard routing based on user type
const DashboardRouter = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  if (profile.user_type === 'tipo_a') {
    return <Navigate to="/dashboard-a" replace />;
  } else if (profile.user_type === 'tipo_b') {
    return <Navigate to="/dashboard-b" replace />;
  }

  return <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-a" element={
              <ProtectedRoute allowedUserTypes={['tipo_a']}>
                <AlertsGenerator />
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <DashboardA />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/dashboard-b" element={
              <ProtectedRoute allowedUserTypes={['tipo_b']}>
                <DashboardB />
              </ProtectedRoute>
            } />
            <Route path="/eventos" element={
              <ProtectedRoute allowedUserTypes={['tipo_a']}>
                <AlertsGenerator />
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <Eventos />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/bot-admin" element={
              <ProtectedRoute allowedUserTypes={['tipo_a']}>
                <AlertsGenerator />
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <BotAdmin />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
