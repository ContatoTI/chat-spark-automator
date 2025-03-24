
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client
const supabaseUrl = 'https://supa.automaik.com.br/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface DisparoOptions {
  instancia: string;
  Ativo: boolean;
  Producao: boolean; // Changed from lowercase 'producao' to match DB schema 'Producao'
  Limite_disparos: number; // Changed from lowercase
  Enviados: number; // Changed from lowercase
  horario_limite: number;
  long_wait_min: number;
  long_wait_max: number;
  ShortWaitMin: number; // Changed to match DB 'ShortWaitMin'
  ShortWaitMax: number; // Changed to match DB 'ShortWaitMax'
  BatchSizeM: number; // Changed to match DB 'BatchSizeM'
  BatchSizeMax: number; // Changed to match DB 'BatchSizeMax'
  urlAPI: string;
}

/**
 * Fetches the disparo options from Supabase
 */
export const fetchDisparoOptions = async (): Promise<DisparoOptions> => {
  try {
    const { data, error } = await supabase
      .from('Disparo_Options')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }

    if (!data) {
      throw new Error('Nenhuma configuração encontrada');
    }

    return data as DisparoOptions;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
};

/**
 * Updates the disparo options in Supabase
 */
export const updateDisparoOptions = async (options: DisparoOptions): Promise<void> => {
  try {
    // First check if there's an existing record
    const { data: existingData, error: checkError } = await supabase
      .from('Disparo_Options')
      .select('*')
      .limit(1);

    if (checkError) {
      throw new Error(`Erro ao verificar configurações existentes: ${checkError.message}`);
    }

    // If there's an existing record, update it, otherwise insert a new one
    if (existingData && existingData.length > 0) {
      const { error } = await supabase
        .from('Disparo_Options')
        .update(options)
        .eq('instancia', existingData[0].instancia);

      if (error) {
        throw new Error(`Erro ao atualizar configurações: ${error.message}`);
      }
    } else {
      const { error } = await supabase
        .from('Disparo_Options')
        .insert([options]);

      if (error) {
        throw new Error(`Erro ao inserir configurações: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};
