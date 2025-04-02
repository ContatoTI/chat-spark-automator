
import { toast } from "sonner";
import { MediaFile, FtpConfig } from './types';
import { fetchFtpConfig, fetchMediaWebhookUrl } from './config';

// List files using webhook
export const listFiles = async (type: 'image' | 'video' | 'document'): Promise<MediaFile[]> => {
  try {
    const webhookUrl = await fetchMediaWebhookUrl();
    
    if (!webhookUrl) {
      toast.error("URL do webhook não encontrada. Configure o webhook nas configurações do sistema.");
      return [];
    }
    
    const ftpConfig = await fetchFtpConfig();
    
    if (!ftpConfig) {
      toast.error("Configurações FTP não encontradas. Configure o FTP nas configurações do sistema.");
      return [];
    }
    
    try {
      // Construindo a URL do webhook com o parâmetro de tipo
      const url = new URL(webhookUrl);
      url.searchParams.append('type', type);
      
      console.log(`Chamando webhook em: ${url.toString()}`);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`Erro no webhook: ${response.status} ${response.statusText}`);
        throw new Error(`Erro ao buscar arquivos: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Resposta do webhook:", data);
      
      if (!Array.isArray(data)) {
        toast.error("Formato de resposta inválido do webhook");
        console.error("Formato de resposta inválido:", data);
        return [];
      }
      
      // Converter a resposta do webhook para o formato MediaFile
      return data.map((item) => ({
        name: item.name || 'Arquivo sem nome',
        path: item.path || '',
        url: item.url || '',
        type,
        size: item.size || 0,
        createdAt: item.createdAt || new Date().toISOString(),
        thumbnailUrl: type === 'image' ? item.url : undefined,
      }));
    } catch (error) {
      console.error('Erro ao chamar webhook:', error);
      toast.error("Erro ao buscar arquivos do servidor. Por favor, tente novamente mais tarde.");
      
      // Não vamos mais usar dados mockados como fallback
      return [];
    }
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    toast.error("Erro ao listar arquivos.");
    return [];
  }
};

// Upload file function (in a real app, this would use a serverless function)
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
