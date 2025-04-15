
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";
import { InstanceApiSection } from "./sections/InstanceApiSection";
import { WebhookSection } from "./sections/WebhookSection";
import { SystemActiveToggle } from "./sections/SystemActiveToggle";

interface GeneralSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function GeneralSettings({ form }: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>
          Configurações gerais para o sistema de disparo de mensagens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InstanceApiSection form={form} />
        <WebhookSection form={form} />
        <SystemActiveToggle form={form} />
      </CardContent>
    </Card>
  );
}
