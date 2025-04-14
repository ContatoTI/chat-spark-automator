
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createUser } from "@/lib/api/users";
import { toast } from "sonner";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuth } from "@/contexts/AuthContext";

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export const NewUserDialog: React.FC<NewUserDialogProps> = ({ 
  open, 
  onOpenChange,
  onUserCreated 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [companyId, setCompanyId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const { companies } = useCompanies();
  const { isMaster, selectedCompany } = useAuth();
  
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('user');
    setCompanyId('');
    setError('');
  };

  // Initialize companyId with selectedCompany when dialog opens
  React.useEffect(() => {
    if (open && isMaster && selectedCompany) {
      setCompanyId(selectedCompany);
    }
  }, [open, isMaster, selectedCompany]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação simples
    if (!email) {
      setError('Email é obrigatório');
      return;
    }
    
    if (!password) {
      setError('Senha é obrigatória');
      return;
    }
    
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    // Validar se uma empresa foi selecionada (apenas para master)
    if (isMaster && !companyId) {
      setError('Selecione uma empresa');
      return;
    }

    try {
      setIsCreating(true);
      // Use o companyId selecionado para master
      const finalCompanyId = isMaster ? companyId : undefined;
      await createUser(email, password, role, finalCompanyId);
      toast.success('Usuário criado com sucesso');
      resetForm();
      onOpenChange(false);
      onUserCreated();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro desconhecido ao criar usuário');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Adicione um novo usuário ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                value={role} 
                onValueChange={setRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Campo de seleção de empresa apenas para usuários master */}
            {isMaster && (
              <div className="grid gap-2">
                <Label htmlFor="company">Empresa</Label>
                <Select 
                  value={companyId} 
                  onValueChange={setCompanyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Criando...
                </>
              ) : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
