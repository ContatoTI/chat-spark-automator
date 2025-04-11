
import React from "react";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { FtpSettings } from "@/components/settings/FtpSettings";
import { SaveButton } from "@/components/settings/SaveButton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanySettingsFormProps {
  companyId: string;
}

export function CompanySettingsForm({ companyId }: CompanySettingsFormProps) {
  const { settings, isLoading, error, form, isSubmitting, onSubmit } = useCompanySettings(companyId);
  const { toast } = useToast();

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configurações gerais de API e webhooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings form={form} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações FTP</CardTitle>
              <CardDescription>
                Configurações para o servidor FTP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FtpSettings form={form} />
            </CardContent>
          </Card>

          <SaveButton isPending={isSubmitting} />
        </form>
      </Form>
    </div>
  );
}
