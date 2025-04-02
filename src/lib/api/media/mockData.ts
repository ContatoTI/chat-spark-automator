
import { MediaFile, FtpConfig } from './types';

// Mock function as fallback when webhook fails
export const getMockFiles = (type: 'image' | 'video' | 'document', ftpConfig: FtpConfig): MediaFile[] => {
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
