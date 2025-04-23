
/**
 * Campaign data interface
 */
export interface Campaign {
  id?: number;
  nome: string;
  data: string | null;
  mensagem01: string;
  mensagem02: string | null;
  mensagem03: string | null;
  mensagem04: string | null;
  tipo_midia: string | null;
  url_midia: string | null;
  data_disparo: string | null;
  status: string;
  contacts?: number; // For UI purposes
  delivered?: number; // For UI purposes
  
  // Campos movidos de AppW_Options para AppW_Campanhas
  producao: boolean;
  limite_disparos: number;
  enviados: number;
  
  // Campo para vincular campanha à empresa
  empresa_id: string;
  
  // Campo para vincular a instância WhatsApp selecionada
  selected_instance: string | null;
}
