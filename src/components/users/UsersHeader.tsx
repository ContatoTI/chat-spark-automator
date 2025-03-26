
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, UserPlus } from "lucide-react";
import { NewUserDialog } from './NewUserDialog';

interface UsersHeaderProps {
  onRefresh: () => void;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({ onRefresh }) => {
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os usuários do sistema
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
            onClick={() => setNewUserDialogOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>
      
      <NewUserDialog 
        open={newUserDialogOpen} 
        onOpenChange={setNewUserDialogOpen}
        onUserCreated={onRefresh}
      />
    </>
  );
};
