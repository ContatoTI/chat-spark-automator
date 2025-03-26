
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/users";
import { useState } from "react";

export const useUsers = () => {
  const [retryCount, setRetryCount] = useState(0);

  const { 
    data: users, 
    isLoading, 
    error,
    isError
  } = useQuery({
    queryKey: ['users', retryCount],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 10000,
  });

  // Função para forçar uma atualização ao alterar a chave de consulta
  const forceRefresh = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    users: users || [],
    isLoading,
    error,
    refetch: forceRefresh,
    isError
  };
};
