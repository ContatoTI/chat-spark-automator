
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllUsers, 
  updateUserProfile, 
  updateUserPermissions, 
  UserProfile,
  createUserByAdmin 
} from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, XCircle, UserCog, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createUserSchema = z.object({
  fullName: z.string().min(3, { message: "Nome completo é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  isAdmin: z.boolean().default(false),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

const Users = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

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

  const createUserMutation = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      return createUserByAdmin(
        values.email, 
        values.password, 
        values.fullName, 
        values.isAdmin ? "admin" : "client",
        {
          can_manage_users: values.isAdmin,
          can_manage_settings: values.isAdmin,
          can_view_campaigns: true
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateUserOpen(false);
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário. Verifique os dados e tente novamente.",
      });
    },
  });

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      isAdmin: false,
    },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    createUserMutation.mutate(values);
  };

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
            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo usuário no sistema.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isAdmin"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Administrador
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Usuários administradores têm acesso total ao sistema
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={createUserMutation.isPending}>
                        {createUserMutation.isPending ? "Criando..." : "Criar Usuário"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
                        <TableHead>Email</TableHead>
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
                          <TableCell>{user.email || "-"}</TableCell>
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
