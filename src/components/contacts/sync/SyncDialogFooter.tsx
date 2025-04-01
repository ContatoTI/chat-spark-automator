
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface SyncDialogFooterProps {
  status: SyncStatus;
  onSync: () => void;
  onClose: () => void;
}

export const SyncDialogFooter: React.FC<SyncDialogFooterProps> = ({ 
  status, 
  onSync, 
  onClose 
}) => {
  return (
    <DialogFooter className="sm:justify-between gap-2">
      {status === "idle" && (
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSync} className="bg-primary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sincronizar
          </Button>
        </>
      )}
      
      {status === "error" && (
        <Button onClick={onSync} className="bg-primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Sincronizar
        </Button>
      )}
      
      {status === "syncing" && (
        <Button disabled>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Sincronizando...
        </Button>
      )}
      
      {status === "success" && (
        <Button onClick={onClose}>
          Concluir
        </Button>
      )}
    </DialogFooter>
  );
};
