
import { useQuery } from "@tanstack/react-query";
import { fetchDisparoOptions } from "@/lib/api/settings";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

export const useSettingsForm = () => {
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);

  const { 
    data: settings, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['disparo-options', retryCount],
    queryFn: fetchDisparoOptions,
    retry: 1,
    retryDelay: 1000,
    // Não armazenamos em cache por muito tempo, pois as configurações
    // podem ser alteradas por outros usuários
    staleTime: 30000,
    // Adicionar uma função de manipulação de erros detalhada
    meta: {
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Ocorreu um erro desconhecido ao carregar configurações';
        
        console.error("Erro detalhado ao carregar configurações:", error);
        
        if (errorMessage.includes('RLS')) {
          toast({
            variant: "destructive",
            title: "Erro de permissão",
            description: "Você não tem permissão para acessar as configurações. Contate o administrador.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao carregar configurações",
            description: errorMessage,
          });
        }
      }
    }
  });

  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar configurações:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar configurações",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
      });
    }
  }, [error, toast]);

  // Função para forçar uma atualização ao alterar a chave de consulta
  const forceRefresh = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    settings,
    isLoading,
    error,
    refetch: forceRefresh
  };
};
