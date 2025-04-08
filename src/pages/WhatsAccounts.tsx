
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { WhatsAccountsHeader } from "@/components/whatsapp/WhatsAccountsHeader";
import { WhatsAccountsTable } from "@/components/whatsapp/WhatsAccountsTable";
import { useWhatsAccounts } from "@/hooks/useWhatsAccounts";

const WhatsAccounts = () => {
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    deleteAccount,
    isCreating
  } = useWhatsAccounts();

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <WhatsAccountsHeader onCreate={createAccount} isCreating={isCreating} />
        
        {error ? (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md">
            Erro ao carregar contas: {error.message}
          </div>
        ) : (
          <WhatsAccountsTable 
            accounts={accounts} 
            isLoading={isLoading} 
            onDelete={deleteAccount}
          />
        )}
      </div>
    </Layout>
  );
};

export default WhatsAccounts;
