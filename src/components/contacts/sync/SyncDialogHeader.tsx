
import React from "react";
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

export const SyncDialogHeader: React.FC = () => {
  return (
    <DialogHeader>
      <DialogTitle>Sincronizar Contatos</DialogTitle>
      <DialogDescription>
        Conecte-se ao Google Contacts e sincronize seus contatos com a plataforma.
      </DialogDescription>
    </DialogHeader>
  );
};
