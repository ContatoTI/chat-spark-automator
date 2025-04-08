
/**
 * Utility functions for settings conversion
 */

import { DisparoOptions, OptionRow } from './types';
import { optionMapping } from './mappings';
import { DEFAULT_OPTIONS } from './types';

/**
 * Converte as configurações da tabela AppW_Options para o objeto DisparoOptions
 * Adaptado para o novo formato horizontal do banco de dados (uma linha por empresa)
 */
export function convertRowsToDisparoOptions(rows: any[]): DisparoOptions {
  // Se não houver dados, retorna os valores padrão
  if (!rows || rows.length === 0) {
    return { ...DEFAULT_OPTIONS };
  }

  // No novo formato, temos apenas uma linha com todas as colunas
  const empresaRow = rows[0];
  
  // Inicializa com os valores padrão
  const options = { ...DEFAULT_OPTIONS };
  
  // Mapeia diretamente as colunas do banco para as propriedades do objeto
  if (empresaRow.instancia !== undefined && empresaRow.instancia !== null) {
    options.instancia = empresaRow.instancia;
  }
  
  if (empresaRow.ativo !== undefined && empresaRow.ativo !== null) {
    options.Ativo = empresaRow.ativo;
  }
  
  if (empresaRow.horario_limite !== undefined && empresaRow.horario_limite !== null) {
    options.horario_limite = empresaRow.horario_limite;
  }
  
  if (empresaRow.long_wait_min !== undefined && empresaRow.long_wait_min !== null) {
    options.long_wait_min = empresaRow.long_wait_min;
  }
  
  if (empresaRow.long_wait_max !== undefined && empresaRow.long_wait_max !== null) {
    options.long_wait_max = empresaRow.long_wait_max;
  }
  
  if (empresaRow.shor_wait_min !== undefined && empresaRow.shor_wait_min !== null) {
    options.ShortWaitMin = empresaRow.shor_wait_min;
  }
  
  if (empresaRow.short_wait_max !== undefined && empresaRow.short_wait_max !== null) {
    options.ShortWaitMax = empresaRow.short_wait_max;
  }
  
  if (empresaRow.batch_size_min !== undefined && empresaRow.batch_size_min !== null) {
    options.BatchSizeMim = empresaRow.batch_size_min;
  }
  
  if (empresaRow.batch_size_max !== undefined && empresaRow.batch_size_max !== null) {
    options.BatchSizeMax = empresaRow.batch_size_max;
  }
  
  if (empresaRow.url_api !== undefined && empresaRow.url_api !== null) {
    options.urlAPI = empresaRow.url_api;
  }
  
  if (empresaRow.apikey !== undefined && empresaRow.apikey !== null) {
    options.apikey = empresaRow.apikey;
  }
  
  if (empresaRow.webhook_disparo !== undefined && empresaRow.webhook_disparo !== null) {
    options.webhook_disparo = empresaRow.webhook_disparo;
  }
  
  if (empresaRow.webhook_contatos !== undefined && empresaRow.webhook_contatos !== null) {
    options.webhook_contatos = empresaRow.webhook_contatos;
  }
  
  if (empresaRow.webhook_get_images !== undefined && empresaRow.webhook_get_images !== null) {
    options.webhook_get_images = empresaRow.webhook_get_images;
  }
  
  if (empresaRow.webhook_up_docs !== undefined && empresaRow.webhook_up_docs !== null) {
    options.webhook_up_docs = empresaRow.webhook_up_docs;
  }
  
  if (empresaRow.ftp_url !== undefined && empresaRow.ftp_url !== null) {
    options.ftp_url = empresaRow.ftp_url;
  }
  
  if (empresaRow.ftp_user !== undefined && empresaRow.ftp_user !== null) {
    options.ftp_user = empresaRow.ftp_user;
  }
  
  if (empresaRow.ftp_port !== undefined && empresaRow.ftp_port !== null) {
    options.ftp_port = empresaRow.ftp_port;
  }
  
  if (empresaRow.ftp_password !== undefined && empresaRow.ftp_password !== null) {
    options.ftp_password = empresaRow.ftp_password;
  }
  
  if (empresaRow.numero_de_contatos !== undefined && empresaRow.numero_de_contatos !== null) {
    options.numero_de_contatos = empresaRow.numero_de_contatos;
  }
  
  return options;
}

/**
 * Converte o objeto DisparoOptions para um formato adequado para atualização no banco de dados horizontal
 */
export function convertDisparoOptionsToUpdates(options: DisparoOptions): Record<string, any> {
  // No novo formato, atualizamos diretamente as colunas na única linha
  const updates: Record<string, any> = {};
  
  // Mapeia as propriedades do objeto para as colunas do banco
  updates.instancia = options.instancia;
  updates.ativo = options.Ativo;
  updates.horario_limite = options.horario_limite;
  updates.long_wait_min = options.long_wait_min;
  updates.long_wait_max = options.long_wait_max;
  updates.shor_wait_min = options.ShortWaitMin;
  updates.short_wait_max = options.ShortWaitMax;
  updates.batch_size_min = options.BatchSizeMim;
  updates.batch_size_max = options.BatchSizeMax;
  updates.url_api = options.urlAPI;
  updates.apikey = options.apikey;
  updates.webhook_disparo = options.webhook_disparo;
  updates.webhook_contatos = options.webhook_contatos;
  updates.webhook_get_images = options.webhook_get_images;
  updates.webhook_up_docs = options.webhook_up_docs;
  updates.ftp_url = options.ftp_url;
  updates.ftp_user = options.ftp_user;
  updates.ftp_port = options.ftp_port;
  updates.ftp_password = options.ftp_password;
  updates.numero_de_contatos = options.numero_de_contatos;
  
  return updates;
}
