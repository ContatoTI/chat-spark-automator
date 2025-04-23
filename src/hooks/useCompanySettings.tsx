
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsSchema, SettingsFormValues } from "@/lib/validations/settings";
import { fetchCompanySettings, updateCompanySettings } from "@/lib/api/companies";
import { useEffect } from "react";

export function useCompanySettings(companyId: string) {
  const queryClient = useQueryClient();

  // Inicializa o formulário com valores padrão vazios
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      instancia: "",
      ativo: true,
      horario_limite: 17,
      long_wait_min: 50,
      long_wait_max: 240,
      short_wait_min: 5,
      short_wait_max: 10,
      batch_size_min: 5,
      batch_size_max: 10,
      url_api: "",
      apikey: "",
      webhook_disparo: "",
      webhook_get_images: "",
      webhook_up_docs: "",
      webhook_instancias: "",
      ftp_url: "",
      ftp_user: "",
      ftp_port: 21,
      ftp_password: "",
      id: 0,
      empresa_id: companyId,
      numero_de_contatos: 0,
    },
  });

  // Busca as configurações da empresa com companyId na query key
  const { 
    data: settings, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['company-settings', companyId],
    queryFn: () => fetchCompanySettings(companyId),
    retry: 1,
    staleTime: 30000,
    enabled: !!companyId, // Só realizar a consulta se houver um ID de empresa
  });

  // Atualiza os valores do formulário quando os dados são carregados
  useEffect(() => {
    if (settings) {
      // Atualize o formulário com os dados da empresa específica
      console.log(`[useCompanySettings] Carregando configurações da empresa ${companyId}:`, settings);
      form.reset({
        ...settings,
        empresa_id: companyId,
      });
      
      // Salvar webhook principal no localStorage para uso em outros componentes
      if (settings.webhook_disparo) {
        localStorage.setItem('webhook_disparo', settings.webhook_disparo);
        console.log(`[useCompanySettings] Webhook principal salvo no localStorage: ${settings.webhook_disparo}`);
      }
    }
  }, [settings, form, companyId]);

  // Mutation para atualizar as configurações
  const updateSettingsMutation = useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings', companyId] });
      toast.success("Configurações da empresa atualizadas com sucesso!");
      
      // Após salvar, atualize o localStorage com o webhook principal
      const webhookDisparo = form.getValues('webhook_disparo');
      if (webhookDisparo) {
        localStorage.setItem('webhook_disparo', webhookDisparo);
        console.log(`[useCompanySettings] Webhook principal atualizado no localStorage: ${webhookDisparo}`);
      }
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });

  // Função para salvar as configurações
  const onSubmit = async (values: SettingsFormValues) => {
    console.log("[useCompanySettings] Salvando configurações:", values);
    
    // Garantir que o empresa_id esteja correto
    const settingsToUpdate = {
      ...values,
      empresa_id: companyId,
    };
    
    try {
      await updateSettingsMutation.mutateAsync(settingsToUpdate);
      console.log("[useCompanySettings] Configurações salvas com sucesso!");
    } catch (error) {
      console.error("[useCompanySettings] Erro ao salvar configurações:", error);
    }
  };

  return {
    settings,
    isLoading,
    error,
    form,
    isSubmitting: updateSettingsMutation.isPending,
    onSubmit
  };
}
