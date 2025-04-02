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

// Função para obter o URL do webhook para ser usado imediatamente
// Não exportamos esta variável diretamente, pois seu valor deve ser obtido de forma assíncrona
let MEDIA_WEBHOOK_URL: string | null = null;

// Inicializa o URL do webhook
export const initMediaWebhookUrl = async (): Promise<string> => {
  if (!MEDIA_WEBHOOK_URL) {
    MEDIA_WEBHOOK_URL = await fetchMediaWebhookUrl();
  }
  return MEDIA_WEBHOOK_URL;
};

// Obtém o URL atual (se já inicializado) ou usa o padrão
export const getMediaWebhookUrl = (): string => {
  return MEDIA_WEBHOOK_URL || DEFAULT_MEDIA_WEBHOOK_URL;
};
