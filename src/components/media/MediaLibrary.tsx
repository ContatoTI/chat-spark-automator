
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MediaGrid } from "./MediaGrid";
import { MediaLibraryHeader } from "./MediaLibraryHeader";
import { MediaLibraryError } from "./MediaLibraryError";
import { MediaLibraryFooter } from "./MediaLibraryFooter";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useMediaWebhook } from "@/hooks/useMediaWebhook";
import { 
  MediaFile, 
  listFiles
} from "@/lib/api/mediaLibrary";
import { toast } from "sonner";

interface MediaLibraryProps {
  onSelect: (mediaFile: MediaFile) => void;
  onClose: () => void;
  currentType: 'image' | 'video' | 'document';
}

export function MediaLibrary({ onSelect, onClose, currentType }: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'document'>(currentType);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const webhookUrl = useMediaWebhook();
  
  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log(`[MediaLibrary] Carregando arquivos do tipo '${activeTab}'...`);
    console.log(`[MediaLibrary] Usando webhook URL: ${webhookUrl}`);
    
    try {
      const startTime = performance.now();
      console.log(`[MediaLibrary] Iniciando chamada para listFiles() - ${new Date().toISOString()}`);
      
      const mediaFiles = await listFiles(activeTab);
      
      const endTime = performance.now();
      console.log(`[MediaLibrary] Chamada finalizada em ${Math.round(endTime - startTime)}ms - ${new Date().toISOString()}`);
      console.log(`[MediaLibrary] Carregados ${mediaFiles.length} arquivos do tipo '${activeTab}'`);
      
      setFiles(mediaFiles);
    } catch (err) {
      console.error('[MediaLibrary] Erro ao carregar arquivos:', err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar arquivos";
      setError(errorMessage);
      toast.error("Erro ao carregar arquivos da biblioteca de mídia.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadFiles();
  }, [activeTab, webhookUrl]);
  
  const { 
    isUploading, 
    fileInputRef, 
    handleFileUpload, 
    triggerFileInput 
  } = useMediaUpload(activeTab, loadFiles);
  
  const filteredFiles = searchTerm 
    ? files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : files;
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => setActiveTab(v as 'image' | 'video' | 'document')}>
        <MediaLibraryHeader 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleRetryLoad={loadFiles}
          isLoading={isLoading}
          handleUploadClick={triggerFileInput}
          isUploading={isUploading}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept={
            activeTab === 'image' ? 'image/*' : 
            activeTab === 'video' ? 'video/*' : 
            '.pdf,.doc,.docx,.xls,.xlsx,.txt'
          }
        />
        
        <MediaLibraryError error={error} webhookUrl={webhookUrl} />
        
        <TabsContent value="image" className="mt-0">
          <MediaGrid 
            files={filteredFiles} 
            isLoading={isLoading} 
            onSelect={onSelect}
            type="image"
          />
        </TabsContent>
        
        <TabsContent value="video" className="mt-0">
          <MediaGrid 
            files={filteredFiles} 
            isLoading={isLoading} 
            onSelect={onSelect}
            type="video"
          />
        </TabsContent>
        
        <TabsContent value="document" className="mt-0">
          <MediaGrid 
            files={filteredFiles} 
            isLoading={isLoading} 
            onSelect={onSelect}
            type="document"
          />
        </TabsContent>
      </Tabs>
      
      <MediaLibraryFooter onClose={onClose} />
    </div>
  );
}
