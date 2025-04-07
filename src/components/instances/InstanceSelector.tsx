
import React, { useEffect } from "react";
import { useInstanceStore } from "@/stores/instanceStore";
import { fetchInstances } from "@/lib/api/instances";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

export const InstanceSelector = () => {
  const { 
    instances, 
    selectedInstance, 
    setInstances, 
    setSelectedInstance, 
    isLoading, 
    setIsLoading,
    error,
    setError
  } = useInstanceStore();

  useEffect(() => {
    const loadInstances = async () => {
      setIsLoading(true);
      try {
        const instancesData = await fetchInstances();
        setInstances(instancesData);
        
        // If there's no selected instance, set the first one
        if (!selectedInstance && instancesData.length > 0) {
          setSelectedInstance(instancesData[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error loading instances:", err);
        setError(err instanceof Error ? err : new Error('Failed to load instances'));
      } finally {
        setIsLoading(false);
      }
    };

    loadInstances();
  }, [setInstances, setSelectedInstance, setIsLoading, setError, selectedInstance]);

  const handleSelectInstance = (instanceId: string) => {
    const instance = instances.find(inst => inst.id.toString() === instanceId);
    if (instance) {
      setSelectedInstance(instance);
    }
  };

  if (isLoading && instances.length === 0) {
    return (
      <div className="flex items-center space-x-2 rounded-md border px-3 py-2">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span>Carregando instâncias...</span>
      </div>
    );
  }

  if (error && instances.length === 0) {
    return (
      <div className="flex items-center space-x-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-800">
        <span>Erro ao carregar instâncias</span>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[220px]">
      <Select
        value={selectedInstance?.id.toString()}
        onValueChange={handleSelectInstance}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma instância" />
        </SelectTrigger>
        <SelectContent>
          {instances.map((instance) => (
            <SelectItem key={instance.id} value={instance.id.toString()}>
              {instance.nome_instancia}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
