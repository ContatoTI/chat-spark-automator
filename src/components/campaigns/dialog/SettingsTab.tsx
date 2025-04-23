
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useWhatsAccountsCore } from "@/hooks/whatsapp/useWhatsAccountsCore";
import { Loader2, Zap } from "lucide-react";

interface SettingsTabProps {
  limiteDisparos: number;
  setLimiteDisparos: (value: number) => void;
  enviados: number;
  producao: boolean;
  setProducao: (value: boolean) => void;
  selectedInstance: string | null;
  setSelectedInstance: (value: string | null) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  limiteDisparos,
  setLimiteDisparos,
  enviados,
  producao,
  setProducao,
  selectedInstance,
  setSelectedInstance
}) => {
  const { accounts, isLoading } = useWhatsAccountsCore();
  
  // Filter only connected instances
  const connectedAccounts = accounts.filter(account => account.status === "connected");

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="limiteDisparos">Limite de Disparos</Label>
        <Input
          id="limiteDisparos"
          type="number"
          value={limiteDisparos}
          onChange={(e) => setLimiteDisparos(Number(e.target.value))}
          min={1}
        />
        <p className="text-sm text-muted-foreground">
          Disparos enviados: {enviados}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Instância WhatsApp</Label>
        <Select value={selectedInstance || ""} onValueChange={setSelectedInstance}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma instância" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : connectedAccounts.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                Nenhuma instância conectada
              </div>
            ) : (
              connectedAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name || account.phone}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Selecione a instância que será usada para enviar as mensagens
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="producao"
          checked={producao}
          onCheckedChange={setProducao}
        />
        <Label htmlFor="producao" className="flex items-center gap-2">
          Produção
          {producao && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              <Zap className="h-3.5 w-3.5 mr-1" />
              Produção
            </Badge>
          )}
        </Label>
      </div>
    </div>
  );
};
