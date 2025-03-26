
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "@/components/users/UserTable";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { useUserManagement } from "@/hooks/useUserManagement";

const Users = () => {
  const { isAdmin } = useAuth();
  const {
    users,
    isLoading,
    error,
    isCreateUserOpen,
    setIsCreateUserOpen,
    updateRoleMutation,
    updatePermissionMutation,
    createUserMutation
  } = useUserManagement();

  if (error) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-500">Erro ao carregar usuários</h2>
          <p className="text-gray-600 mt-2">Tente novamente mais tarde.</p>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Gerenciamento de Usuários</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie usuários e permissões do sistema
              </p>
            </div>
            <AddUserDialog
              isOpen={isCreateUserOpen}
              onOpenChange={setIsCreateUserOpen}
              onSubmit={createUserMutation.mutate}
              isSubmitting={createUserMutation.isPending}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>
                Controle de funções e permissões para todos os usuários registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable
                users={users || []}
                isLoading={isLoading}
                onRoleChange={(userId, role) => 
                  updateRoleMutation.mutate({ userId, role })
                }
                onPermissionChange={(userId, field, value) => 
                  updatePermissionMutation.mutate({ userId, field, value })
                }
                isUpdating={updateRoleMutation.isPending || updatePermissionMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Users;
