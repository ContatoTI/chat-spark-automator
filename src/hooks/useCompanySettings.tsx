
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
      horario_limite: 0,
      long_wait_min: 0,
      long_wait_max: 0,
      short_wait_min: 0,
      short_wait_max: 0,
      batch_size_min: 0,
      batch_size_max: 0,
      url_api: "",
      apikey: "",
      webhook_disparo: "",
      webhook_contatos: "",
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
      
      // Salvar webhook de instâncias no localStorage para uso em outros componentes
      if (settings.webhook_instancias) {
        localStorage.setItem('webhook_instancias', settings.webhook_instancias);
        console.log(`[useCompanySettings] Webhook de instâncias salvo no localStorage: ${settings.webhook_instancias}`);
      }
    }
  }, [settings, form, companyId]);

  // Mutation para atualizar as configurações
  const updateSettingsMutation = useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings', companyId] });
      toast.success("Configurações da empresa atualizadas com sucesso!");
      
      // Após salvar, atualize o localStorage com o webhook de instâncias
      const webhookInstancias = form.getValues('webhook_instancias');
      if (webhookInstancias) {
        localStorage.setItem('webhook_instancias', webhookInstancias);
        console.log(`[useCompanySettings] Webhook de instâncias atualizado no localStorage: ${webhookInstancias}`);
      }
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });

  // Função para salvar as configurações
  const onSubmit = (values: SettingsFormValues) => {
    updateSettingsMutation.mutate({
      ...values,
      empresa_id: companyId,
      ativo: values.ativo ?? true,
      horario_limite: values.horario_limite || 0,
      long_wait_min: values.long_wait_min || 0,
      long_wait_max: values.long_wait_max || 0,
      short_wait_min: values.short_wait_min || 0,
      short_wait_max: values.short_wait_max || 0,
      batch_size_min: values.batch_size_min || 0,
      batch_size_max: values.batch_size_max || 0,
      ftp_port: values.ftp_port || 21
    });
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
