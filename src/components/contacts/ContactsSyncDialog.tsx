
import React from "react";
import { 
  Dialog, 
  DialogContent 
} from "@/components/ui/dialog";
import { SyncDialogHeader } from "./sync/SyncDialogHeader";
import { SyncIdleState } from "./sync/SyncIdleState";
import { SyncInProgressState } from "./sync/SyncInProgressState";
import { SyncSuccessState } from "./sync/SyncSuccessState";
import { SyncErrorState } from "./sync/SyncErrorState";
import { SyncDialogFooter } from "./sync/SyncDialogFooter";
import { useSyncContacts } from "./sync/useSyncContacts";

interface ContactsSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const ContactsSyncDialog: React.FC<ContactsSyncDialogProps> = ({ 
  open, 
  onOpenChange,
  onSync,
  isSyncing = false
}) => {
  const {
    status,
    progress,
    webhookMessage,
    startSync,
    resetState
  } = useSyncContacts(open);

  const handleClose = () => {
    onOpenChange(false);
  };

  // If external onSync is provided, use that instead
  const handleSync = () => {
    if (onSync) {
      onSync();
    } else {
      startSync();
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) resetState();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <SyncDialogHeader />
        
        <div className="py-6">
          {status === "idle" && <SyncIdleState />}
          {status === "syncing" && <SyncInProgressState progress={progress} />}
          {status === "success" && <SyncSuccessState message={webhookMessage} />}
          {status === "error" && <SyncErrorState />}
        </div>
        
        <SyncDialogFooter 
          status={status}
          onSync={handleSync}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
