
export interface MediaFile {
  name: string;
  path: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size?: number;
  createdAt?: string;
  thumbnailUrl?: string;
}

export interface FtpConfig {
  host: string;
  user: string;
  password: string;
  port: number;
}
