
import { Button } from "@/components/ui/button";
import { Building2, RefreshCcw, Terminal } from "lucide-react";
import { NewCompanyDialog } from "./NewCompanyDialog";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface CompaniesHeaderProps {
  onRefresh: () => void;
  onToggleLogs: () => void;
  showLogs: boolean;
}

export function CompaniesHeader({ onRefresh, onToggleLogs, showLogs }: CompaniesHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isMaster } = useAuth();

  // Handle company creation success
  const handleCompanyCreated = () => {
    onRefresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Empresas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas empresas e seus usuários
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
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </Button>
          {isMaster && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Building2 className="h-4 w-4" />
              Nova Empresa
            </Button>
          )}
        </div>
      </div>
      <NewCompanyDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onCompanyCreated={handleCompanyCreated} 
      />
    </div>
  );
}
