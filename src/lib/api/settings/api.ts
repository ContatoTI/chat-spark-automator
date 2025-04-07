
/**
 * API functions for fetching and updating settings
 */

import { supabase } from '@/lib/supabase';
import { DisparoOptions, DEFAULT_OPTIONS } from './types';
import { convertRowsToDisparoOptions, convertDisparoOptionsToUpdates } from './utils';

/**
 * Busca as configurações da tabela AppW_Options
 * Adaptada para o novo formato horizontal de dados
 */
export const fetchDisparoOptions = async (): Promise<DisparoOptions> => {
  try {
    console.log("Buscando configurações no formato horizontal");
    
    // No novo formato, buscamos uma única linha que contém todas as configurações
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*')
      .limit(1);

    if (error) {
      console.error("Erro ao buscar configurações:", error);
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log("Nenhuma configuração encontrada. Retornando valores padrão...");
      return { ...DEFAULT_OPTIONS };
    }

    console.log("Configurações encontradas:", data);
    return convertRowsToDisparoOptions(data);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
};

/**
 * Atualiza as configurações na tabela AppW_Options
 * Adaptada para o novo formato horizontal de dados
 */
export const updateDisparoOptions = async (options: DisparoOptions): Promise<void> => {
  try {
    console.log("Atualizando configurações no formato horizontal");
    
    // Converte as opções para o formato de atualização
    const updates = convertDisparoOptionsToUpdates(options);
    
    // Verifica se há alguma linha no banco
    const { data: existingData, error: countError } = await supabase
      .from('AppW_Options')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw new Error(`Erro ao verificar existência de configurações: ${countError.message}`);
    }
    
    if (!existingData || existingData.length === 0) {
      // Se não houver nenhuma linha, insere uma nova
      const { error: insertError } = await supabase
        .from('AppW_Options')
        .insert([updates]);
      
      if (insertError) {
        throw new Error(`Erro ao inserir configurações: ${insertError.message}`);
      }
    } else {
      // Se já existir uma linha, atualiza ela
      const { error: updateError } = await supabase
        .from('AppW_Options')
        .update(updates)
        .eq('id', existingData[0].id); // Assume que há um campo id para identificar a linha
      
      if (updateError) {
        throw new Error(`Erro ao atualizar configurações: ${updateError.message}`);
      }
    }
    
    console.log("Configurações atualizadas com sucesso");
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};
