
import { supabase } from '@/lib/supabase';

export interface OptionRow {
  option: string;
  text: string | null;
  numeric: number | null;
  boolean: boolean | null;
}

export interface DisparoOptions {
  instancia: string;
  Ativo: boolean;
  Producao: boolean;
  Limite_disparos: number;
  Enviados: number;
  horario_limite: number;
  long_wait_min: number;
  long_wait_max: number;
  ShortWaitMin: number;
  ShortWaitMax: number;
  BatchSizeMim: number;
  BatchSizeMax: number;
  urlAPI: string;
  apikey: string;
}

// Mapeamento entre nomes de opções na tabela e propriedades no objeto DisparoOptions
const optionMapping = {
  instancia: { field: 'text', key: 'instancia' },
  ativo: { field: 'boolean', key: 'Ativo' },
  producao: { field: 'boolean', key: 'Producao' },
  limite_disparos: { field: 'numeric', key: 'Limite_disparos' },
  enviados: { field: 'numeric', key: 'Enviados' },
  horario_limite: { field: 'numeric', key: 'horario_limite' },
  long_wait_min: { field: 'numeric', key: 'long_wait_min' },
  long_wait_max: { field: 'numeric', key: 'long_wait_max' },
  shor_wait_min: { field: 'numeric', key: 'ShortWaitMin' },
  short_wait_max: { field: 'numeric', key: 'ShortWaitMax' },
  batch_size_min: { field: 'numeric', key: 'BatchSizeMim' },
  batch_size_max: { field: 'numeric', key: 'BatchSizeMax' },
  url_api: { field: 'text', key: 'urlAPI' },
  apikey: { field: 'text', key: 'apikey' },
};

/**
 * Converte os dados da tabela vertical AppW_Options para o formato DisparoOptions
 */
function convertRowsToDisparoOptions(rows: OptionRow[]): DisparoOptions {
  const options: Partial<DisparoOptions> = {
    instancia: '',
    Ativo: true,
    Producao: false,
    Limite_disparos: 1000,
    Enviados: 0,
    horario_limite: 17,
    long_wait_min: 50,
    long_wait_max: 240,
    ShortWaitMin: 5,
    ShortWaitMax: 10,
    BatchSizeMim: 5,
    BatchSizeMax: 10,
    urlAPI: '',
    apikey: '',
  };

  // Para cada linha, aplica o valor ao campo correspondente
  rows.forEach(row => {
    const mapping = Object.entries(optionMapping).find(([key]) => key === row.option);
    if (mapping) {
      const [_, { field, key }] = mapping;
      if (field === 'text' && row.text !== null) {
        options[key as keyof DisparoOptions] = row.text as any;
      } else if (field === 'numeric' && row.numeric !== null) {
        options[key as keyof DisparoOptions] = row.numeric as any;
      } else if (field === 'boolean' && row.boolean !== null) {
        options[key as keyof DisparoOptions] = row.boolean as any;
      }
    }
  });

  return options as DisparoOptions;
}

/**
 * Converte um objeto DisparoOptions em um array de atualizações para a tabela AppW_Options
 */
function convertDisparoOptionsToUpdates(options: DisparoOptions): { option: string; updates: Partial<OptionRow> }[] {
  return Object.entries(optionMapping).map(([optionName, { field, key }]) => {
    const value = options[key as keyof DisparoOptions];
    const updates: Partial<OptionRow> = { option: optionName };
    
    if (field === 'text') {
      updates.text = value as string;
    } else if (field === 'numeric') {
      updates.numeric = value as number;
    } else if (field === 'boolean') {
      updates.boolean = value as boolean;
    }
    
    return { option: optionName, updates };
  });
}

/**
 * Busca as opções de configuração da nova tabela AppW_Options
 */
export const fetchDisparoOptions = async (): Promise<DisparoOptions> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*');

    if (error) {
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Nenhuma configuração encontrada');
    }

    // Converte as linhas da tabela para o formato DisparoOptions
    return convertRowsToDisparoOptions(data as OptionRow[]);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
};

/**
 * Atualiza as opções de configuração na nova tabela AppW_Options
 */
export const updateDisparoOptions = async (options: DisparoOptions): Promise<void> => {
  try {
    // Converte o objeto para atualizações individuais
    const updates = convertDisparoOptionsToUpdates(options);
    
    // Realiza uma atualização para cada opção
    for (const { option, updates } of updates) {
      const { error } = await supabase
        .from('AppW_Options')
        .update(updates)
        .eq('option', option);

      if (error) {
        throw new Error(`Erro ao atualizar configuração ${option}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};
