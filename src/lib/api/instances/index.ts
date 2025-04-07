
import { supabase } from '@/lib/supabase';
import { Instance } from '@/stores/instanceStore';

export const fetchInstances = async (empresaId = 'empresa-01'): Promise<Instance[]> => {
  try {
    console.log(`Fetching instances for company: ${empresaId}`);
    
    const { data, error } = await supabase
      .from('AppW_Instancias')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nome_instancia', { ascending: true });
    
    if (error) {
      console.error("Error fetching instances:", error);
      throw new Error(`Error fetching instances: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log(`No instances found for company ${empresaId}`);
      return [];
    }
    
    console.log(`Found ${data.length} instances for company ${empresaId}`);
    return data;
  } catch (error) {
    console.error('Error in fetchInstances:', error);
    throw error;
  }
};

export const createInstance = async (instance: Omit<Instance, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('AppW_Instancias')
      .insert([instance])
      .select();
    
    if (error) {
      throw new Error(`Error creating instance: ${error.message}`);
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in createInstance:', error);
    throw error;
  }
};

export const updateInstance = async (id: number, updates: Partial<Omit<Instance, 'id'>>) => {
  try {
    const { data, error } = await supabase
      .from('AppW_Instancias')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      throw new Error(`Error updating instance: ${error.message}`);
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in updateInstance:', error);
    throw error;
  }
};

export const deleteInstance = async (id: number) => {
  try {
    const { error } = await supabase
      .from('AppW_Instancias')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Error deleting instance: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteInstance:', error);
    throw error;
  }
};
