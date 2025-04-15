
export interface WhatsAccount {
  id: number;
  nome_instancia: string;
  empresa_id: string;
  status?: string;
}

export interface WhatsAppStatusResponse {
  name: string;
  connectionStatus: 'connecting' | 'close' | 'open';
}
