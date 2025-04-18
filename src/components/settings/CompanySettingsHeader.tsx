
import React from "react";
import { Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function CompanySettingsHeader() {
  const { selectedCompany } = useAuth();

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Building2 className="h-8 w-8 text-muted-foreground" />
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações da Empresa</h2>
        {selectedCompany && (
          <p className="text-muted-foreground">
            Gerenciando configurações para empresa: {selectedCompany}
          </p>
        )}
      </div>
    </div>
  );
}
