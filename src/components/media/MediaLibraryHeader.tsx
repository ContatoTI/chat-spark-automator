
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MediaLibraryHeaderProps {
  activeTab: 'image' | 'video' | 'document';
  setActiveTab: (tab: 'image' | 'video' | 'document') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleRetryLoad: () => void;
  isLoading: boolean;
  handleUploadClick: () => void;
  isUploading: boolean;
}

export function MediaLibraryHeader({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  handleRetryLoad,
  isLoading,
  handleUploadClick,
  isUploading
}: MediaLibraryHeaderProps) {
  return (
    <div className="space-y-4">
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
            onClick={handleRetryLoad} 
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
          
          <Button 
            onClick={handleUploadClick}
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
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Fazer Upload
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div>
        <Input 
          placeholder="Buscar arquivos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
    </div>
  );
}
