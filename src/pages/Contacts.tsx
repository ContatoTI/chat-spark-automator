import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useContacts } from "@/hooks/useContacts";
import { ContactsHeader } from "@/components/contacts/ContactsHeader";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { ContactsPagination } from "@/components/contacts/ContactsPagination";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Contacts = () => {
  const {
    contacts,
    isLoading,
    error,
    tableExists,
    createContactList,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    refetch,
    companyId
  } = useContacts();

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleCreateList = async () => {
    try {
      const success = await createContactList();
      if (success) {
        refetch();
      }
      return success;
    } catch (error) {
      console.error("Error creating contact list:", error);
      return false;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <ContactsHeader
          onCreateList={handleCreateList}
          onRefresh={() => refetch()}
          tableExists={tableExists}
          isLoading={isLoading}
          onSync={() => refetch()}
          isSyncing={isLoading}
          totalContacts={totalCount}
          companyId={companyId}
        />

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Ocorreu um erro ao carregar os contatos."}
            </AlertDescription>
          </Alert>
        ) : null}

        {tableExists === false && companyId ? (
          <Card>
            <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
              <AlertCircle className="h-16 w-16 text-amber-500" />
              <h3 className="text-xl font-semibold text-center">
                Lista de contatos não encontrada
              </h3>
              <p className="text-center text-muted-foreground max-w-md">
                Não foi encontrada uma lista de contatos para esta empresa.
                Clique no botão "Criar Lista" para iniciar.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {tableExists === true && (
          <>
            <ContactsTable 
              contacts={contacts} 
              isLoading={isLoading} 
              companyId={companyId}
            />
            
            <ContactsPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={totalCount}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Contacts;
