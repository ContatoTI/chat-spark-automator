
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { WhatsAccountsHeader } from "@/components/whatsapp/WhatsAccountsHeader";
import { WhatsAccountsTable } from "@/components/whatsapp/WhatsAccountsTable";
import { useWhatsAccounts } from "@/hooks/useWhatsAccounts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAccounts = () => {
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
    refreshAccounts
  } = useWhatsAccounts();

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <WhatsAccountsHeader onCreate={createAccount} isCreating={isCreating} />
        
        {error ? (
          <div className="bg-destructive/15 p-4 rounded-md space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar contas</AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
            <Button onClick={refreshAccounts} variant="outline">
              Tentar novamente
            </Button>
            <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono overflow-auto">
              <p>Informação para o desenvolvedor:</p>
              <p>Tabela: AppW_Instancias</p>
              <p>O problema pode estar relacionado a políticas RLS no Supabase.</p>
              <p>Verifique se a tabela tem as permissões corretas para SELECT, INSERT e DELETE.</p>
            </div>
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
            />
            
            {!isLoading && accounts.length === 0 && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <h3 className="font-medium">Possível problema com RLS</h3>
                <p className="text-sm mt-1">
                  Não foram encontradas contas, mesmo que existam na tabela. Isso pode indicar um problema com as políticas de segurança RLS do Supabase.
                </p>
                <div className="mt-2 p-2 bg-amber-100/50 dark:bg-amber-900/20 rounded text-xs">
                  <p>Para resolver:</p>
                  <ol className="list-decimal list-inside">
                    <li>Acesse o painel do Supabase</li>
                    <li>Navegue até Autenticação &gt; Políticas</li>
                    <li>Selecione a tabela "AppW_Instancias"</li>
                    <li>Adicione uma política que permita SELECT, INSERT e DELETE</li>
                  </ol>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default WhatsAccounts;
