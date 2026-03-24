import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Conversas from "@/pages/Conversas";
import Dashboard from "@/pages/Dashboard";
import Pipeline from "@/pages/Pipeline";
import Clientes from "@/pages/Clientes";
import Catalogo from "@/pages/Catalogo";
import Disparos from "@/pages/Disparos";
import Configuracoes from "@/pages/Configuracoes";
import ClientePerfil from "@/pages/ClientePerfil";
import Master from "@/pages/Master";
import Onboarding from "@/pages/Onboarding";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/conversas" replace />} />
            <Route path="/conversas" element={<Conversas />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id" element={<ClientePerfil />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/disparos" element={<Disparos />} />
            <Route path="/configuracoes" element={<Navigate to="/configuracoes/whatsapp" replace />} />
            <Route path="/configuracoes/:secao" element={<Configuracoes />} />
          </Route>
          <Route path="/master" element={<Master />} />
          <Route path="/master/:secao" element={<Master />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;