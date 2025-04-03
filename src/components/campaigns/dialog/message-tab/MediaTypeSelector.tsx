
import React from "react";
import { Type, ImageIcon, File, Link, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaTypeSelectorProps {
  mediaType: string | null;
  handleMediaSelection: (type: string) => void;
}

export const MediaTypeSelector: React.FC<MediaTypeSelectorProps> = ({
  mediaType,
  handleMediaSelection
}) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div 
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
          mediaType === 'text' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
        )}
        onClick={() => handleMediaSelection('text')}
      >
        <Type className={cn("h-8 w-8", mediaType === 'text' ? "text-primary" : "text-muted-foreground")} />
        <span className="text-sm font-medium">Texto</span>
      </div>
      <div 
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
          mediaType === 'image' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
        )}
        onClick={() => handleMediaSelection('image')}
      >
        <ImageIcon className={cn("h-8 w-8", mediaType === 'image' ? "text-primary" : "text-muted-foreground")} />
        <span className="text-sm font-medium">Imagem</span>
      </div>
      <div 
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
          mediaType === 'document' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
        )}
        onClick={() => handleMediaSelection('document')}
      >
        <File className={cn("h-8 w-8", mediaType === 'document' ? "text-primary" : "text-muted-foreground")} />
        <span className="text-sm font-medium">Documento</span>
      </div>
      <div 
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
          mediaType === 'video' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
        )}
        onClick={() => handleMediaSelection('video')}
      >
        <Video className={cn("h-8 w-8", mediaType === 'video' ? "text-primary" : "text-muted-foreground")} />
        <span className="text-sm font-medium">Vídeo</span>
      </div>
      <div 
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
          mediaType === 'link' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
        )}
        onClick={() => handleMediaSelection('link')}
      >
        <Link className={cn("h-8 w-8", mediaType === 'link' ? "text-primary" : "text-muted-foreground")} />
        <span className="text-sm font-medium">Link</span>
      </div>
    </div>
  );
};
