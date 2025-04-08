
/**
 * API functions for fetching and updating settings
 */

import { supabase } from '@/lib/supabase';
import { DisparoOptions, OptionRow, DEFAULT_OPTIONS } from './types';
import { convertRowsToDisparoOptions, convertDisparoOptionsToUpdates } from './utils';

/**
 * Fetches settings from the AppW_Options table
 */
export const fetchDisparoOptions = async (): Promise<DisparoOptions> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*');

    if (error) {
      console.error("Erro ao buscar configurações:", error);
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log("Nenhuma opção encontrada. Retornando valores padrão...");
      return { ...DEFAULT_OPTIONS };
    }

    return convertRowsToDisparoOptions(data as OptionRow[]);
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
    const { data: existingOptions, error: fetchError } = await supabase
      .from('AppW_Options')
      .select('option');
    
    if (fetchError) {
      throw new Error(`Erro ao verificar opções existentes: ${fetchError.message}`);
    }
    
    if (!existingOptions || existingOptions.length === 0) {
      throw new Error('Não é possível atualizar as configurações: nenhuma opção encontrada no banco de dados. Contate o administrador do sistema.');
    }
    
    const existingOptionsMap = new Set(existingOptions.map(row => row.option));
    
    const updateList = convertDisparoOptionsToUpdates(options);
    
    for (const { option, updates } of updateList) {
      if (existingOptionsMap.has(option)) {
        const { error } = await supabase
          .from('AppW_Options')
          .update(updates)
          .eq('option', option);

        if (error) {
          throw new Error(`Erro ao atualizar configuração ${option}: ${error.message}`);
        }
      } else {
        console.warn(`Configuração "${option}" não existe no banco de dados e não pode ser criada devido às restrições de RLS.`);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};
