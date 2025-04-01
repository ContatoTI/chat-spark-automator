
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  Image as ImageIcon, 
  File, 
  Link, 
  Video,
  Type
} from "lucide-react";

interface MessageTabProps {
  campaignName: string;
  setCampaignName: (value: string) => void;
  message1: string;
  setMessage1: (value: string) => void;
  message2: string;
  setMessage2: (value: string) => void;
  message3: string;
  setMessage3: (value: string) => void;
  message4: string;
  setMessage4: (value: string) => void;
  mediaType: string | null;
  setMediaType: (value: string | null) => void;
  mediaUrl: string;
  setMediaUrl: (value: string) => void;
  handleMediaSelection: (type: string) => void;
}

export const MessageTab: React.FC<MessageTabProps> = ({
  campaignName,
  setCampaignName,
  message1,
  setMessage1,
  message2,
  setMessage2,
  message3,
  setMessage3,
  message4,
  setMessage4,
  mediaType,
  mediaUrl,
  setMediaUrl,
  handleMediaSelection,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Nome da Campanha</Label>
        <Input
          id="campaign-name"
          placeholder="Ex: Promoção de Verão"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
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
        
        {mediaType && mediaType !== 'text' && (
          <div className="space-y-2">
            <Label htmlFor="media-url">URL da Mídia {mediaType !== 'link' && "(Opcional)"}</Label>
            <Input
              id="media-url"
              placeholder={`Adicione a URL da ${mediaType === 'image' ? 'imagem' : mediaType === 'video' ? 'vídeo' : mediaType === 'document' ? 'documento' : 'link'}`}
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="message-text-1">Mensagem 1 (Principal)</Label>
            <Textarea
              id="message-text-1"
              placeholder="Digite sua mensagem principal aqui..."
              value={message1}
              onChange={(e) => setMessage1(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-text-2">Mensagem 2 (Opcional)</Label>
            <Textarea
              id="message-text-2"
              placeholder="Digite sua mensagem secundária aqui..."
              value={message2}
              onChange={(e) => setMessage2(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-text-3">Mensagem 3 (Opcional)</Label>
            <Textarea
              id="message-text-3"
              placeholder="Digite sua mensagem adicional aqui..."
              value={message3}
              onChange={(e) => setMessage3(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-text-4">Mensagem 4 (Opcional)</Label>
            <Textarea
              id="message-text-4"
              placeholder="Digite sua mensagem final aqui..."
              value={message4}
              onChange={(e) => setMessage4(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
