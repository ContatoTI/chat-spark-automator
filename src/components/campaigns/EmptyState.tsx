
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onNewCampaign: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onNewCampaign }) => {
  return (
    <div className="text-center py-12">
      <h3 className="font-medium text-lg">Nenhuma campanha encontrada</h3>
      <p className="text-muted-foreground mt-1">Crie uma nova campanha para começar</p>
      <Button className="mt-4 bg-primary" onClick={onNewCampaign}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Campanha
      </Button>
    </div>
  );
};
