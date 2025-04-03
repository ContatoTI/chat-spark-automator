
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MessageTextareasProps {
  message1: string;
  setMessage1: (value: string) => void;
  message2: string;
  setMessage2: (value: string) => void;
  message3: string;
  setMessage3: (value: string) => void;
  message4: string;
  setMessage4: (value: string) => void;
  setActiveTextarea: (textarea: "message1" | "message2" | "message3" | "message4" | null) => void;
}

export const MessageTextareas: React.FC<MessageTextareasProps> = ({
  message1,
  setMessage1,
  message2,
  setMessage2,
  message3,
  setMessage3,
  message4,
  setMessage4,
  setActiveTextarea,
}) => {
  const message1Ref = useRef<HTMLTextAreaElement>(null);
  const message2Ref = useRef<HTMLTextAreaElement>(null);
  const message3Ref = useRef<HTMLTextAreaElement>(null);
  const message4Ref = useRef<HTMLTextAreaElement>(null);
  
  return (
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
  );
};
