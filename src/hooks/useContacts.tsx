
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { callWebhook } from "@/lib/api/webhook-utils";
import { toast } from "sonner";

export interface Contact {
  id: number;
  Nome: string;
  Numero: string;
  Enviado: boolean | null;
  Nome_Real: string | null;
  Invalido: string | null;
  [key: string]: any; // For other dynamic columns
}

export const useContacts = () => {
  const { user, selectedCompany, isMaster } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableExists, setTableExists] = useState<boolean | null>(null);

  // Determine the company ID to use
  const companyId = selectedCompany || (user?.company_id ?? null);

  // Check if the table exists
  const checkTableExists = async (id: string) => {
    if (!id) return false;
    
    try {
      console.log(`Checking if table appw_lista_${id} exists`);
      const { data, error } = await supabase
        .from('appw_lista_' + id)
        .select('id')
        .limit(1);
      
      if (error) {
        console.error("Error checking table:", error);
        // Table doesn't exist if we get a specific error
        if (error.code === "42P01") {
          return false;
        }
        // For other errors, we're uncertain
        return null;
      }
      
      return true;
    } catch (error) {
      console.error("Error in checkTableExists:", error);
      return false;
    }
  };

  // Function to create contact list
  const createContactList = async () => {
    if (!companyId) {
      toast.error("Nenhuma empresa selecionada");
      return false;
    }

    toast.info("Criando lista de contatos...");
    
    try {
      // Get the webhook URL from settings
      const webhookURLData = await supabase
        .from('AppW_Settings')
        .select('webhook_contatos')
        .eq('empresa_id', companyId)
        .single();
      
      if (webhookURLData.error) {
        throw new Error("Não foi possível obter a URL do webhook");
      }
      
      const webhookURL = webhookURLData.data?.webhook_contatos;
      
      if (!webhookURL) {
        throw new Error("URL do webhook não configurada");
      }
      
      // Call the webhook to create the contact list
      const result = await callWebhook(webhookURL, {
        action: "criar_lista",
        id_empresa: companyId,
        timestamp: new Date().toISOString()
      });
      
      if (!result.success) {
        throw new Error(result.message || "Erro ao criar lista de contatos");
      }
      
      toast.success("Lista de contatos criada com sucesso!");
      
      // Check again if the table exists
      const exists = await checkTableExists(companyId);
      setTableExists(exists);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao criar lista de contatos", {
        description: errorMessage
      });
      console.error("Error creating contact list:", error);
      return false;
    }
  };

  // Effect to check if table exists when company changes
  useEffect(() => {
    if (companyId) {
      checkTableExists(companyId).then(exists => {
        setTableExists(exists);
      });
    } else {
      setTableExists(null);
    }
  }, [companyId]);

  // Query to fetch contacts from the company-specific table
  const {
    data: contacts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['contacts', companyId, page, pageSize, tableExists],
    queryFn: async () => {
      if (!companyId || tableExists !== true) {
        return [];
      }

      console.log(`Fetching contacts for company: ${companyId}, page: ${page}, pageSize: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      try {
        const { data, error } = await supabase
          .from('appw_lista_' + companyId)
          .select('*')
          .range(start, end);
          
        if (error) {
          throw error;
        }
        
        return data as Contact[];
      } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error;
      }
    },
    enabled: !!companyId && tableExists === true
  });

  // Query to fetch total count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['contacts-count', companyId, tableExists],
    queryFn: async () => {
      if (!companyId || tableExists !== true) {
        return 0;
      }
      
      try {
        const { count, error } = await supabase
          .from('appw_lista_' + companyId)
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          throw error;
        }
        
        return count || 0;
      } catch (error) {
        console.error("Error fetching contact count:", error);
        return 0;
      }
    },
    enabled: !!companyId && tableExists === true
  });

  return {
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
  };
};
