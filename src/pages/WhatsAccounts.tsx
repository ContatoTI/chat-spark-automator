
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { WhatsAccountsHeader } from "@/components/whatsapp/WhatsAccountsHeader";
import { WhatsAccountsTable } from "@/components/whatsapp/WhatsAccountsTable";
import { QRCodeDialog } from "@/components/whatsapp/QRCodeDialog";
import { useWhatsAccounts } from "@/hooks/useWhatsAccounts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { LogWindow } from "@/components/debug/LogWindow";
import { fetchInstanceStatus } from "@/lib/api/whatsapp/status";
import { toast } from "sonner";

const WhatsAccounts = () => {
  const { user, selectedCompany } = useAuth();
  const isMaster = user?.role === 'master';
  const webhookUrl = localStorage.getItem('webhook_instancias');
  
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    deleteAccount,
    connectAccount,
    disconnectAccount,
    isCreating,
    isProcessing,
    refreshAccounts,
    isRefreshing,
    qrCodeData,
    qrCodeDialogOpen,
    currentInstance,
    closeQrCodeDialog,
    getStatusInfo
  } = useWhatsAccounts();

  const [showLogs, setShowLogs] = useState(true);
  const [webhookLogs, setWebhookLogs] = useState<Array<{ timestamp: string; data: any }>>([]);

  const handleUpdateStatus = async (instanceName: string) => {
    try {
      console.log(`Atualizando status da instância: ${instanceName}`);
      
      const status = await fetchInstanceStatus(instanceName);
      console.log(`Status atualizado: ${status}`);
      
      // Update accounts list with new status
      const updatedAccounts = accounts.map(account => {
        if (account.nome_instancia === instanceName) {
          return { ...account, status };
        }
        return account;
      });
      
      // Force refresh after status update
      refreshAccounts();
      
      toast.success(`Status da instância atualizado: ${status}`);
      
      // Adicionar log
      addWebhookLog({
        type: 'UPDATE_STATUS',
        instance: instanceName,
        status,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da instância');
    }
  };

  const addWebhookLog = (data: any) => {
    setWebhookLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      data
    }]);
  };

  // Create a wrapper function to handle the click event
  const handleRefreshClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    refreshAccounts();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <WhatsAccountsHeader 
          onCreate={createAccount} 
          isCreating={isCreating}
          onToggleLogs={() => setShowLogs(prev => !prev)}
          showLogs={showLogs}
        />
        
        {!webhookUrl && (
          <Alert variant="default" className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Webhook não configurado</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>URL do webhook de instâncias não configurada. Configure nas Configurações &gt; Webhooks.</p>
              <div>
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Ir para Configurações
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {error ? (
          <div className="bg-destructive/15 p-4 rounded-md space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar contas</AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
            <Button onClick={handleRefreshClick} variant="outline">
              Tentar novamente
            </Button>
            {/* Mostrar informações de debug apenas para usuários master */}
            {isMaster && (
              <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono overflow-auto">
                <p>Informação para o desenvolvedor:</p>
                <p>Tabela: AppW_Instancias</p>
                <p>O problema pode estar relacionado a políticas RLS no Supabase.</p>
                <p>Verifique se a tabela tem as permissões corretas para SELECT, INSERT e DELETE.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <WhatsAccountsTable 
              accounts={accounts} 
              isLoading={isLoading} 
              onDelete={deleteAccount}
              onConnect={connectAccount}
              onDisconnect={disconnectAccount}
              onUpdateStatus={handleUpdateStatus}
              isProcessing={isProcessing}
              getStatusInfo={getStatusInfo}
              onWebhookResponse={addWebhookLog}
            />
            
            {showLogs && (
              <LogWindow 
                title="Webhook Logs" 
                logs={webhookLogs}
                onClose={() => setShowLogs(false)}
              />
            )}
            
            <QRCodeDialog 
              isOpen={qrCodeDialogOpen}
              onClose={closeQrCodeDialog}
              instanceName={currentInstance || ''}
              qrCodeData={qrCodeData || undefined}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default WhatsAccounts;
