
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CampaignNameInputProps {
  campaignName: string;
  setCampaignName: (value: string) => void;
  insertVariable: (variable: string) => void;
}

export const CampaignNameInput: React.FC<CampaignNameInputProps> = ({
  campaignName,
  setCampaignName,
  insertVariable,
}) => {
  const campaignNameRef = useRef<HTMLInputElement>(null);
  
  return (
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
  );
};
