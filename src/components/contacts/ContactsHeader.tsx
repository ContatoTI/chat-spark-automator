import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Loader2, Download, Tag, Upload } from "lucide-react";
import { ContactsSyncDialog } from "./ContactsSyncDialog";
import { useAuth } from "@/contexts/AuthContext";
import { callWebhook } from "@/lib/api/webhook-utils";
import { toast } from "sonner";
import { ContactTagsDialog } from "./ContactTagsDialog";
import { supabase } from "@/lib/supabase";
import { ContactsConfirmSyncDialog } from "./ContactsConfirmSyncDialog";

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
  const [confirmSyncDialogOpen, setConfirmSyncDialogOpen] = useState(false);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const { user, selectedCompany } = useAuth();
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
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
      let webhookUrl = localStorage.getItem('webhook_disparo');
      
      if (!webhookUrl) {
        const { data: webhookData, error: webhookError } = await supabase
          .from('AppW_Options')
          .select('text')
          .eq('option', 'webhook_disparo')
          .single();
          
        if (!webhookError && webhookData?.text) {
          webhookUrl = webhookData.text;
          localStorage.setItem('webhook_disparo', webhookUrl);
        } else {
          console.error("Erro ao buscar webhook de disparo:", webhookError);
        }
      }
      
      if (!webhookUrl) {
        throw new Error("Webhook principal não configurado");
      }
      
      console.log("[CreateList] Iniciando criação de lista via webhook:", webhookUrl);
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

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error("Por favor, selecione um arquivo CSV");
      return;
    }

    setIsUploadingCsv(true);
    try {
      let webhookUrl = localStorage.getItem('webhook_disparo');
      if (!webhookUrl) {
        const { data: webhookData, error: webhookError } = await supabase
          .from('AppW_Options')
          .select('text')
          .eq('option', 'webhook_disparo')
          .single();
          
        if (webhookError) throw new Error("Webhook não configurado");
        if (webhookData?.text) {
          webhookUrl = webhookData.text;
          localStorage.setItem('webhook_disparo', webhookUrl);
        }
      }

      if (!webhookUrl) {
        throw new Error("URL do webhook não configurada");
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', 'carregar_csv');
      formData.append('company_id', companyId || '');
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar arquivo");
      }

      toast.success("Arquivo CSV enviado com sucesso");
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erro ao fazer upload do CSV:", error);
      toast.error("Erro ao enviar arquivo CSV", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setIsUploadingCsv(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmSync = async () => {
    handleRefresh();
    setConfirmSyncDialogOpen(false);
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
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleCsvUpload}
            className="hidden"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingCsv}
            className="flex items-center gap-2"
          >
            {isUploadingCsv ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Carregar Contatos (.CSV)
              </>
            )}
          </Button>

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
            onClick={() => setConfirmSyncDialogOpen(true)}
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
      
      <ContactsConfirmSyncDialog
        isOpen={confirmSyncDialogOpen}
        onOpenChange={setConfirmSyncDialogOpen}
        onConfirm={handleConfirmSync}
        isSyncing={isSyncing}
      />
    </div>
  );
};
