import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Soluciones from "./pages/Soluciones";
import Login from "./pages/Login";
import DashboardA from "./pages/DashboardA";
import DashboardB from "./pages/DashboardB";
import Gestion from "./pages/Gestion";
import Configuracion from "./pages/Configuracion";
import Eventos from "./pages/Eventos";
import BotAdmin from "./pages/BotAdmin";
import FichaServicios from "./pages/FichaServicios";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import AlertsGenerator from "./components/AlertsGenerator";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/soluciones" element={<Soluciones />} />
            <Route path="/ficha-servicios" element={<FichaServicios />} />
            <Route path="/login" element={<Login />} />
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
            <Route path="/gestion" element={
              <ProtectedRoute allowedUserTypes={['tipo_b']}>
                <Gestion />
              </ProtectedRoute>
            } />
            <Route path="/configuracion" element={
              <ProtectedRoute allowedUserTypes={['tipo_b']}>
                <Configuracion />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
