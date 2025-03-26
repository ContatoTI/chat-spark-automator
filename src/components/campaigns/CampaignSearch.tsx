
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CampaignSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalFiltered: number;
  totalCampaigns: number;
  isLoading: boolean;
}

export const CampaignSearch: React.FC<CampaignSearchProps> = ({
  searchQuery,
  setSearchQuery,
  totalFiltered,
  totalCampaigns,
  isLoading
}) => {
  return (
    <div className="glass-panel px-4 py-3">
      <div className="flex flex-col md:flex-row gap-4 w-full items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar campanhas..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 hidden md:flex justify-end">
          <p className="text-sm text-muted-foreground">
            {isLoading 
              ? "Carregando campanhas..." 
              : `Mostrando ${totalFiltered} de ${totalCampaigns} campanhas`}
          </p>
        </div>
      </div>
    </div>
  );
};
