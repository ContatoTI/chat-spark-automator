
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
    retry: 1, // Retry once if there's an error
  });

  return {
    users,
    isLoading,
    error,
    refetch
  };
};
