
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
    staleTime: 0, // Sempre considerar os dados como desatualizados
    refetchOnMount: true, // Atualizar quando o componente montar
    refetchOnWindowFocus: true, // Atualizar quando a janela ganhar foco
    retry: 2, // Tentar novamente duas vezes em caso de erro
    refetchInterval: false, // Não atualizar automaticamente em intervalos
  });

  return {
    users: users || [], // Garantir que sempre retorne um array
    isLoading,
    error,
    refetch
  };
};
