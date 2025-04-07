import { supabase } from '@/lib/supabase';
import { FtpConfig } from './types';

// Busca configurações FTP do AppW_Options no formato horizontal
export const fetchFtpConfig = async (): Promise<FtpConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('ftp_url, ftp_user, ftp_password, ftp_port')
      .limit(1);
    
    if (error) {
      throw new Error(`Error fetching FTP config: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    const ftpConfigRow = data[0];
    
    // Verifica se os campos essenciais existem
    if (!ftpConfigRow.ftp_url || !ftpConfigRow.ftp_user || !ftpConfigRow.ftp_password) {
      return null;
    }
    
    return {
      host: ftpConfigRow.ftp_url,
      user: ftpConfigRow.ftp_user,
      password: ftpConfigRow.ftp_password,
      port: ftpConfigRow.ftp_port || 21
    };
  } catch (error) {
    console.error('Error fetching FTP config:', error);
    return null;
  }
};

// URL padrão caso não seja encontrada no banco de dados
export const DEFAULT_MEDIA_WEBHOOK_URL = "https://dinastia-n8n-webhook.ssdx0m.easypanel.host/webhook/getdocs";
export const DEFAULT_UPLOAD_WEBHOOK_URL = "https://dinastia-n8n-webhook.ssdx0m.easypanel.host/webhook/updocs";

// Busca webhook URL para obter arquivos de mídia do banco de dados
export const fetchMediaWebhookUrl = async (): Promise<string> => {
  try {
    console.log('[config] Buscando webhook_get_images do banco de dados...');
    
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('webhook_get_images')
      .limit(1);
    
    if (error) {
      console.error('[config] Erro ao buscar webhook_get_images:', error);
      console.log('[config] Usando URL padrão:', DEFAULT_MEDIA_WEBHOOK_URL);
      return DEFAULT_MEDIA_WEBHOOK_URL;
    }
    
    if (!data || data.length === 0 || !data[0].webhook_get_images) {
      console.log('[config] webhook_get_images não encontrado no banco de dados. Usando URL padrão:', DEFAULT_MEDIA_WEBHOOK_URL);
      return DEFAULT_MEDIA_WEBHOOK_URL;
    }
    
    console.log('[config] webhook_get_images encontrado:', data[0].webhook_get_images);
    return data[0].webhook_get_images;
  } catch (error) {
    console.error('[config] Erro ao buscar webhook_get_images:', error);
    console.log('[config] Usando URL padrão:', DEFAULT_MEDIA_WEBHOOK_URL);
    return DEFAULT_MEDIA_WEBHOOK_URL;
  }
};

// Busca webhook URL para upload de arquivos de mídia do banco de dados
export const fetchUploadWebhookUrl = async (): Promise<string> => {
  try {
    console.log('[config] Buscando webhook_up_docs do banco de dados...');
    
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('webhook_up_docs')
      .limit(1);
    
    if (error) {
      console.error('[config] Erro ao buscar webhook_up_docs:', error);
      console.log('[config] Usando URL padrão para upload:', DEFAULT_UPLOAD_WEBHOOK_URL);
      return DEFAULT_UPLOAD_WEBHOOK_URL;
    }
    
    if (!data || data.length === 0 || !data[0].webhook_up_docs) {
      console.log('[config] webhook_up_docs não encontrado no banco de dados. Usando URL padrão:', DEFAULT_UPLOAD_WEBHOOK_URL);
      return DEFAULT_UPLOAD_WEBHOOK_URL;
    }
    
    console.log('[config] webhook_up_docs encontrado:', data[0].webhook_up_docs);
    return data[0].webhook_up_docs;
  } catch (error) {
    console.error('[config] Erro ao buscar webhook_up_docs:', error);
    console.log('[config] Usando URL padrão para upload:', DEFAULT_UPLOAD_WEBHOOK_URL);
    return DEFAULT_UPLOAD_WEBHOOK_URL;
  }
};

// Função para obter o URL do webhook para ser usado imediatamente
// Não exportamos esta variável diretamente, pois seu valor deve ser obtido de forma assíncrona
let _mediaWebhookUrl: string | null = null;
let _uploadWebhookUrl: string | null = null;

// Inicializa o URL do webhook
export const initMediaWebhookUrl = async (): Promise<string> => {
  if (!_mediaWebhookUrl) {
    _mediaWebhookUrl = await fetchMediaWebhookUrl();
  }
  return _mediaWebhookUrl;
};

// Inicializa o URL do webhook de upload
export const initUploadWebhookUrl = async (): Promise<string> => {
  if (!_uploadWebhookUrl) {
    _uploadWebhookUrl = await fetchUploadWebhookUrl();
  }
  return _uploadWebhookUrl;
};

// Obtém o URL atual (se já inicializado) ou usa o padrão
export const getMediaWebhookUrl = (): string => {
  return _mediaWebhookUrl || DEFAULT_MEDIA_WEBHOOK_URL;
};

// Obtém o URL de upload atual (se já inicializado) ou usa o padrão
export const getUploadWebhookUrl = (): string => {
  return _uploadWebhookUrl || DEFAULT_UPLOAD_WEBHOOK_URL;
};
