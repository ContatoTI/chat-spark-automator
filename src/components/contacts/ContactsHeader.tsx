
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ContactsHeaderProps {
  onCreateList: () => Promise<boolean>;
  onRefresh: () => void;
  tableExists: boolean | null;
  isLoading: boolean;
}

export const ContactsHeader: React.FC<ContactsHeaderProps> = ({
  onCreateList,
  onRefresh,
  tableExists,
  isLoading,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contatos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie sua lista de contatos para campanhas
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {tableExists === false && (
          <Button 
            onClick={onCreateList}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Lista
          </Button>
        )}
        
        {tableExists === true && (
          <Button 
            variant="outline" 
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        )}
      </div>
    </div>
  );
};
