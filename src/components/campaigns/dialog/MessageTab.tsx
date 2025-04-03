import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Image as ImageIcon, 
  File, 
  Link, 
  Video,
  Type,
  FolderOpen,
  User,
  Variable
} from "lucide-react";
import { MediaLibraryDialog } from "@/components/media/MediaLibraryDialog";
import { MediaFile } from "@/lib/api/mediaLibrary";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  
  const message1Ref = useRef<HTMLTextAreaElement>(null);
  const message2Ref = useRef<HTMLTextAreaElement>(null);
  const message3Ref = useRef<HTMLTextAreaElement>(null);
  const message4Ref = useRef<HTMLTextAreaElement>(null);
  const [activeTextarea, setActiveTextarea] = useState<"message1" | "message2" | "message3" | "message4" | null>(null);
  const campaignNameRef = useRef<HTMLInputElement>(null);
  
  const handleMediaFileSelect = (file: MediaFile) => {
    setMediaUrl(file.url);
  };

  const insertVariable = (variable: string) => {
    // If the campaign name field is active, insert the variable there
    if (document.activeElement === campaignNameRef.current) {
      const input = campaignNameRef.current;
      if (input) {
        const startPos = input.selectionStart || 0;
        const endPos = input.selectionEnd || 0;
        const newValue = campaignName.substring(0, startPos) + variable + campaignName.substring(endPos);
        setCampaignName(newValue);
        
        // Set cursor position after the inserted variable
        setTimeout(() => {
          input.focus();
          const newCursorPos = startPos + variable.length;
          input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
        return;
      }
    }
    
    // Otherwise insert into the active textarea
    let textArea: HTMLTextAreaElement | null = null;
    let setValue: (value: string) => void = () => {};
    let currentValue = "";
    
    switch (activeTextarea) {
      case "message1":
        textArea = message1Ref.current;
        setValue = setMessage1;
        currentValue = message1;
        break;
      case "message2":
        textArea = message2Ref.current;
        setValue = setMessage2;
        currentValue = message2;
        break;
      case "message3":
        textArea = message3Ref.current;
        setValue = setMessage3;
        currentValue = message3;
        break;
      case "message4":
        textArea = message4Ref.current;
        setValue = setMessage4;
        currentValue = message4;
        break;
      default:
        return;
    }

    if (textArea) {
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;
      
      const newValue = currentValue.substring(0, startPos) + variable + currentValue.substring(endPos);
      setValue(newValue);

      // Set cursor position after the inserted variable
      setTimeout(() => {
        textArea?.focus();
        textArea?.setSelectionRange(startPos + variable.length, startPos + variable.length);
      }, 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Nome da Campanha</Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Input
              id="campaign-name"
              ref={campaignNameRef}
              placeholder="Ex: Promoção de Verão"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="pr-10"
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1" 
                onClick={() => insertVariable("<nome>")}
              >
                <div className="flex items-center gap-1">
                  <span className="font-medium">Variáveis:</span>
                  <User className="h-4 w-4" />
                  <span>Nome</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Inserir nome do cliente
            </TooltipContent>
          </Tooltip>
        </div>
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
            <div className="flex gap-2">
              <Input
                id="media-url"
                placeholder={`Adicione a URL da ${mediaType === 'image' ? 'imagem' : mediaType === 'video' ? 'vídeo' : mediaType === 'document' ? 'documento' : 'link'}`}
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1"
              />
              
              {mediaType !== 'link' && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setMediaLibraryOpen(true)}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Biblioteca
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="message-text-1">Mensagem 1 (Principal)</Label>
            <Textarea
              ref={message1Ref}
              id="message-text-1"
              placeholder="Digite sua mensagem principal aqui..."
              value={message1}
              onChange={(e) => setMessage1(e.target.value)}
              className="min-h-[120px]"
              onFocus={() => setActiveTextarea("message1")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-text-2">Mensagem 2 (Opcional)</Label>
            <Textarea
              ref={message2Ref}
              id="message-text-2"
              placeholder="Digite sua mensagem secundária aqui..."
              value={message2}
              onChange={(e) => setMessage2(e.target.value)}
              className="min-h-[120px]"
              onFocus={() => setActiveTextarea("message2")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-text-3">Mensagem 3 (Opcional)</Label>
            <Textarea
              ref={message3Ref}
              id="message-text-3"
              placeholder="Digite sua mensagem adicional aqui..."
              value={message3}
              onChange={(e) => setMessage3(e.target.value)}
              className="min-h-[120px]"
              onFocus={() => setActiveTextarea("message3")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-text-4">Mensagem 4 (Opcional)</Label>
            <Textarea
              ref={message4Ref}
              id="message-text-4"
              placeholder="Digite sua mensagem final aqui..."
              value={message4}
              onChange={(e) => setMessage4(e.target.value)}
              className="min-h-[120px]"
              onFocus={() => setActiveTextarea("message4")}
            />
          </div>
        </div>
      </div>
      
      {/* Media Library Dialog */}
      <MediaLibraryDialog
        open={mediaLibraryOpen}
        onOpenChange={setMediaLibraryOpen}
        onSelect={handleMediaFileSelect}
        currentType={
          mediaType === 'image' ? 'image' :
          mediaType === 'video' ? 'video' :
          'document'
        }
      />
    </div>
  );
};
