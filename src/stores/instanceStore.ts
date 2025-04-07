
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Instance {
  id: number;
  nome_instancia: string;
  empresa_id: string;
}

interface InstanceState {
  instances: Instance[];
  selectedInstance: Instance | null;
  isLoading: boolean;
  error: Error | null;
  setInstances: (instances: Instance[]) => void;
  setSelectedInstance: (instance: Instance | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useInstanceStore = create<InstanceState>()(
  persist(
    (set) => ({
      instances: [],
      selectedInstance: null,
      isLoading: false,
      error: null,
      setInstances: (instances) => set({ instances }),
      setSelectedInstance: (instance) => set({ selectedInstance: instance }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'instance-store',
    }
  )
);
