
/**
 * Mappings for option fields to their database representation
 */

import { DisparoOptions } from './types';

/**
 * Maps database option names to their corresponding field type and property in DisparoOptions
 */
export const optionMapping: Record<string, { field: 'text' | 'numeric' | 'boolean', key: keyof DisparoOptions }> = {
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
  webhook_up_docs: { field: 'text', key: 'webhook_up_docs' },
  ftp_url: { field: 'text', key: 'ftp_url' },
  ftp_user: { field: 'text', key: 'ftp_user' },
  ftp_port: { field: 'numeric', key: 'ftp_port' },
  ftp_password: { field: 'text', key: 'ftp_password' },
};
