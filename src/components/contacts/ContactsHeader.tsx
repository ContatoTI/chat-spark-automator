
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Loader2, Download, Tag } from "lucide-react";
import { ContactsSyncDialog } from "./ContactsSyncDialog";
import { useAuth } from "@/contexts/AuthContext";
import { callWebhook } from "@/lib/api/webhook-utils";
import { toast } from "sonner";
import { ContactTagsDialog } from "./ContactTagsDialog";

interface ContactsHeaderProps {
  onCreate?: () => void;
  onSync: () => void;
  isSyncing: boolean;
  totalContacts: number;
  onCreateList?: () => Promise<boolean>;
  onRefresh?: () => Promise<any>;
  tableExists?: boolean;
  isLoading?: boolean;
  companyId: string | null;
}

export const ContactsHeader: React.FC<ContactsHeaderProps> = ({
  onCreate,
  onSync,
  isSyncing,
  totalContacts = 0,
  onCreateList,
  onRefresh,
  tableExists,
  isLoading,
  companyId
}) => {
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const { user, selectedCompany } = useAuth();
  
  const handleCreateList = async () => {
    if (onCreateList) {
      await onCreateList();
      return;
    }
    
    if (!companyId) {
      toast.error("Empresa não identificada");
      return;
    }

    setIsCreatingList(true);
    try {
      const { data: settingsData, error: settingsError } = await supabase
        .from('AppW_Settings')
        .select('webhook_disparo')
        .eq('empresa_id', companyId)
        .single();
      
      if (settingsError) {
        throw new Error("Não foi possível obter a URL do webhook");
      }
      
      const webhookUrl = settingsData?.webhook_disparo || localStorage.getItem('webhook_disparo');
      
      if (!webhookUrl) {
        throw new Error("Webhook principal não configurado");
      }
      
      console.log("[CreateList] Iniciando criação de lista...");
      const response = await callWebhook(webhookUrl, {
        action: "criar_lista",
        company_id: companyId,
        timestamp: new Date().toISOString()
      });
      
      if (response.success) {
        toast.success("Solicitação de criação de lista enviada com sucesso");
        console.log("[CreateList] Resposta:", response);
      } else {
        throw new Error(response.message || "Falha ao enviar solicitação");
      }
    } catch (error) {
      console.error("[CreateList] Erro:", error);
      toast.error("Erro ao criar lista", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      onSync();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contatos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus contatos ({totalContacts} contatos)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTagsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Tag className="h-4 w-4" />
            Gerenciar Tags
          </Button>

          {(!tableExists && companyId) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateList}
              disabled={isCreatingList || isLoading}
              className="flex items-center gap-2"
            >
              {isCreatingList ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Criar Lista
                </>
              )}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSyncDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Sincronizar
          </Button>
          
          {onCreate && (
            <Button onClick={onCreate} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Contato
            </Button>
          )}
        </div>
      </div>

      <ContactTagsDialog
        isOpen={tagsDialogOpen}
        onClose={() => setTagsDialogOpen(false)}
        companyId={companyId}
      />

      <ContactsSyncDialog
        open={syncDialogOpen}
        onOpenChange={setSyncDialogOpen}
        onSync={handleRefresh}
        isSyncing={isSyncing}
      />
    </div>
  );
};
