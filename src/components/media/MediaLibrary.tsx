import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, File, Upload, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MediaGrid } from "./MediaGrid";
import { 
  MediaFile, 
  listFiles, 
  uploadFile, 
  getMediaWebhookUrl,
  initMediaWebhookUrl 
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
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>(getMediaWebhookUrl());
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initWebhook = async () => {
      try {
        const url = await initMediaWebhookUrl();
        console.log(`[MediaLibrary] Webhook URL inicializado: ${url}`);
        setWebhookUrl(url);
      } catch (err) {
        console.error('[MediaLibrary] Erro ao inicializar webhook URL:', err);
      }
    };
    
    initWebhook();
  }, []);
  
  useEffect(() => {
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
    
    loadFiles();
  }, [activeTab, webhookUrl]);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (activeTab === 'image' && !file.type.startsWith('image/')) {
      toast.error("O arquivo selecionado não é uma imagem.");
      return;
    } else if (activeTab === 'video' && !file.type.startsWith('video/')) {
      toast.error("O arquivo selecionado não é um vídeo.");
      return;
    } else if (activeTab === 'document' && 
        !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain'].includes(file.type)) {
      toast.error("O arquivo selecionado não é um documento válido.");
      return;
    }
    
    setIsUploading(true);
    try {
      uploadFile(file, activeTab).then(uploadedFile => {
        if (uploadedFile) {
          setFiles(prev => [uploadedFile, ...prev]);
          toast.success("Arquivo enviado com sucesso!");
        }
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }).catch(err => {
        console.error('[MediaLibrary] Erro no upload:', err);
        toast.error("Erro ao fazer upload do arquivo.");
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
    } catch (err) {
      console.error('[MediaLibrary] Erro no upload:', err);
      toast.error("Erro ao fazer upload do arquivo.");
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRetryLoad = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log(`[MediaLibrary] Recarregando arquivos do tipo '${activeTab}'...`);
    
    try {
      const mediaFiles = await listFiles(activeTab);
      console.log(`[MediaLibrary] Recarregados ${mediaFiles.length} arquivos do tipo '${activeTab}'`);
      setFiles(mediaFiles);
      toast.success("Arquivos atualizados com sucesso!");
    } catch (err) {
      console.error('[MediaLibrary] Erro ao recarregar arquivos:', err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar arquivos";
      setError(errorMessage);
      toast.error("Erro ao recarregar arquivos da biblioteca de mídia.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredFiles = searchTerm 
    ? files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : files;
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => setActiveTab(v as 'image' | 'video' | 'document')}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <TabsList>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Imagens
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              Documentos
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => handleRetryLoad()} 
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              Recarregar
            </Button>
            
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
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              size="sm" 
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Fazer Upload
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="my-4">
          <Input 
            placeholder="Buscar arquivos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <div className="mt-2 text-xs">
                <strong>Detalhes técnicos:</strong> Falha na comunicação com o servidor.
                <br />
                URL: {webhookUrl}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
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
      
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose} className="mr-2">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
