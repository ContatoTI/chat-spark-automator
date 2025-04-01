
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { LoadingState } from "@/components/settings/LoadingState";
import { ErrorState } from "@/components/settings/ErrorState";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

  // Se não houver dados, exiba uma mensagem especial sobre as políticas de RLS
  if (!settings) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
          <Alert variant="default" className="mb-6 border-yellow-500 bg-yellow-50 text-yellow-800">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
            <AlertTitle className="text-lg font-semibold mb-2">Configurações não encontradas</AlertTitle>
            <AlertDescription className="text-sm">
              <p className="mb-2">
                Nenhuma configuração foi encontrada no banco de dados. Devido às políticas de segurança (RLS), 
                o sistema não pode criar automaticamente as configurações iniciais.
              </p>
              <p className="mb-2">
                Um administrador do sistema deve inicializar a tabela <strong>AppW_Options</strong> com 
                valores padrão através do painel do Supabase ou usando SQL direto.
              </p>
              <p>
                Verifique a documentação ou contate o suporte técnico para obter o script SQL necessário.
              </p>
            </AlertDescription>
          </Alert>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Verificar novamente
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
