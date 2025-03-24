
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { LoadingState } from "@/components/settings/LoadingState";
import { ErrorState } from "@/components/settings/ErrorState";
import { useSettingsForm } from "@/hooks/useSettingsForm";

const Settings = () => {
  const { settings, isLoading, error, refetch } = useSettingsForm();

  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <SettingsHeader />
        <SettingsForm initialSettings={settings!} />
      </div>
    </Layout>
  );
};

export default Settings;
