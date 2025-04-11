
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
      horario_limite: "",
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

  // Busca as configurações da empresa
  const { 
    data: settings, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['company-settings', companyId],
    queryFn: () => fetchCompanySettings(companyId),
    retry: 1,
    staleTime: 30000,
  });

  // Atualiza os valores do formulário quando os dados são carregados
  useEffect(() => {
    if (settings) {
      form.reset({
        ...settings,
        empresa_id: companyId,
      });
    }
  }, [settings, form, companyId]);

  // Mutation para atualizar as configurações
  const updateSettingsMutation = useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings', companyId] });
      toast.success("Configurações da empresa atualizadas com sucesso!");
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
