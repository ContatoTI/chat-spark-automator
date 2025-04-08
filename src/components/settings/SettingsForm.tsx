
import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, SettingsFormValues } from "@/lib/validations/settings";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisparoOptions, updateDisparoOptions } from "@/lib/api/settings";
import { GeneralSettings } from "./GeneralSettings";
import { LimitsSettings } from "./LimitsSettings";
import { IntervalSettings } from "./IntervalSettings";
import { BatchSettings } from "./BatchSettings";
import { FtpSettings } from "./FtpSettings";
import { SaveButton } from "./SaveButton";

interface SettingsFormProps {
  initialSettings: DisparoOptions;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      instancia: initialSettings.instancia || "",
      ativo: initialSettings.ativo,
      horario_limite: initialSettings.horario_limite,
      long_wait_min: initialSettings.long_wait_min,
      long_wait_max: initialSettings.long_wait_max,
      short_wait_min: initialSettings.short_wait_min,
      short_wait_max: initialSettings.short_wait_max,
      batch_size_min: initialSettings.batch_size_min,
      batch_size_max: initialSettings.batch_size_max,
      url_api: initialSettings.url_api || "",
      apikey: initialSettings.apikey || "",
      webhook_disparo: initialSettings.webhook_disparo || "",
      webhook_contatos: initialSettings.webhook_contatos || "",
      webhook_get_images: initialSettings.webhook_get_images || "",
      webhook_up_docs: initialSettings.webhook_up_docs || "",
      ftp_url: initialSettings.ftp_url || "",
      ftp_user: initialSettings.ftp_user || "",
      ftp_port: initialSettings.ftp_port,
      ftp_password: initialSettings.ftp_password || "",
      id: initialSettings.id,
      empresa_id: initialSettings.empresa_id,
      numero_de_contatos: initialSettings.numero_de_contatos,
    },
  });

  React.useEffect(() => {
    if (initialSettings) {
      form.reset({
        instancia: initialSettings.instancia || "",
        ativo: initialSettings.ativo,
        horario_limite: initialSettings.horario_limite,
        long_wait_min: initialSettings.long_wait_min,
        long_wait_max: initialSettings.long_wait_max,
        short_wait_min: initialSettings.short_wait_min,
        short_wait_max: initialSettings.short_wait_max,
        batch_size_min: initialSettings.batch_size_min,
        batch_size_max: initialSettings.batch_size_max,
        url_api: initialSettings.url_api || "",
        apikey: initialSettings.apikey || "",
        webhook_disparo: initialSettings.webhook_disparo || "",
        webhook_contatos: initialSettings.webhook_contatos || "",
        webhook_get_images: initialSettings.webhook_get_images || "",
        webhook_up_docs: initialSettings.webhook_up_docs || "",
        ftp_url: initialSettings.ftp_url || "",
        ftp_user: initialSettings.ftp_user || "",
        ftp_port: initialSettings.ftp_port,
        ftp_password: initialSettings.ftp_password || "",
        id: initialSettings.id,
        empresa_id: initialSettings.empresa_id,
        numero_de_contatos: initialSettings.numero_de_contatos,
      });
    }
  }, [initialSettings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateDisparoOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disparo-options'] });
      toast.success("Configurações atualizadas com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    const updatedSettings: DisparoOptions = {
      ...values,
      // Ensuring all required fields have values
      ativo: values.ativo ?? true,
      horario_limite: values.horario_limite,
      long_wait_min: values.long_wait_min,
      long_wait_max: values.long_wait_max,
      short_wait_min: values.short_wait_min,
      short_wait_max: values.short_wait_max,
      batch_size_min: values.batch_size_min,
      batch_size_max: values.batch_size_max,
      ftp_port: values.ftp_port || 21
    };
    updateSettingsMutation.mutate(updatedSettings);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <GeneralSettings form={form} />
        <LimitsSettings form={form} />
        <IntervalSettings form={form} />
        <BatchSettings form={form} />
        <FtpSettings form={form} />
        <SaveButton isPending={updateSettingsMutation.isPending} />
      </form>
    </Form>
  );
}
