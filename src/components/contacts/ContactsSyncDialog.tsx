
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
}

export const ContactsSyncDialog: React.FC<ContactsSyncDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const {
    status,
    progress,
    startSync,
    resetState
  } = useSyncContacts(open);

  const handleClose = () => {
    onOpenChange(false);
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
          {status === "success" && <SyncSuccessState />}
          {status === "error" && <SyncErrorState />}
        </div>
        
        <SyncDialogFooter 
          status={status}
          onSync={startSync}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
