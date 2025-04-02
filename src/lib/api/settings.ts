
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
  webhook_get_images: string;
  ftp_url: string;
  ftp_user: string;
  ftp_port: number;
  ftp_password: string;
}

const optionMapping: Record<string, { field: 'text' | 'numeric' | 'boolean', key: keyof DisparoOptions }> = {
  instancia: { field: 'text', key: 'instancia' },
  ativo: { field: 'boolean', key: 'Ativo' },
  horario_limite: { field: 'numeric', key: 'horario_limite' },
  long_wait_min: { field: 'numeric', key: 'long_wait_min' },
  long_wait_max: { field: 'numeric', key: 'long_wait_max' },
  shor_wait_min: { field: 'numeric', key: 'ShortWaitMin' },
  short_wait_max: { field: 'numeric', key: 'ShortWaitMax' },
  batch_size_min: { field: 'numeric', key: 'BatchSizeMim' },
  batch_size_max: { field: 'numeric', key: 'BatchSizeMax' },
  url_api: { field: 'text', key: 'urlAPI' },
  apikey: { field: 'text', key: 'apikey' },
  webhook_disparo: { field: 'text', key: 'webhook_disparo' },
  webhook_contatos: { field: 'text', key: 'webhook_contatos' },
  webhook_get_images: { field: 'text', key: 'webhook_get_images' },
  ftp_url: { field: 'text', key: 'ftp_url' },
  ftp_user: { field: 'text', key: 'ftp_user' },
  ftp_port: { field: 'numeric', key: 'ftp_port' },
  ftp_password: { field: 'text', key: 'ftp_password' },
};

/**
 * Converte os dados da tabela vertical AppW_Options para o formato DisparoOptions
 */
function convertRowsToDisparoOptions(rows: OptionRow[]): DisparoOptions {
  const options: DisparoOptions = {
    instancia: '',
    Ativo: true,
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
    ftp_url: '',
    ftp_user: '',
    ftp_port: 0,
    ftp_password: '',
  };

  rows.forEach(row => {
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
    }
  });

  return options;
}

/**
 * Converte um objeto DisparoOptions em um array de atualizações para a tabela AppW_Options
 */
function convertDisparoOptionsToUpdates(options: DisparoOptions): { option: string; updates: Partial<OptionRow> }[] {
  const updateList: { option: string; updates: Partial<OptionRow> }[] = [];
  
  Object.entries(optionMapping).forEach(([optionName, { field, key }]) => {
    const value = options[key];
    const updateObj: Partial<OptionRow> = { option: optionName };
    
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
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*');

    if (error) {
      console.error("Erro ao buscar configurações:", error);
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log("Nenhuma opção encontrada. Retornando valores padrão...");
      
      const defaultOptions: DisparoOptions = {
        instancia: 'Padrão',
        Ativo: true,
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
        ftp_url: '',
        ftp_user: '',
        ftp_port: 0,
        ftp_password: '',
      };
      
      return defaultOptions;
    }

    return convertRowsToDisparoOptions(data as OptionRow[]);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
};

/**
 * Atualiza as opções de configuração na tabela AppW_Options
 * Usando apenas operações UPDATE para evitar problemas com RLS
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
