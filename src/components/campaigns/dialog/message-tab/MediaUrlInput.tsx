
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

interface MediaUrlInputProps {
  mediaType: string | null;
  mediaUrl: string;
  setMediaUrl: (url: string) => void;
  onOpenMediaLibrary: () => void;
}

export const MediaUrlInput: React.FC<MediaUrlInputProps> = ({
  mediaType,
  mediaUrl,
  setMediaUrl,
  onOpenMediaLibrary,
}) => {
  if (!mediaType || mediaType === 'text') return null;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="media-url">URL da Mídia {mediaType !== 'link' && "(Opcional)"}</Label>
      <div className="flex gap-2">
        <Input
          id="media-url"
          placeholder={`Adicione a URL da ${
            mediaType === 'image' ? 'imagem' : 
            mediaType === 'video' ? 'vídeo' : 
            mediaType === 'document' ? 'documento' : 'link'
          }`}
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="flex-1"
        />
        
        {mediaType !== 'link' && (
          <Button 
            type="button"
            variant="outline"
            onClick={onOpenMediaLibrary}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Biblioteca
          </Button>
        )}
      </div>
    </div>
  );
};
