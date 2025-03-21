
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ContactsSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SyncStatus = "idle" | "syncing" | "success" | "error";

export const ContactsSyncDialog: React.FC<ContactsSyncDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);

  const startSync = () => {
    setStatus("syncing");
    setProgress(0);
    
    // Simulate the sync process
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Simulate success or failure (90% chance of success)
          if (Math.random() > 0.1) {
            setStatus("success");
            setContactsCount(Math.floor(Math.random() * 500 + 1500));
            toast.success("Sincronização concluída com sucesso!");
          } else {
            setStatus("error");
            toast.error("Erro ao sincronizar contatos.");
          }
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const resetState = () => {
    if (status === "success" || status === "error") {
      setStatus("idle");
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetState();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sincronizar Contatos</DialogTitle>
          <DialogDescription>
            Conecte-se ao Google Contacts e sincronize seus contatos com a plataforma.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className="rounded-full bg-primary/10 p-4">
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Clique em sincronizar para importar seus contatos do Google Contacts para a plataforma.
              </p>
            </div>
          )}
          
          {status === "syncing" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center">
                <RefreshCw className={cn(
                  "h-8 w-8 text-primary",
                  "animate-spin"
                )} />
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-muted-foreground">
                  Sincronizando contatos... {Math.round(progress)}%
                </p>
              </div>
            </div>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center">
                <p className="font-medium">Sincronização concluída!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {contactsCount} contatos foram sincronizados com sucesso.
                </p>
              </div>
            </div>
          )}
          
          {status === "error" && (
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center">
                <p className="font-medium">Erro na sincronização</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ocorreu um erro ao sincronizar seus contatos. Por favor, tente novamente.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between gap-2">
          {status === "idle" && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          )}
          
          {(status === "idle" || status === "error") && (
            <Button onClick={startSync} className="bg-primary">
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
            <Button onClick={() => onOpenChange(false)}>
              Concluir
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
