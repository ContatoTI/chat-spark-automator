
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
  webhook_disparo: string;
  webhook_contatos: string;
}

// Mapeamento entre nomes de opções na tabela e propriedades no objeto DisparoOptions
const optionMapping: Record<string, { field: 'text' | 'numeric' | 'boolean', key: keyof DisparoOptions }> = {
  instancia: { field: 'text', key: 'instancia' },
  ativo: { field: 'boolean', key: 'Ativo' },
  producao: { field: 'boolean', key: 'Producao' },
  limite_disparos: { field: 'numeric', key: 'Limite_disparos' },
  enviados: { field: 'numeric', key: 'Enviados' },
  horario_limite: { field: 'numeric', key: 'horario_limite' },
  long_wait_min: { field: 'numeric', key: 'long_wait_min' },
  long_wait_max: { field: 'numeric', key: 'long_wait_max' },
  shor_wait_min: { field: 'numeric', key: 'ShortWaitMin' }, // Observação: Tem um typo no nome da coluna no banco
  short_wait_max: { field: 'numeric', key: 'ShortWaitMax' },
  batch_size_min: { field: 'numeric', key: 'BatchSizeMim' }, // Atenção ao erro de digitação "Mim" ao invés de "Min"
  batch_size_max: { field: 'numeric', key: 'BatchSizeMax' },
  url_api: { field: 'text', key: 'urlAPI' },
  apikey: { field: 'text', key: 'apikey' },
  webhook_disparo: { field: 'text', key: 'webhook_disparo' },
  webhook_contatos: { field: 'text', key: 'webhook_contatos' },
};

// Valores padrão para inicializar a tabela
const defaultOptions: { option: string; field: 'text' | 'numeric' | 'boolean'; value: string | number | boolean }[] = [
  { option: 'instancia', field: 'text', value: 'default' },
  { option: 'ativo', field: 'boolean', value: true },
  { option: 'producao', field: 'boolean', value: false },
  { option: 'limite_disparos', field: 'numeric', value: 1000 },
  { option: 'enviados', field: 'numeric', value: 0 },
  { option: 'horario_limite', field: 'numeric', value: 17 },
  { option: 'long_wait_min', field: 'numeric', value: 50 },
  { option: 'long_wait_max', field: 'numeric', value: 240 },
  { option: 'shor_wait_min', field: 'numeric', value: 5 },
  { option: 'short_wait_max', field: 'numeric', value: 10 },
  { option: 'batch_size_min', field: 'numeric', value: 5 },
  { option: 'batch_size_max', field: 'numeric', value: 10 },
  { option: 'url_api', field: 'text', value: 'https://api.example.com' },
  { option: 'apikey', field: 'text', value: '' },
  { option: 'webhook_disparo', field: 'text', value: 'https://webhook.example.com/disparo' },
  { option: 'webhook_contatos', field: 'text', value: 'https://webhook.example.com/contatos' },
];

/**
 * Verifica se uma opção existe na tabela AppW_Options
 */
async function optionExists(option: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('AppW_Options')
    .select('*', { count: 'exact', head: true })
    .eq('option', option);
  
  if (error) {
    console.error(`Erro ao verificar se a opção ${option} existe:`, error);
    return false;
  }
  
  return count !== null && count > 0;
}

/**
 * Inicializa a tabela AppW_Options com valores padrão se estiver vazia
 */
async function initializeOptionsTable() {
  try {
    const { count, error: countError } = await supabase
      .from('AppW_Options')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Erro ao verificar tabela AppW_Options:', countError);
      return;
    }
    
    if (count === 0) {
      console.log('Inicializando tabela AppW_Options com valores padrão');
      
      const inserts = defaultOptions.map(option => {
        const row: any = { option: option.option };
        row[option.field] = option.value;
        return row;
      });
      
      const { error } = await supabase
        .from('AppW_Options')
        .insert(inserts);
      
      if (error) {
        console.error('Erro ao inicializar tabela AppW_Options:', error);
      } else {
        console.log('Tabela AppW_Options inicializada com sucesso');
      }
    }
  } catch (error) {
    console.error('Erro ao verificar tabela AppW_Options:', error);
  }
}

