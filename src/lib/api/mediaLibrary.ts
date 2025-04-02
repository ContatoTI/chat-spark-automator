
// This file is a barrel export for media-related APIs
import { MediaFile, FtpConfig } from './media/types';
import { fetchFtpConfig, fetchMediaWebhookUrl } from './media/config';
import { listFiles, uploadFile } from './media/api';

export { 
  listFiles, 
  uploadFile, 
  fetchFtpConfig, 
  fetchMediaWebhookUrl 
};

export type { MediaFile, FtpConfig };
