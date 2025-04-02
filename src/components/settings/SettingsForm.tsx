
import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema } from "@/lib/validations/settings";
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

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      instancia: "",
      Ativo: true,
      horario_limite: 17,
      long_wait_min: 50,
      long_wait_max: 240,
      ShortWaitMin: 5,
      ShortWaitMax: 10,
      BatchSizeMim: 5,
      BatchSizeMax: 10,
      urlAPI: "",
      apikey: "",
      webhook_disparo: "",
      webhook_contatos: "",
      ftp_url: "",
      ftp_user: "",
      ftp_port: 21,
      ftp_password: "",
    },
  });

  // Update form when settings are loaded
  React.useEffect(() => {
    if (initialSettings) {
      form.reset(initialSettings);
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

  const onSubmit = (values: DisparoOptions) => {
    updateSettingsMutation.mutate(values);
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
