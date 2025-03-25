
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUserProfile, updateUserPermissions, UserProfile } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, XCircle, UserCog } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Users = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "client" }) => {
      return updateUserProfile(userId, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Função atualizada",
        description: "A função do usuário foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar função",
        description: "Não foi possível atualizar a função do usuário.",
      });
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      field, 
      value 
    }: { 
      userId: string; 
      field: "can_manage_users" | "can_manage_settings" | "can_view_campaigns"; 
      value: boolean 
    }) => {
      return updateUserPermissions(userId, { [field]: value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Permissões atualizadas",
        description: "As permissões do usuário foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar permissões",
        description: "Não foi possível atualizar as permissões do usuário.",
      });
    },
  });

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
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie usuários e permissões do sistema
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>
                Controle de funções e permissões para todos os usuários registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Carregando usuários...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Gerenciar Usuários</TableHead>
                        <TableHead>Gerenciar Configurações</TableHead>
                        <TableHead>Ver Campanhas</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                              {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={user.permissions?.[0]?.can_manage_users || false}
                              onCheckedChange={(checked) => 
                                updatePermissionMutation.mutate({ 
                                  userId: user.id, 
                                  field: "can_manage_users", 
                                  value: checked 
                                })
                              }
                              disabled={updatePermissionMutation.isPending}
                            />
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={user.permissions?.[0]?.can_manage_settings || false}
                              onCheckedChange={(checked) => 
                                updatePermissionMutation.mutate({ 
                                  userId: user.id, 
                                  field: "can_manage_settings", 
                                  value: checked 
                                })
                              }
                              disabled={updatePermissionMutation.isPending}
                            />
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={user.permissions?.[0]?.can_view_campaigns || false}
                              onCheckedChange={(checked) => 
                                updatePermissionMutation.mutate({ 
                                  userId: user.id, 
                                  field: "can_view_campaigns", 
                                  value: checked 
                                })
                              }
                              disabled={updatePermissionMutation.isPending}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => 
                                updateRoleMutation.mutate({ 
                                  userId: user.id, 
                                  role: user.role === 'admin' ? 'client' : 'admin' 
                                })
                              }
                              disabled={updateRoleMutation.isPending}
                            >
                              {user.role === 'admin' ? 'Rebaixar' : 'Promover'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Users;
