
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

interface CampaignHeaderProps {
  onNewCampaign: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  onNewCampaign,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Campanhas</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas campanhas de WhatsApp
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
        <Button 
          className="w-full sm:w-auto bg-primary"
          onClick={onNewCampaign}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>
    </div>
  );
};
