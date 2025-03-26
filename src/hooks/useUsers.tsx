
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
    staleTime: 0, // Always treat data as stale
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  return {
    users,
    isLoading,
    error,
    refetch
  };
};
