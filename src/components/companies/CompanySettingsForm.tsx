
import React from "react";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { FtpSettings } from "@/components/settings/FtpSettings";
import { SaveButton } from "@/components/settings/SaveButton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanySettingsHeader } from "@/components/settings/CompanySettingsHeader";
import { toast } from "sonner";

interface CompanySettingsFormProps {
  companyId: string;
}

export function CompanySettingsForm({ companyId }: CompanySettingsFormProps) {
  const { settings, isLoading, error, form, isSubmitting, onSubmit } = useCompanySettings(companyId);
  const { toast: uiToast } = useToast();

  const handleSubmit = async (values: any) => {
    console.log("Form submitted with values:", values);
    try {
      await onSubmit(values);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Erro ao salvar configurações");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 space-y-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Erro ao carregar configurações"}
        </p>
        <Button 
          variant="outline" 
          onClick={() => uiToast({
            title: "Ação necessária",
            description: "Verifique as permissões de acesso e tente novamente."
          })}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CompanySettingsHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <GeneralSettings form={form} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <FtpSettings form={form} />
            </CardContent>
          </Card>

          <SaveButton isPending={isSubmitting} />
        </form>
      </Form>
    </div>
  );
}
