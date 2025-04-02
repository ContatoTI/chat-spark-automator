
/**
 * Types related to application settings
 */

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
  webhook_up_docs: string;
  ftp_url: string;
  ftp_user: string;
  ftp_port: number;
  ftp_password: string;
}

export const DEFAULT_OPTIONS: DisparoOptions = {
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
  webhook_get_images: '',
  webhook_up_docs: '',
  ftp_url: '',
  ftp_user: '',
  ftp_port: 21,
  ftp_password: '',
};
