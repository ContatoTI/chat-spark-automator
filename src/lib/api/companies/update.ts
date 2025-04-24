
import { supabase } from "@/lib/supabase";
import { DisparoOptions } from "@/lib/api/settings";

// Função para atualizar o nome de uma empresa
export const updateCompany = async (id: string, name: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('AppW_Options')
      .update({ nome_da_empresa: name })
      .eq('empresa_id', id);
    
    if (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw new Error(`Falha ao atualizar empresa: ${error.message}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    throw error;
  }
};

// Função para atualizar as configurações de uma empresa específica
export const updateCompanySettings = async (options: DisparoOptions): Promise<void> => {
  try {
    console.log("Atualizando configurações da empresa:", options);
    
    // Verifica as colunas disponíveis na tabela antes de enviar a atualização
    const { data: columnInfo, error: columnError } = await supabase
      .from('AppW_Options')
      .select()
      .limit(1);
    
    if (columnError) {
      console.error("Erro ao verificar colunas da tabela:", columnError);
      throw new Error(`Falha ao verificar colunas da tabela: ${columnError.message}`);
    }
    
    // Se encontrou dados, usa as chaves do primeiro objeto como referência para as colunas disponíveis
    const availableColumns = columnInfo && columnInfo.length > 0 
      ? Object.keys(columnInfo[0]) 
      : [];
    
    console.log("Colunas disponíveis na tabela:", availableColumns);
    
    // Filtra os campos para manter apenas os que existem na tabela
    const filteredOptions = Object.fromEntries(
      Object.entries(options)
        .filter(([key, value]) => value !== undefined) // Remove campos undefined
        .filter(([key]) => key === 'empresa_id' || availableColumns.includes(key)) // Mantém apenas campos existentes
    );
    
    // Garante que empresa_id está incluído na condição de busca
    const empresaId = options.empresa_id;
    
    // Log dos dados filtrados a serem enviados
    console.log("Dados filtrados a serem enviados:", filteredOptions);
    
    const { error } = await supabase
      .from('AppW_Options')
      .update(filteredOptions)
      .eq('empresa_id', empresaId);
    
    if (error) {
      console.error("Erro ao atualizar configurações da empresa:", error);
      throw new Error(`Falha ao atualizar configurações da empresa: ${error.message}`);
    }
    
    console.log("Configurações atualizadas com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar configurações da empresa:", error);
    throw error;
  }
};
