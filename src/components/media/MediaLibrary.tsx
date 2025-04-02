
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, File, Upload, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MediaGrid } from "./MediaGrid";
import { MediaFile, listFiles, uploadFile } from "@/lib/api/mediaLibrary";
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
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Load files for the active tab
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Carregando arquivos do tipo '${activeTab}'...`);
        const mediaFiles = await listFiles(activeTab);
        console.log(`Carregados ${mediaFiles.length} arquivos do tipo '${activeTab}'`);
        setFiles(mediaFiles);
      } catch (err) {
        console.error('Erro ao carregar arquivos:', err);
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar arquivos";
        setError(errorMessage);
        toast.error("Erro ao carregar arquivos da biblioteca de mídia.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFiles();
  }, [activeTab]);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
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
      const uploadedFile = await uploadFile(file, activeTab);
      if (uploadedFile) {
        setFiles(prev => [uploadedFile, ...prev]);
        toast.success("Arquivo enviado com sucesso!");
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      toast.error("Erro ao fazer upload do arquivo.");
    } finally {
      setIsUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Filter files by search term
  const filteredFiles = searchTerm 
    ? files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : files;
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => setActiveTab(v as 'image' | 'video' | 'document')}>
        <div className="flex items-center justify-between">
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
          
          <div>
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
