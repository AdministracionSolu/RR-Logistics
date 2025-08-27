import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Eventos from "./pages/Eventos";
import NotFound from "./pages/NotFound";
import MobileLayout from "./components/MobileLayout";
import AlertsGenerator from "./components/AlertsGenerator";
import Alertas from "./pages/Alertas";
import MobileEventos from "./pages/MobileEventos";
import Configuracion from "./pages/Configuracion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AlertsGenerator />
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/eventos" element={<MobileEventos />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/configuracion" element={<Configuracion />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
