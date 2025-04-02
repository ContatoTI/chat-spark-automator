
// This file is a barrel export for media-related APIs
import { MediaFile, FtpConfig } from './media/types';
import { fetchFtpConfig, fetchMediaWebhookUrl, MEDIA_WEBHOOK_URL } from './media/config';
import { listFiles, uploadFile } from './media/api';

export { 
  listFiles, 
  uploadFile, 
  fetchFtpConfig, 
  fetchMediaWebhookUrl,
  MEDIA_WEBHOOK_URL
};

export type { MediaFile, FtpConfig };
