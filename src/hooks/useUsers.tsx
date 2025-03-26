
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/users";
import { useState, useEffect } from "react";

export const useUsers = () => {
  const [retryCount, setRetryCount] = useState(0);

  const { 
    data: users, 
    isLoading, 
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['users', retryCount],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false, // Evitar múltiplas requisições automáticas
    refetchOnMount: true,
    retry: 1, // Tentar apenas uma vez para não ficar em loop em caso de erro persistente
    staleTime: 10000, // 10 segundos antes de considerar os dados obsoletos
  });

  // Função para forçar uma atualização ao alterar a chave de consulta
  const forceRefresh = () => {
    setRetryCount(prev => prev + 1);
  };

  useEffect(() => {
    console.log("useUsers estado:", { 
      usuariosCount: users?.length, 
      temErro: !!error, 
      carregando: isLoading,
      tentativa: retryCount
    });
  }, [users, error, isLoading, retryCount]);

  return {
    users: users || [], // Garantir que sempre retorne um array
    isLoading,
    error,
    refetch: forceRefresh, // Usar o forceRefresh para garantir uma nova consulta
    isError
  };
};
