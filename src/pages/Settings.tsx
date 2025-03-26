
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { LoadingState } from "@/components/settings/LoadingState";
import { ErrorState } from "@/components/settings/ErrorState";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

const Settings = () => {
  const { settings, isLoading, error, refetch, isError } = useSettingsForm();

  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  // Se houver erro, mostramos o erro mas também oferecemos a opção de editar as configurações com valores padrão
  if (isError) {
    return (
      <Layout>
        <div className="flex flex-col gap-8">
          <SettingsHeader />
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md mb-8">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400 mb-2">
              <Settings2 className="h-5 w-5" />
              <h3 className="font-medium">Aviso: Usando configurações padrão</h3>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-500">
              Não foi possível carregar as configurações do servidor. Você pode editar as configurações padrão abaixo, 
              mas elas podem não ser salvas até que o problema de acesso ao banco de dados seja resolvido.
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Tentar carregar novamente
              </Button>
            </div>
          </div>
          <SettingsForm initialSettings={settings} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <SettingsHeader />
        <SettingsForm initialSettings={settings} />
      </div>
    </Layout>
  );
};

export default Settings;
