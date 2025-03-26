
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CampaignErrorProps {
  error: unknown;
  onRefresh: () => void;
}

export const CampaignError: React.FC<CampaignErrorProps> = ({ error, onRefresh }) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">Campanhas</h1>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>
      <div className="p-8 text-center">
        <h2 className="text-xl font-medium text-red-600 mb-2">Erro ao carregar campanhas</h2>
        <p className="text-muted-foreground">{error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      </div>
    </div>
  );
};