/**
 * Converte os dados da tabela vertical AppW_Options para o formato DisparoOptions
 */
function convertRowsToDisparoOptions(rows: OptionRow[]): DisparoOptions {
  const options: DisparoOptions = {
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
    webhook_disparo: '',
    webhook_contatos: '',
  };

  // Para cada linha, aplica o valor ao campo correspondente
  rows.forEach(row => {
    console.log(`Processando opção: ${row.option} com valores:`, row);
    const mapping = Object.entries(optionMapping).find(([key]) => key === row.option);
    if (mapping) {
      const [_, { field, key }] = mapping;
      if (field === 'text' && row.text !== null) {
        (options[key] as string) = row.text;
      } else if (field === 'numeric' && row.numeric !== null) {
        (options[key] as number) = row.numeric;
      } else if (field === 'boolean' && row.boolean !== null) {
        (options[key] as boolean) = row.boolean;
      }
    } else {
      console.warn(`Opção não mapeada: ${row.option}`);
    }
  });

  console.log("Opções convertidas:", options);
  return options;
}

/**
 * Converte um objeto DisparoOptions em um array de atualizações para a tabela AppW_Options
 */
function convertDisparoOptionsToUpdates(options: DisparoOptions): { option: string; updates: Partial<OptionRow> }[] {
  const updateList: { option: string; updates: Partial<OptionRow> }[] = [];
  
  Object.entries(optionMapping).forEach(([optionName, { field, key }]) => {
    const value = options[key];
    const updateObj: Partial<OptionRow> = {};
    
    if (field === 'text') {
      updateObj.text = value as string;
    } else if (field === 'numeric') {
      updateObj.numeric = value as number;
    } else if (field === 'boolean') {
      updateObj.boolean = value as boolean;
    }
    
    updateList.push({ option: optionName, updates: updateObj });
  });
  
  return updateList;
}

/**
 * Busca as opções de configuração da nova tabela AppW_Options
 */
export const fetchDisparoOptions = async (): Promise<DisparoOptions> => {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    console.log("Buscando configurações globais");
    
    // Inicializa a tabela com valores padrão se estiver vazia
    await initializeOptionsTable();
    
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*');

    if (error) {
      console.error('Erro ao buscar configurações:', error);
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }

    console.log("Dados brutos recebidos do Supabase:", data);

    if (!data || data.length === 0) {
      console.log('Nenhuma configuração encontrada, usando valores padrão');
      return {
        instancia: 'default',
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
        urlAPI: 'https://api.example.com',
        apikey: '',
        webhook_disparo: 'https://webhook.example.com/disparo',
        webhook_contatos: 'https://webhook.example.com/contatos',
      };
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
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    console.log("Atualizando configurações globais");
    
    // Converte o objeto para atualizações individuais
    const updateList = convertDisparoOptionsToUpdates(options);
    
    // Realiza uma atualização para cada opção
    for (const { option, updates } of updateList) {
      // Verificar se a opção já existe
      const exists = await optionExists(option);
      
      if (exists) {
        // Atualiza a opção existente
        const { error } = await supabase
          .from('AppW_Options')
          .update(updates)
          .eq('option', option);

        if (error) {
          console.error(`Erro ao atualizar configuração ${option}:`, error);
          throw new Error(`Erro ao atualizar configuração ${option}: ${error.message}`);
        }
      } else {
        // Insere a opção se não existir
        const { error } = await supabase
          .from('AppW_Options')
          .insert({ option, ...updates });

        if (error) {
          console.error(`Erro ao inserir configuração ${option}:`, error);
          throw new Error(`Erro ao inserir configuração ${option}: ${error.message}`);
        }
      }
    }
    
    console.log("Configurações atualizadas com sucesso");
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};
