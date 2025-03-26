
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";

const Users = () => {
  const { users, isLoading, error, refetch, isError } = useUsers();

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
