
import React from "react";
import { Form } from "@/components/ui/form";
import { SaveButton } from "./SaveButton";
import { WebhookSection } from "./sections/WebhookSection";
import { GeneralSettings } from "./GeneralSettings";
import { IntervalSettings } from "./IntervalSettings";
import { BatchSettings } from "./BatchSettings";
import { FtpSettings } from "./FtpSettings";
import { SystemActiveToggle } from "./sections/SystemActiveToggle";
import { InstanceApiSection } from "./sections/InstanceApiSection";
import { LimitsSettings } from "./LimitsSettings";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Webhook } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";

interface SettingsFormProps {
  form: UseFormReturn<SettingsFormValues>;
  onSubmit: (values: SettingsFormValues) => Promise<void>;
  isSaving: boolean;
}

export function SettingsForm({ form, onSubmit, isSaving }: SettingsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
        <div className="space-y-6">
          <SystemActiveToggle form={form} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Configure as URLs de webhooks para integração com outros sistemas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookSection form={form} />
            </CardContent>
          </Card>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GeneralSettings form={form} />
            <LimitsSettings form={form} />
          </div>
          
          <InstanceApiSection form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntervalSettings form={form} />
            <BatchSettings form={form} />
          </div>
          
          <FtpSettings form={form} />
        </div>
        
        <SaveButton isSaving={isSaving} />
      </form>
    </Form>
  );
}
