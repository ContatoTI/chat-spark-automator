
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/api/users";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isMaster: boolean;
  selectedCompany: string | null;
  setSelectedCompany: (companyId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar se o usuário está logado ao iniciar
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Verificar se existe um usuário na sessão (localStorage)
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Restaurar empresa selecionada para usuários master
          if (parsedUser.role === 'master') {
            const savedCompany = localStorage.getItem('selectedCompany');
            if (savedCompany) {
              setSelectedCompany(savedCompany);
            }
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
        setError(err instanceof Error ? err : new Error("Erro desconhecido ao verificar sessão"));
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar usuário com o email e senha fornecidos
      const { data, error } = await supabase
        .from('appw_users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
      
      if (error) {
        throw new Error("Credenciais inválidas");
      }
      
      if (!data) {
        throw new Error("Usuário não encontrado");
      }
      
      // Formatar usuário no formato esperado pelo app
      const loggedUser: User = {
        id: data.user_id || data.id,
        email: data.email,
        created_at: data.created_at,
        role: data.role || 'user',
        company_id: data.empresa_id,
        last_sign_in_at: new Date().toISOString()
      };
      
      // Salvar usuário na sessão
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      setUser(loggedUser);
      
      // Para usuários master, definir empresa selecionada padrão
      if (loggedUser.role === 'master' && loggedUser.company_id) {
        setSelectedCompany(loggedUser.company_id);
        localStorage.setItem('selectedCompany', loggedUser.company_id);
      }
      
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido durante o login"));
      toast.error("Falha no login", {
        description: err instanceof Error ? err.message : "Credenciais inválidas"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Remover usuário da sessão
      localStorage.removeItem('currentUser');
      localStorage.removeItem('selectedCompany');
      setUser(null);
      setSelectedCompany(null);
      navigate("/login");
      toast.info("Logout realizado com sucesso");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      toast.error("Erro ao fazer logout");
    }
  };
  
  // Função para atualizar a empresa selecionada (para usuários master)
  const handleSetSelectedCompany = (companyId: string | null) => {
    setSelectedCompany(companyId);
    if (companyId) {
      localStorage.setItem('selectedCompany', companyId);
    } else {
      localStorage.removeItem('selectedCompany');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        logout,
        isAdmin: user?.role === 'admin',
        isMaster: user?.role === 'master',
        selectedCompany,
        setSelectedCompany: handleSetSelectedCompany
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
