
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

// Mock function to list files (in a real app, this would use a serverless function to communicate with the FTP server)
export const listFiles = async (type: 'image' | 'video' | 'document'): Promise<MediaFile[]> => {
  try {
    const ftpConfig = await fetchFtpConfig();
    
    if (!ftpConfig) {
      toast.error("Configurações FTP não encontradas. Configure o FTP nas configurações do sistema.");
      return [];
    }
    
    // In a real implementation, this would call an edge function to list files from FTP
    // For this example, we'll mock the response based on file type
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
  } catch (error) {
    console.error('Error listing files:', error);
    toast.error("Erro ao listar arquivos do FTP.");
    return [];
  }
};

// Mock function to upload a file (in a real app, this would use a serverless function)
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
