
export interface DisparoOptions {
  id?: number;
  empresa_id: string;  // Ensuring this is required (no ? mark)
  nome_da_empresa?: string;
  instancia?: string;
  ativo?: boolean;     // Making this optional
  
  // Configurações de Limite e Intervalos
  horario_limite?: number;
  long_wait_min?: number;
  long_wait_max?: number;
  short_wait_min?: number;
  short_wait_max?: number;
  batch_size_min?: number;
  batch_size_max?: number;
  
  // API e Webhooks
  url_api?: string;
  apikey?: string;
  webhook_disparo?: string;
  webhook_get_images?: string;
  webhook_up_docs?: string;
  webhook_instancias?: string;
  
  // Configurações FTP
  ftp_url?: string;
  ftp_user?: string;
  ftp_port?: number;
  ftp_password?: string;
  
  // Métricas
  numero_de_contatos?: number;
}

export const DEFAULT_OPTIONS: Partial<DisparoOptions> = {
  instancia: 'Padrão',
  ativo: true,
  horario_limite: 17,
  long_wait_min: 50,
  long_wait_max: 240,
  short_wait_min: 5,
  short_wait_max: 10,
  batch_size_min: 5,
  batch_size_max: 10,
  ftp_port: 21,
  numero_de_contatos: 0,
};
