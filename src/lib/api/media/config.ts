
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

// WebhookURL constante para garantir que sempre usamos a URL correta
export const MEDIA_WEBHOOK_URL = "https://dinastia-n8n-editor.ssdx0m.easypanel.host/webhook-test/getdocs";

// Fetch webhook URL for getting media files - agora sempre retorna a URL fixa
export const fetchMediaWebhookUrl = async (): Promise<string> => {
  console.log('Usando webhook URL fixa:', MEDIA_WEBHOOK_URL);
  return MEDIA_WEBHOOK_URL;
};
