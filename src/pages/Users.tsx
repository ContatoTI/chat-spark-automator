
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
      toast.error("Erro ao carregar usuários", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde"
      });
    }
  }, [error]);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <UsersHeader onRefresh={refetch} />
        <UsersTable users={users} isLoading={isLoading} error={error} refetch={refetch} />
      </div>
    </Layout>
  );
};

export default Users;
