
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
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return {
    users: users || [], // Garantir que sempre retorne um array
    isLoading,
    error,
    refetch
  };
};
