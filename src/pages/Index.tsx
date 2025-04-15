
import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Building, ChevronDown } from "lucide-react";
import { NewCampaignDialog } from "@/components/campaigns/NewCampaignDialog";
import { ContactsSyncDialog } from "@/components/contacts/ContactsSyncDialog";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanies } from "@/hooks/useCompanies";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isMaster, selectedCompany, setSelectedCompany, refreshPage } = useAuth();
  const { companies, refetch: refetchCompanies } = useCompanies();
  const queryClient = useQueryClient();
  
  // Função para atualizar os dados
  const handleRefresh = useCallback(() => {
    // Invalidar todas as queries para forçar recarregamento de dados
    queryClient.invalidateQueries();
    // Recarregar dados de empresas
    refetchCompanies();
    // Exibir toast de confirmação
    toast({
      title: "Dados atualizados",
      description: "As informações foram atualizadas com sucesso.",
      variant: "default"
    });
  }, [queryClient, refetchCompanies]);

  // Efeito para observar mudanças de empresa
  useEffect(() => {
    const handleCompanyChange = () => {
      // Invalidar consultas quando a empresa muda
      queryClient.invalidateQueries();
    };

    // Registrar o listener para o evento custom
    window.addEventListener('company-changed', handleCompanyChange);
    
    // Limpeza ao desmontar
    return () => {
      window.removeEventListener('company-changed', handleCompanyChange);
    };
  }, [queryClient]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        setIsLoading(true);
        
        if (isMaster && selectedCompany) {
          // Para usuário master com empresa selecionada
          const selectedCompanyData = companies.find(c => c.id === selectedCompany);
          setCompanyName(selectedCompanyData?.name || selectedCompanyData?.id);
        } else {
          // Para outros usuários ou master sem seleção
          const { data, error } = await supabase
            .from('AppW_Options')
            .select('empresa_id, nome_da_empresa')
            .eq(user?.company_id ? 'empresa_id' : 'id', user?.company_id || '1')
            .limit(1)
            .single();
          
          if (error) {
            console.error("Error fetching company info from options:", error);
          } else if (data) {
            setCompanyName(data.nome_da_empresa || data.empresa_id);
            
            // Se o usuário é master e não há empresa selecionada, definir a primeira encontrada
            if (isMaster && !selectedCompany) {
              setSelectedCompany(data.empresa_id);
            }
          }
        }
      } catch (err) {
        console.error("Error in fetchCompanyInfo:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyInfo();
  }, [user, isMaster, selectedCompany, companies, setSelectedCompany]);

  // Restaurar empresa selecionada do localStorage ao carregar
  useEffect(() => {
    if (isMaster) {
      const saved = localStorage.getItem('selectedCompany');
      if (saved) {
        setSelectedCompany(saved);
      }
    }
  }, [isMaster, setSelectedCompany]);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus contatos e campanhas de WhatsApp
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => setSyncDialogOpen(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar Contatos
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar Dados
            </Button>
            <Button 
              className="w-full sm:w-auto bg-primary"
              onClick={() => setNewCampaignDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Campanha
            </Button>
          </div>
        </div>

        {/* Company Information Card */}
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Empresa</h2>
              </div>
              
              {/* Seletor de empresa para usuário master */}
              {isMaster && companies.length > 0 && (
                <div className="w-64">
                  <Select 
                    value={selectedCompany || ''} 
                    onValueChange={handleCompanyChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="mt-2">
              {isLoading ? (
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
              ) : companyName ? (
                <p className="text-md font-semibold">{companyName}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma empresa identificada</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4">
          <RecentCampaigns />
        </div>
      </div>
      
      <NewCampaignDialog 
        open={newCampaignDialogOpen} 
        onOpenChange={setNewCampaignDialogOpen} 
      />
      
      <ContactsSyncDialog 
        open={syncDialogOpen} 
        onOpenChange={setSyncDialogOpen} 
      />
    </Layout>
  );
};

export default Dashboard;
