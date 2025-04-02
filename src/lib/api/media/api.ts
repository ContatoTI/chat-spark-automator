
import { toast } from "sonner";
import { MediaFile, FtpConfig } from './types';
import { fetchFtpConfig, getMediaWebhookUrl } from './config';

// List files using webhook
export const listFiles = async (type: 'image' | 'video' | 'document'): Promise<MediaFile[]> => {
  console.log(`[MediaAPI] Iniciando listFiles para tipo: ${type}`);
  
  try {
    // Obtenha o URL do webhook
    const webhookUrl = getMediaWebhookUrl();
    
    // Map the type to the expected category parameter
    const categoryMap = {
      'image': 'imagens',
      'video': 'videos',
      'document': 'documentos'
    };
    
    const category = categoryMap[type];
    
    // Construindo a URL base do webhook (sem parâmetros de consulta)
    const url = webhookUrl;
    
    console.log(`[MediaAPI] Chamando webhook em: ${url} com categoria: ${category}`);
    
    try {
      console.log('[MediaAPI] Iniciando fetch para o webhook...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ category }),
        mode: 'cors',
      });
      
      console.log(`[MediaAPI] Resposta recebida: status=${response.status}, ok=${response.ok}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[MediaAPI] Erro no webhook: status=${response.status}, texto=${errorText}`);
        throw new Error(`Erro ao buscar arquivos: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[MediaAPI] Dados recebidos do webhook:`, data);
      
      if (!Array.isArray(data)) {
        console.error("[MediaAPI] Formato de resposta inválido:", data);
        toast.error("Formato de resposta inválido do webhook");
        return [];
      }
      
      // Mapear a resposta do webhook para o formato MediaFile
      const mediaFiles = data.map((item) => ({
        name: item.name || 'Arquivo sem nome',
        path: item.path || '',
        url: item.url || '',
        type,
        size: item.size || 0,
        createdAt: item.createdAt || new Date().toISOString(),
        thumbnailUrl: type === 'image' ? item.url : undefined,
      }));
      
      console.log(`[MediaAPI] Arquivos processados: ${mediaFiles.length}`);
      return mediaFiles;
      
    } catch (error) {
      console.error('[MediaAPI] Erro ao chamar webhook:', error);
      
      // Tentar determinar se é um erro de CORS
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('CORS') || errorMessage.includes('fetch')) {
        console.error('[MediaAPI] Possível erro de CORS ou problema de rede:', errorMessage);
        toast.error("Erro de conexão. Verifique se o servidor está acessível.");
      } else {
        toast.error("Erro ao buscar arquivos do servidor. Por favor, tente novamente mais tarde.");
      }
      
      return [];
    }
  } catch (error) {
    console.error('[MediaAPI] Erro ao listar arquivos:', error);
    toast.error("Erro ao listar arquivos.");
    return [];
  }
};

// Upload file function
export const uploadFile = async (
  file: File, 
  type: 'image' | 'video' | 'document'
): Promise<MediaFile | null> => {
  try {
    const ftpConfig = await fetchFtpConfig();
    
    if (!ftpConfig) {
      toast.error("Configurações FTP não encontradas. Configure o FTP nas configurações do sistema.");
      return null;
    }
    
    // Simulating upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call an edge function to upload files to FTP
    const folderPath = type === 'image' ? 'imagens/' : 
                     type === 'video' ? 'videos/' : 
                     'documentos/';
    
    // Mock successful upload
    return {
      name: file.name,
      path: `${folderPath}${file.name}`,
      url: `https://${ftpConfig.host}/${folderPath}${file.name}`,
      type,
      size: file.size,
      createdAt: new Date().toISOString(),
      thumbnailUrl: type === 'image' ? `https://${ftpConfig.host}/${folderPath}${file.name}` : undefined
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error("Erro ao fazer upload do arquivo para o FTP.");
    return null;
  }
};
