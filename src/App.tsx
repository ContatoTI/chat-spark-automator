
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import Users from "./pages/Users";
import Companies from "./pages/Companies";
import WhatsAccounts from "./pages/WhatsAccounts";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
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
              </Route>
              
              {/* Rotas que apenas administradores podem acessar */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'master']} />}>
                <Route path="/users" element={<Users />} />
                <Route path="/whatsapp-accounts" element={<WhatsAccounts />} />
              </Route>
              
              {/* Rota que apenas usuários master podem acessar */}
              <Route element={<ProtectedRoute allowedRoles={['master']} />}>
                <Route path="/companies" element={<Companies />} />
              </Route>
              
              {/* Rota de fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
