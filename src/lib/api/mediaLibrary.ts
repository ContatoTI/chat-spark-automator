
// This file is a barrel export for media-related APIs
import { MediaFile, FtpConfig } from './media/types';
import { 
  fetchFtpConfig, 
  fetchMediaWebhookUrl,
  fetchUploadWebhookUrl,
  initMediaWebhookUrl,
  initUploadWebhookUrl,
  getMediaWebhookUrl,
  getUploadWebhookUrl,
  DEFAULT_MEDIA_WEBHOOK_URL,
  DEFAULT_UPLOAD_WEBHOOK_URL
} from './media/config';
import { listFiles, uploadFile } from './media/api';

// Inicializar o webhook URL assim que possível
initMediaWebhookUrl().catch(err => {
  console.error('[mediaLibrary] Erro ao inicializar webhook URL:', err);
});

initUploadWebhookUrl().catch(err => {
  console.error('[mediaLibrary] Erro ao inicializar upload webhook URL:', err);
});

export { 
  listFiles, 
  uploadFile, 
  fetchFtpConfig, 
  fetchMediaWebhookUrl,
  fetchUploadWebhookUrl,
  getMediaWebhookUrl,
  getUploadWebhookUrl,
  initMediaWebhookUrl,
  initUploadWebhookUrl,
  DEFAULT_MEDIA_WEBHOOK_URL,
  DEFAULT_UPLOAD_WEBHOOK_URL
};

export type { MediaFile, FtpConfig };
