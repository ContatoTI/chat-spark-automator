
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface CampaignDialogFooterProps {
  activeTab: "message" | "settings" | "schedule";
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export const CampaignDialogFooter: React.FC<CampaignDialogFooterProps> = ({
  activeTab,
  handleNext,
  handleBack,
  handleSubmit,
  onClose,
  isSubmitting
}) => {
  return (
    <DialogFooter className="gap-2">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      
      {activeTab === "message" && (
        <Button onClick={handleNext} className="bg-primary">
          Próximo
        </Button>
      )}
      
      {activeTab === "settings" && (
        <>
          <Button variant="outline" onClick={handleBack}>
            Voltar
          </Button>
          <Button onClick={handleNext} className="bg-primary">
            Próximo
          </Button>
        </>
      )}
      
      {activeTab === "schedule" && (
        <>
          <Button variant="outline" onClick={handleBack}>
            Voltar
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Atualizando..." : "Atualizar Campanha"}
          </Button>
        </>
      )}
    </DialogFooter>
  );
};
