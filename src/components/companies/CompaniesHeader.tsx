
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Building } from "lucide-react";
import { NewCompanyDialog } from './NewCompanyDialog';

interface CompaniesHeaderProps {
  onRefresh: () => void;
}

export const CompaniesHeader: React.FC<CompaniesHeaderProps> = ({ onRefresh }) => {
  const [newCompanyDialogOpen, setNewCompanyDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as empresas do sistema
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={onRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button 
            className="w-full sm:w-auto bg-primary"
            onClick={() => setNewCompanyDialogOpen(true)}
          >
            <Building className="mr-2 h-4 w-4" />
            Nova Empresa
          </Button>
        </div>
      </div>
      
      <NewCompanyDialog 
        open={newCompanyDialogOpen} 
        onOpenChange={setNewCompanyDialogOpen}
        onCompanyCreated={onRefresh}
      />
    </>
  );
};
