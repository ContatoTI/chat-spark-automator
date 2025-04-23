
export interface WhatsAppStatusResponse {
  success: boolean;
  message?: string;
  data?: {
    name: string;
    connectionStatus: string;
  }[];
}

export interface WhatsAppQRCodeResponse {
  success: boolean;
  message?: string;
  data?: {
    base64?: string;
    qrcode?: string;
  };
}

export interface WhatsAPIResponse {
  success: boolean;
  message?: string;
  data?: Array<{
    data?: {
      base64?: string;
    };
  }>;
}

export interface WhatsAccount {
  id: string; // Changed from number to string to match how it's used
  empresa_id: string;
  nome_instancia: string;
  webhook_inst?: string;
  status?: string;
  name?: string; // Adding name property
  phone?: string; // Adding phone property
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  createdAt: string;
}
