
import { supabase } from '@/lib/supabase';
import { FtpConfig } from './types';

// Fetch FTP config from AppW_Options
export const fetchFtpConfig = async (): Promise<FtpConfig | null> => {
  try {
    const { data: options, error } = await supabase
      .from('AppW_Options')
      .select('*')
      .in('option', ['ftp_url', 'ftp_user', 'ftp_password', 'ftp_port']);
    
    if (error) {
      throw new Error(`Error fetching FTP config: ${error.message}`);
    }
    
    if (!options || options.length === 0) {
      return null;
    }
    
    const ftpConfig: Partial<FtpConfig> = {};
    
    options.forEach(option => {
      if (option.option === 'ftp_url' && option.text) {
        ftpConfig.host = option.text;
      } else if (option.option === 'ftp_user' && option.text) {
        ftpConfig.user = option.text;
      } else if (option.option === 'ftp_password' && option.text) {
        ftpConfig.password = option.text;
      } else if (option.option === 'ftp_port' && option.numeric) {
        ftpConfig.port = option.numeric;
      }
    });
    
    if (!ftpConfig.host || !ftpConfig.user || !ftpConfig.password) {
      return null;
    }
    
    return {
      host: ftpConfig.host,
      user: ftpConfig.user,
      password: ftpConfig.password,
      port: ftpConfig.port || 21
    };
  } catch (error) {
    console.error('Error fetching FTP config:', error);
    return null;
  }
};

// URL padrão caso não seja encontrada no banco de dados
export const DEFAULT_MEDIA_WEBHOOK_URL = "https://dinastia-n8n-webhook.ssdx0m.easypanel.host/webhook/getdocs";
export const DEFAULT_UPLOAD_WEBHOOK_URL = "https://dinastia-n8n-webhook.ssdx0m.easypanel.host/webhook/updocs";

// Fetch webhook URL for getting media files from the database
export const fetchMediaWebhookUrl = async (): Promise<string> => {
  try {
    console.log('[config] Buscando webhook_get_images do banco de dados...');
    
    const { data: webhookOption, error } = await supabase
      .from('AppW_Options')
      .select('text')
      .eq('option', 'webhook_get_images')
      .single();
    
    if (error) {
      console.error('[config] Erro ao buscar webhook_get_images:', error);
      console.log('[config] Usando URL padrão:', DEFAULT_MEDIA_WEBHOOK_URL);
      return DEFAULT_MEDIA_WEBHOOK_URL;
    }
    
    if (!webhookOption || !webhookOption.text) {
      console.log('[config] webhook_get_images não encontrado no banco de dados. Usando URL padrão:', DEFAULT_MEDIA_WEBHOOK_URL);
      return DEFAULT_MEDIA_WEBHOOK_URL;
    }
    
    console.log('[config] webhook_get_images encontrado:', webhookOption.text);
    return webhookOption.text;
  } catch (error) {
    console.error('[config] Erro ao buscar webhook_get_images:', error);
    console.log('[config] Usando URL padrão:', DEFAULT_MEDIA_WEBHOOK_URL);
    return DEFAULT_MEDIA_WEBHOOK_URL;
  }
};

// Fetch webhook URL for uploading media files from the database
export const fetchUploadWebhookUrl = async (): Promise<string> => {
  try {
    console.log('[config] Buscando webhook_up_docs do banco de dados...');
    
    const { data: webhookOption, error } = await supabase
      .from('AppW_Options')
      .select('text')
      .eq('option', 'webhook_up_docs')
      .single();
    
    if (error) {
      console.error('[config] Erro ao buscar webhook_up_docs:', error);
      console.log('[config] Usando URL padrão para upload:', DEFAULT_UPLOAD_WEBHOOK_URL);
      return DEFAULT_UPLOAD_WEBHOOK_URL;
    }
    
    if (!webhookOption || !webhookOption.text) {
      console.log('[config] webhook_up_docs não encontrado no banco de dados. Usando URL padrão:', DEFAULT_UPLOAD_WEBHOOK_URL);
      return DEFAULT_UPLOAD_WEBHOOK_URL;
    }
    
    console.log('[config] webhook_up_docs encontrado:', webhookOption.text);
    return webhookOption.text;
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
