
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

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

// Fetch FTP config from AppW_Options
export const fetchFtpConfig = async (): Promise<FtpConfig | null> => {
  try {
    const { data: options, error } = await supabase
      .from('AppW_Options')
      .select('*')
      .in('option', ['ftp_url', 'ftp_user', 'ftp_password', 'ftp_port']);
    
    if (error) {
      throw new Error(`Error fetching FTP config: ${error.message}`);
    }
    
    if (!options || options.length === 0) {
      return null;
    }
    
    const ftpConfig: Partial<FtpConfig> = {};
    
    options.forEach(option => {
      if (option.option === 'ftp_url' && option.text) {
        ftpConfig.host = option.text;
      } else if (option.option === 'ftp_user' && option.text) {
        ftpConfig.user = option.text;
      } else if (option.option === 'ftp_password' && option.text) {
        ftpConfig.password = option.text;
      } else if (option.option === 'ftp_port' && option.numeric) {
        ftpConfig.port = option.numeric;
      }
    });
    
    if (!ftpConfig.host || !ftpConfig.user || !ftpConfig.password) {
      return null;
    }
    
    return {
      host: ftpConfig.host,
      user: ftpConfig.user,
      password: ftpConfig.password,
      port: ftpConfig.port || 21
    };
  } catch (error) {
    console.error('Error fetching FTP config:', error);
    return null;
  }
};

// Fetch webhook URL for getting media files
export const fetchMediaWebhookUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*')
      .eq('option', 'webhook_get_images')
      .single();
    
    if (error || !data || !data.text) {
      console.error('Error fetching webhook URL:', error);
      return null;
    }
    
    return data.text;
  } catch (error) {
    console.error('Error fetching webhook URL:', error);
    return null;
  }
};

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
      console.log(`Calling webhook at: ${webhookUrl}?type=${type}`);
      
      // Adicionar o tipo de arquivo como parâmetro da URL
      const url = new URL(webhookUrl);
      url.searchParams.append('type', type);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`Webhook error: ${response.status} ${response.statusText}`);
        throw new Error(`Erro ao buscar arquivos: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Webhook response:", data);
      
      if (!Array.isArray(data)) {
        toast.error("Formato de resposta inválido do webhook");
        console.error("Invalid webhook response format:", data);
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
      console.error('Error calling webhook:', error);
      
      // Se houver erro na chamada do webhook, usar o código mockado como fallback
      console.warn('Fallback to mock data due to webhook error');
      return getMockFiles(type, ftpConfig);
    }
  } catch (error) {
    console.error('Error listing files:', error);
    toast.error("Erro ao listar arquivos.");
    return [];
  }
};

// Mock function as fallback when webhook fails
const getMockFiles = (type: 'image' | 'video' | 'document', ftpConfig: FtpConfig): MediaFile[] => {
  // Simulating API delay
  // await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock data based on file type
  const folderPath = type === 'image' ? 'imagens/' : 
                    type === 'video' ? 'videos/' : 
                    'documentos/';
  
  const fileExtensions = type === 'image' ? ['jpg', 'png', 'jpeg'] :
                        type === 'video' ? ['mp4', 'mov', 'avi'] :
                        ['pdf', 'doc', 'docx', 'xlsx', 'txt'];
  
  const mockFiles: MediaFile[] = [];
  const count = Math.floor(Math.random() * 5) + 3; // 3-7 files
  
  for (let i = 1; i <= count; i++) {
    const ext = fileExtensions[Math.floor(Math.random() * fileExtensions.length)];
    const fileName = `arquivo_${i}.${ext}`;
    
    mockFiles.push({
      name: fileName,
      path: `${folderPath}${fileName}`,
      url: `https://${ftpConfig.host}/${folderPath}${fileName}`,
      type,
      size: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(), // Random date in the past
      thumbnailUrl: type === 'image' 
        ? `https://${ftpConfig.host}/${folderPath}${fileName}` 
        : undefined
    });
  }
  
  return mockFiles;
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
