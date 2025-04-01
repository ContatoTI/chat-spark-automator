
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Users } from "lucide-react";

interface SettingsTabProps {
  limiteDisparos: number;
  setLimiteDisparos: (value: number) => void;
  enviados: number;
  producao: boolean;
  setProducao: (value: boolean) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  limiteDisparos,
  setLimiteDisparos,
  enviados,
  producao,
  setProducao,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="limite-disparos">Limite de Disparos</Label>
          <Input
            id="limite-disparos"
            type="number"
            value={limiteDisparos}
            onChange={(e) => setLimiteDisparos(Number(e.target.value))}
          />
          <p className="text-sm text-muted-foreground">
            Número máximo de mensagens a serem enviadas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span>Mensagens enviadas até o momento: <strong>{enviados}</strong></span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="producao">Produção</Label>
          <Switch 
            id="producao" 
            checked={producao} 
            onCheckedChange={setProducao} 
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Ative para enviar em ambiente de produção
        </p>
      </div>
    </div>
  );
};
