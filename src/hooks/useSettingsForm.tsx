
import { useQuery } from "@tanstack/react-query";
import { fetchDisparoOptions, DisparoOptions } from "@/lib/api/settings";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useSettingsForm = () => {
  const { toast } = useToast();
  
  const { 
    data: settings, 
    isLoading, 
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['disparo-options'],
    queryFn: fetchDisparoOptions,
    retry: 5,  // Increase retries to handle initial load issues
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show toast when there's an error
  useEffect(() => {
    if (error && error instanceof Error) {
      console.error("Erro ao carregar configurações:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar configurações",
        description: error.message,
      });
    }
  }, [error, toast]);

  // Provide default values if no settings are available
  const defaultSettings: DisparoOptions = {
    instancia: '',
    Ativo: true,
    Producao: false,
    Limite_disparos: 1000,
    Enviados: 0,
    horario_limite: 17,
    long_wait_min: 50,
    long_wait_max: 240,
    ShortWaitMin: 5,
    ShortWaitMax: 10,
    BatchSizeMim: 5,
    BatchSizeMax: 10,
    urlAPI: '',
    apikey: '',
    webhook_disparo: '',
    webhook_contatos: '',
  };

  return {
    settings: settings || defaultSettings,
    isLoading,
    error,
    refetch,
    isError
  };
};
