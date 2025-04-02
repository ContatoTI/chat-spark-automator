
// This file is a barrel export for media-related APIs
import { MediaFile, FtpConfig } from './media/types';
import { 
  fetchFtpConfig, 
  fetchMediaWebhookUrl, 
  initMediaWebhookUrl,
  getMediaWebhookUrl,
  DEFAULT_MEDIA_WEBHOOK_URL 
} from './media/config';
import { listFiles, uploadFile } from './media/api';

// Inicializar o webhook URL assim que possível
initMediaWebhookUrl().catch(err => {
  console.error('[mediaLibrary] Erro ao inicializar webhook URL:', err);
});

export { 
  listFiles, 
  uploadFile, 
  fetchFtpConfig, 
  fetchMediaWebhookUrl,
  getMediaWebhookUrl,
  initMediaWebhookUrl,
  DEFAULT_MEDIA_WEBHOOK_URL
};

export type { MediaFile, FtpConfig };
