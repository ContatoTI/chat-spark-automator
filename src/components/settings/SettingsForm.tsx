
import React from "react";
import { Form } from "@/components/ui/form";
import { DisparoOptions } from "@/lib/api/settings";
import { GeneralSettings } from "./GeneralSettings";
import { LimitsSettings } from "./LimitsSettings";
import { IntervalSettings } from "./IntervalSettings";
import { BatchSettings } from "./BatchSettings";
import { FtpSettings } from "./FtpSettings";
import { SaveButton } from "./SaveButton";
import { useSettingsFormData } from "@/hooks/useSettingsFormData";

interface SettingsFormProps {
  initialSettings: DisparoOptions;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { form, isSubmitting, onSubmit } = useSettingsFormData(initialSettings);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <GeneralSettings form={form} />
        <LimitsSettings form={form} />
        <IntervalSettings form={form} />
        <BatchSettings form={form} />
        <FtpSettings form={form} />
        <SaveButton isPending={isSubmitting} />
      </form>
    </Form>
  );
}
