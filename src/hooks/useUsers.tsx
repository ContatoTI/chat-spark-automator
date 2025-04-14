
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/users";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useUsers = () => {
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  const { 
    data: users, 
    isLoading, 
    error,
    isError
  } = useQuery({
    queryKey: ['users', retryCount, user?.id],
    queryFn: () => fetchUsers(user),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 10000,
  });

  // Filtrar usuários master quando o usuário logado é admin
  const filteredUsers = users ? users.filter(u => {
    if (user?.role === 'admin') {
      return u.role !== 'master';
    }
    return true;
  }) : [];

  // Função para forçar uma atualização ao alterar a chave de consulta
  const forceRefresh = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    users: filteredUsers,
    isLoading,
    error,
    refetch: forceRefresh,
    isError
  };
};
