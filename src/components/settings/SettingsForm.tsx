
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SettingsFormProps {
  initialSettings: DisparoOptions;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const form = useForm<DisparoOptions>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialSettings,
  });

  // Update form when settings are loaded
  React.useEffect(() => {
    if (initialSettings) {
      console.log("Setting form values with:", initialSettings);
      form.reset(initialSettings);
      console.log("Form reset with initial settings");
    }
  }, [initialSettings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateDisparoOptions,
    onSuccess: () => {
      setSaveError(null);
      queryClient.invalidateQueries({ queryKey: ['disparo-options'] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao salvar configurações:", error);
      if (error instanceof Error) {
        setSaveError(error.message);
      } else {
        setSaveError("Ocorreu um erro desconhecido ao salvar as configurações");
      }
      toast({
        variant: "destructive",
        title: "Erro ao atualizar configurações",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
      });
    },
  });

  const onSubmit = (values: DisparoOptions) => {
    setSaveError(null);
    console.log("Salvando configurações globais:", values);
    updateSettingsMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {saveError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao salvar configurações</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
        
        <GeneralSettings form={form} />
        <LimitsSettings form={form} />
        <IntervalSettings form={form} />
        <BatchSettings form={form} />
        <SaveButton isPending={updateSettingsMutation.isPending} />
      </form>
    </Form>
  );
}
