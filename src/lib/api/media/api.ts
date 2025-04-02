
import { toast } from "sonner";
import { MediaFile, FtpConfig } from './types';
import { fetchFtpConfig, getMediaWebhookUrl, getUploadWebhookUrl } from './config';

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
    
    console.log(`[MediaAPI] Chamando webhook em: ${webhookUrl} com categoria: ${category}`);
    
    try {
      console.log('[MediaAPI] Iniciando fetch para o webhook...');
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
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

// Upload file function - Implementação real usando o webhook configurado
export const uploadFile = async (
  file: File, 
  type: 'image' | 'video' | 'document'
): Promise<MediaFile | null> => {
  try {
    // Obtenha o URL do webhook de upload
    const uploadWebhookUrl = getUploadWebhookUrl();
    console.log(`[MediaAPI] Iniciando upload para ${uploadWebhookUrl}`);
    
    // Map the type to the expected category parameter
    const categoryMap = {
      'image': 'imagens',
      'video': 'videos',
      'document': 'documentos'
    };
    
    const category = categoryMap[type];
    
    // Criar o FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('filename', file.name);
    
    // Exibir toast de carregamento
    toast.loading(`Enviando ${file.name}...`);
    
    // Enviar o arquivo para o webhook
    const response = await fetch(uploadWebhookUrl, {
      method: 'POST',
      body: formData,
    });
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MediaAPI] Erro ao fazer upload: ${response.status}, ${errorText}`);
      toast.dismiss();
      toast.error(`Erro ao enviar arquivo: ${response.statusText}`);
      return null;
    }
    
    // Processar a resposta
    const result = await response.json();
    toast.dismiss();
    
    if (!result || !result.url) {
      console.error('[MediaAPI] Resposta de upload inválida:', result);
      toast.error("Resposta de upload inválida do servidor");
      return null;
    }
    
    toast.success(`Arquivo ${file.name} enviado com sucesso!`);
    
    // Retornar o arquivo enviado
    return {
      name: file.name,
      path: result.path || `${category}/${file.name}`,
      url: result.url,
      type,
      size: file.size,
      createdAt: new Date().toISOString(),
      thumbnailUrl: type === 'image' ? result.url : undefined
    };
  } catch (error) {
    console.error('[MediaAPI] Erro ao fazer upload:', error);
    toast.dismiss();
    toast.error("Erro ao fazer upload do arquivo.");
    return null;
  }
};
