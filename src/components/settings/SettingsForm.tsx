
import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema } from "@/lib/validations/settings";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisparoOptions, updateDisparoOptions } from "@/lib/api/settings";
import { GeneralSettings } from "./GeneralSettings";
import { LimitsSettings } from "./LimitsSettings";
import { IntervalSettings } from "./IntervalSettings";
import { BatchSettings } from "./BatchSettings";
import { SaveButton } from "./SaveButton";

interface SettingsFormProps {
  initialSettings: DisparoOptions;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      instancia: "",
      Ativo: true,
      Producao: true,
      Limite_disparos: 1000,
      Enviados: 0,
      horario_limite: 17,
      long_wait_min: 50,
      long_wait_max: 240,
      ShortWaitMin: 5,
      ShortWaitMax: 10,
      BatchSizeMim: 5,
      BatchSizeMax: 10,
      urlAPI: "",
      apikey: "",
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
      toast({
        title: "Configurações atualizadas",
        description: "As configurações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar configurações",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
      });
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
        <SaveButton isPending={updateSettingsMutation.isPending} />
      </form>
    </Form>
  );
}
