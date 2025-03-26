
import React, { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";

const Users = () => {
  const { users, isLoading, error, refetch } = useUsers();

  useEffect(() => {
    // Mostrar toast de erro se houver problemas ao carregar os usuários
    if (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde"
      });
    }
  }, [error]);
  
  useEffect(() => {
    console.log("Página de usuários montada, dados:", { 
      usuariosCount: users?.length, 
      temErro: !!error, 
      carregando: isLoading 
    });
  }, [users, error, isLoading]);

  // Função para forçar uma atualização dos dados
  const handleRefresh = () => {
    console.log("Atualizando manualmente a lista de usuários");
    refetch();
  };

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
