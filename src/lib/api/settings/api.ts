
/**
 * API functions for fetching and updating settings
 */

import { supabase } from '@/lib/supabase';
import { DisparoOptions, DEFAULT_OPTIONS } from './types';
import { convertRowsToDisparoOptions, convertDisparoOptionsToUpdates } from './utils';

/**
 * Busca as configurações da tabela AppW_Options
 * Adaptada para o novo formato horizontal de dados, usando empresa_id
 */
export const fetchDisparoOptions = async (empresaId = 'empresa-01'): Promise<DisparoOptions> => {
  try {
    console.log(`Buscando configurações no formato horizontal para empresa: ${empresaId}`);
    
    // No novo formato, buscamos uma única linha que corresponde ao empresa_id
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*')
      .eq('empresa_id', empresaId)
      .limit(1);

    if (error) {
      console.error("Erro ao buscar configurações:", error);
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log(`Nenhuma configuração encontrada para empresa ${empresaId}. Retornando valores padrão...`);
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
 * Adaptada para o novo formato horizontal de dados, usando empresa_id
 */
export const updateDisparoOptions = async (options: DisparoOptions, empresaId = 'empresa-01'): Promise<void> => {
  try {
    console.log(`Atualizando configurações no formato horizontal para empresa: ${empresaId}`);
    
    // Converte as opções para o formato de atualização, incluindo empresa_id
    const updates = convertDisparoOptionsToUpdates(options);
    
    // Verifica se a empresa já existe na tabela
    const { data: existingData, error: countError } = await supabase
      .from('AppW_Options')
      .select('*')
      .eq('empresa_id', empresaId)
      .limit(1);
    
    if (countError) {
      throw new Error(`Erro ao verificar existência de configurações: ${countError.message}`);
    }
    
    // Garante que o empresa_id seja incluído nas atualizações
    updates.empresa_id = empresaId;
    
    if (!existingData || existingData.length === 0) {
      // Se não houver nenhuma linha para esta empresa, insere uma nova
      const { error: insertError } = await supabase
        .from('AppW_Options')
        .insert([updates]);
      
      if (insertError) {
        throw new Error(`Erro ao inserir configurações: ${insertError.message}`);
      }
    } else {
      // Se já existir uma linha para esta empresa, atualiza ela
      const { error: updateError } = await supabase
        .from('AppW_Options')
        .update(updates)
        .eq('empresa_id', empresaId);
      
      if (updateError) {
        throw new Error(`Erro ao atualizar configurações: ${updateError.message}`);
      }
    }
    
    console.log(`Configurações atualizadas com sucesso para empresa: ${empresaId}`);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};
