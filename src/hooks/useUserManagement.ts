
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllUsers, 
  updateUserProfile, 
  updateUserPermissions, 
  createUserByAdmin 
} from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { CreateUserFormValues } from "@/components/users/UserForm";

export const useUserManagement = () => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: users, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    retry: 2,
    refetchOnWindowFocus: false,
    // Don't fetch if we're not on the users page
    enabled: window.location.pathname === "/users",
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
      console.error("Erro ao atualizar função:", error);
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
      console.error("Erro ao atualizar permissões:", error);
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
      console.error("Erro ao criar usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário. Verifique os dados e tente novamente.",
      });
    },
  });

  return {
    users,
    isLoading,
    error,
    isCreateUserOpen,
    setIsCreateUserOpen,
    updateRoleMutation,
    updatePermissionMutation,
    createUserMutation
  };
};
