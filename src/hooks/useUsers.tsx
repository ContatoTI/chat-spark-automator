
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
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1, // Tentar apenas uma vez para não ficar em loop em caso de erro persistente
  });

  return {
    users: users || [], // Garantir que sempre retorne um array
    isLoading,
    error,
    refetch
  };
};
