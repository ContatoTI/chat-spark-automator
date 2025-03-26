
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
import { useForm } from "react-hook-form";
import { createUser } from "@/lib/api/users";
import { toast } from "sonner";

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
};

export const NewUserDialog: React.FC<NewUserDialogProps> = ({ 
  open, 
  onOpenChange,
  onUserCreated 
}) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    }
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      setIsCreating(true);
      console.log("Submetendo novo usuário:", { email: data.email, role: data.role });
      
      if (!data.email || !data.password) {
        toast.error('Dados incompletos', {
          description: 'Email e senha são obrigatórios'
        });
        setIsCreating(false);
        return;
      }
      
      await createUser(data.email, data.password, data.role);
      toast.success('Usuário criado com sucesso', {
        description: `${data.email} foi adicionado como ${data.role === 'admin' ? 'administrador' : 'usuário'}`
      });
      reset();
      onOpenChange(false);
      onUserCreated(); // Atualizar a lista de usuários
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      let errorMessage = 'Tente novamente mais tarde';
      
      // Verificar se é um erro do Supabase
      if (error instanceof Error) {
        // Verificar mensagens específicas de erro
        if (error.message.includes('already been registered')) {
          errorMessage = 'Este email já está registrado no Auth do Supabase';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error('Erro ao criar usuário', { 
        description: errorMessage
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="email@exemplo.com"
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter pelo menos 6 caracteres'
                  }
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', { 
                  required: 'Confirmação de senha é obrigatória',
                  validate: value => value === password || 'As senhas não coincidem'
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                defaultValue="user" 
                onValueChange={(value) => setValue('role', value as 'user' | 'admin')}
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
