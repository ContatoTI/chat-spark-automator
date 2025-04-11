
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Users = () => {
  const { users, isLoading, error, refetch, isError } = useUsers();
  const { user } = useAuth();

  // Função para forçar uma atualização dos dados
  const handleRefresh = () => {
    toast.info("Atualizando lista de usuários...");
    refetch();
  };

  // Se houver erro, mostra uma toast
  React.useEffect(() => {
    if (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde"
      });
    }
  }, [error]);

  // Usuário comum não tem acesso a esta página
  if (user?.role === 'user') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh] max-w-md mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para visualizar a lista de usuários.
            Esta funcionalidade está disponível apenas para administradores e usuários master.
          </p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <UsersHeader onRefresh={handleRefresh} />
        <UsersTable 
          users={users} 
          isLoading={isLoading} 
          error={error} 
          refetch={handleRefresh} 
        />
      </div>
    </Layout>
  );
};

export default Users;
