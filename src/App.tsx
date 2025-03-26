
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rota pública */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas que qualquer usuário autenticado pode acessar */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/history" element={<History />} />
            </Route>
            
            {/* Rotas que apenas administradores podem acessar */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<Users />} />
            </Route>
            
            {/* Rota de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
