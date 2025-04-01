
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { LoadingState } from "@/components/settings/LoadingState";
import { ErrorState } from "@/components/settings/ErrorState";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { toast } from "sonner";

const Settings = () => {
  const { settings, isLoading, error, refetch } = useSettingsForm();

  // Se os dados estão carregando, exiba o componente de carregamento
  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  // Se houver um erro, exiba o componente de erro
  if (error) {
    return (
      <Layout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </Layout>
    );
  }

  // Se não houver dados (embora agora inicializamos com padrões)
  if (!settings) {
    toast.error("Não foi possível carregar as configurações", {
      description: "Verifique se as tabelas do banco de dados foram criadas corretamente"
    });
    
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-semibold mb-4">Configurações indisponíveis</h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar as configurações do sistema.
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Tentar novamente
          </button>
        </div>
      </Layout>
    );
  }

  // Renderiza o formulário com as configurações
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
