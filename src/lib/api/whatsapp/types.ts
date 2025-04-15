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
  data?: {
    base64?: string;
    qrcode?: string;
    pairingCode?: string | null;
    code?: string;
  };
}

export interface WhatsAccount {
  id: number;
  empresa_id: string;
  nome_instancia: string;
  webhook_inst?: string;
  status?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  createdAt: string;
}
