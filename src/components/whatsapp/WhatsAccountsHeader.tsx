
import { Button } from "@/components/ui/button";
import { Plus, Terminal } from "lucide-react";
import { NewInstanceDialog } from "./NewInstanceDialog";
import { useState } from "react";

interface WhatsAccountsHeaderProps {
  onCreate: (data: { nome_instancia: string }) => Promise<void>;
  isCreating: boolean;
  onToggleLogs: () => void;
  showLogs: boolean;
}

export function WhatsAccountsHeader({ 
  onCreate, 
  isCreating,
  onToggleLogs,
  showLogs 
}: WhatsAccountsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Contas WhatsApp</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas instâncias do WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showLogs ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleLogs}
            className="gap-2"
          >
            <Terminal className="h-4 w-4" />
            Logs
          </Button>
          <Button 
            onClick={() => setDialogOpen(true)} 
            disabled={isCreating}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Instância
          </Button>
        </div>
      </div>
      <NewInstanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onCreate}
      />
    </div>
  );
}
