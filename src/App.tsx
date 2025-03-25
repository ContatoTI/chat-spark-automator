
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { initializeDefaultUsers } from "@/lib/auth";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Inicializar usuários padrão se não existirem
    initializeDefaultUsers();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Rotas protegidas */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/settings" element={
                <ProtectedRoute requireAdmin={true}><Settings /></ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute requireAdmin={true}><Users /></ProtectedRoute>
              } />
              
              {/* Rota de fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
