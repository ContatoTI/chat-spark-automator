
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
import { useAuth } from "@/contexts/AuthContext";

interface SettingsFormProps {
  initialSettings: DisparoOptions;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const { user } = useAuth();

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
      webhook_disparo: "",
      webhook_contatos: "",
      profile_id: user?.id,
    },
  });

  // Update form when settings are loaded
  React.useEffect(() => {
    if (initialSettings) {
      // Ensure the profile_id is set to the current user
      if (user?.id && (!initialSettings.profile_id || initialSettings.profile_id !== user.id)) {
        initialSettings.profile_id = user.id;
      }
      
      form.reset(initialSettings);
      console.log("Form reset with initial settings including profile_id:", initialSettings.profile_id);
    }
  }, [initialSettings, form, user]);

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
    
    // Validation to ensure user is authenticated
    if (!user) {
      setSaveError("Usuário não autenticado. Faça login novamente para salvar configurações.");
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Usuário não autenticado. Faça login novamente.",
      });
      return;
    }
    
    // Ensure the profile_id is set to the current user
    values.profile_id = user.id;
    console.log("Salvando configurações com profile_id:", values.profile_id);
    
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
