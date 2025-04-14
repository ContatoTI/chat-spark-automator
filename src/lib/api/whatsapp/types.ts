
export interface WhatsAccount {
  id: number;
  nome_instancia: string;
  empresa_id: string;
  status?: string;
}

export interface WhatsAppInstanceResponse {
  name: string;
  connectionStatus: 'connecting' | 'close' | 'open';
}

export interface WhatsAppStatusResponse {
  success: boolean;
  data?: WhatsAppInstanceResponse[];
  message?: string;
}

export interface WhatsAppQRCodeResponse {
  success: boolean;
  data?: {
    qrcode?: string;
    base64?: string;
  };
  message?: string;
}
