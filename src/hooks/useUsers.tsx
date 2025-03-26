
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/users";

export const useUsers = () => {
  const { 
    data: users, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false, // Evitar múltiplas requisições automáticas
    refetchOnMount: true,
    retry: 1, // Tentar apenas uma vez para não ficar em loop em caso de erro persistente
    staleTime: 10000, // 10 segundos antes de considerar os dados obsoletos
  });

  return {
    users: users || [], // Garantir que sempre retorne um array
    isLoading,
    error,
    refetch
  };
};
