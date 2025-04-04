
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List, PlusCircle } from "lucide-react";

interface ViewModeSelectorProps {
  viewMode: "list" | "calendar";
  setViewMode: (mode: "list" | "calendar") => void;
  onNewCampaign: () => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  setViewMode,
  onNewCampaign
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          size="sm"
          className="h-8"
          onClick={() => setViewMode("calendar")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Calendário
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          className="h-8"
          onClick={() => setViewMode("list")}
        >
          <List className="mr-2 h-4 w-4" />
          Lista
        </Button>
      </div>
      <Button size="sm" className="h-8 bg-primary" onClick={onNewCampaign}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Campanha
      </Button>
    </div>
  );
};
