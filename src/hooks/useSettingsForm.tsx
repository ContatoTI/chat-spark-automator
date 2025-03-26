
import { useQuery } from "@tanstack/react-query";
import { fetchDisparoOptions } from "@/lib/api/settings";

export const useSettingsForm = () => {
  const { 
    data: settings, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['disparo-options'],
    queryFn: fetchDisparoOptions,
  });

  return {
    settings,
    isLoading,
    error,
    refetch
  };
};
