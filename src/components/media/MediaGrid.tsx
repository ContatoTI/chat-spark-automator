
import React from "react";
import { MediaFile } from "@/lib/api/mediaLibrary";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, File, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/utils";

interface MediaGridProps {
  files: MediaFile[];
  isLoading: boolean;
  onSelect: (mediaFile: MediaFile) => void;
  type: 'image' | 'video' | 'document';
}

export function MediaGrid({ files, isLoading, onSelect, type }: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        {type === 'image' ? (
          <Image className="h-12 w-12 mb-4 text-muted-foreground/60" />
        ) : type === 'video' ? (
          <Video className="h-12 w-12 mb-4 text-muted-foreground/60" />
        ) : (
          <FileText className="h-12 w-12 mb-4 text-muted-foreground/60" />
        )}
        <p>Nenhum arquivo encontrado</p>
        <p className="text-sm">Faça upload de novos arquivos usando o botão acima</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => (
        <Card 
          key={file.path || file.url} 
          className={cn(
            "cursor-pointer hover:border-primary transition-colors overflow-hidden",
            "group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          onClick={() => onSelect(file)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(file);
            }
          }}
        >
          <div className="relative aspect-square">
            {file.type === 'image' ? (
              <img 
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback se a imagem não carregar
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : file.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <Video className="h-12 w-12 text-white/70" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <File className="h-12 w-12 text-slate-400" />
              </div>
            )}
          </div>
          
          <CardContent className="p-3 pt-3">
            <div className="truncate text-sm font-medium" title={file.name}>
              {file.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {file.size ? formatFileSize(file.size) : ''}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
