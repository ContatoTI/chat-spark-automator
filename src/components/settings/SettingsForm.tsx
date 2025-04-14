
import React from "react";
import { Form } from "@/components/ui/form";
import { DisparoOptions } from "@/lib/api/settings";
import { LimitsSettings } from "./LimitsSettings";
import { IntervalSettings } from "./IntervalSettings";
import { BatchSettings } from "./BatchSettings";
import { SaveButton } from "./SaveButton";
import { useSettingsFormData } from "@/hooks/useSettingsFormData";

interface SettingsFormProps {
  initialSettings: DisparoOptions;
  userRole?: string;
}

export function SettingsForm({ initialSettings, userRole }: SettingsFormProps) {
  const { form, isSubmitting, onSubmit } = useSettingsFormData(initialSettings);
  const isAdmin = userRole === 'admin';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Mostrar configurações de limites para qualquer tipo de usuário */}
        <LimitsSettings form={form} />
        
        {/* Mostrar configurações de intervalo e lote apenas para usuários admin */}
        {isAdmin && (
          <>
            <IntervalSettings form={form} />
            <BatchSettings form={form} />
          </>
        )}
        
        <SaveButton isPending={isSubmitting} />
      </form>
    </Form>
  );
}
