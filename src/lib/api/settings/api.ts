
/**
 * API functions for fetching and updating settings
 */

import { supabase } from '@/lib/supabase';
import { DisparoOptions, DEFAULT_OPTIONS } from './types';

/**
 * Fetches settings from the AppW_Options table
 * which stores settings in a horizontal format (one row per company)
 */
export const fetchDisparoOptions = async (): Promise<DisparoOptions> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*')
      .limit(1);  // Get the first row, which contains all settings

    if (error) {
      console.error("Erro ao buscar configurações:", error);
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log("Nenhuma configuração encontrada. Retornando valores padrão...");
      return { ...DEFAULT_OPTIONS };
    }

    // The data is already in the right format - just return the first row
    const options: DisparoOptions = data[0];
    
    // Handle any null values by providing defaults and ensure ativo is a boolean
    return {
      ...DEFAULT_OPTIONS,
      ...options,
      // Convert ativo to boolean if it's a string or other type
      ativo: typeof options.ativo === 'boolean' ? options.ativo : 
             options.ativo === true || options.ativo === 'true' || options.ativo === '1',
    };
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
};

/**
 * Updates settings in the AppW_Options table
 */
export const updateDisparoOptions = async (options: DisparoOptions): Promise<void> => {
  try {
    // First check if there's a record
    const { data: existingData, error: checkError } = await supabase
      .from('AppW_Options')
      .select('id')
      .limit(1);
    
    if (checkError) {
      throw new Error(`Erro ao verificar configurações existentes: ${checkError.message}`);
    }
    
    if (!existingData || existingData.length === 0) {
      // Insert a new record if none exists
      const { error: insertError } = await supabase
        .from('AppW_Options')
        .insert(options);
      
      if (insertError) {
        throw new Error(`Erro ao inserir configurações: ${insertError.message}`);
      }
    } else {
      // Update existing record
      const { error: updateError } = await supabase
        .from('AppW_Options')
        .update(options)
        .eq('id', existingData[0].id);
      
      if (updateError) {
        throw new Error(`Erro ao atualizar configurações: ${updateError.message}`);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};
