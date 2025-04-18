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
    refreshAccountsStatus,
    isRefreshing,
    qrCodeData,
    qrCodeDialogOpen,
    currentInstance,
    closeQrCodeDialog,
    getStatusInfo
  } = useWhatsAccounts();

  const [showLogs, setShowLogs] = useState(true);
  const [webhookLogs, setWebhookLogs] = useState<Array<{ timestamp: string; data: any }>>([]);

  const handleRefreshAccounts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refreshAccounts();
  };

  const addWebhookLog = (data: any) => {
    setWebhookLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      data
    }]);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <WhatsAccountsHeader 
          onCreate={createAccount} 
          onRefreshStatus={refreshAccountsStatus}
          isCreating={isCreating} 
          isRefreshing={isRefreshing}
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
            <Button onClick={handleRefreshAccounts} variant="outline">
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
