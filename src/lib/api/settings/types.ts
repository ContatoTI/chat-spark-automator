
/**
 * Types related to application settings
 */

export interface DisparoOptions {
  id?: number;
  empresa_id?: string;
  instancia?: string;
  ativo: boolean;
  horario_limite: number;
  long_wait_min: number;
  long_wait_max: number;
  short_wait_min: number;
  short_wait_max: number;
  batch_size_min: number;
  batch_size_max: number;
  url_api?: string;
  apikey?: string;
  webhook_disparo?: string;
  webhook_contatos?: string;
  webhook_get_images?: string;
  webhook_up_docs?: string;
  webhook_instancias?: string; // Novo campo adicionado
  ftp_url?: string;
  ftp_user?: string;
  ftp_port: number;
  ftp_password?: string;
  numero_de_contatos?: number;
}

export const DEFAULT_OPTIONS: DisparoOptions = {
  instancia: 'Padrão',
  ativo: true,
  horario_limite: 17,
  long_wait_min: 50,
  long_wait_max: 240,
  short_wait_min: 5,
  short_wait_max: 10,
  batch_size_min: 5,
  batch_size_max: 10,
  url_api: '',
  apikey: '',
  webhook_disparo: '',
  webhook_contatos: '',
  webhook_get_images: '',
  webhook_up_docs: '',
  webhook_instancias: '', // Novo campo adicionado
  ftp_url: '',
  ftp_user: '',
  ftp_port: 21,
  ftp_password: '',
  numero_de_contatos: 0,
};
