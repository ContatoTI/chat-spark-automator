
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Contact } from "@/hooks/useContacts";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCompanyTags } from "@/hooks/useCompanyTags";
import { Tag, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  companyId: string | null;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ 
  contacts, 
  isLoading,
  companyId
}) => {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const { tags } = useCompanyTags(companyId);
  const queryClient = useQueryClient();

  const handleSelectAll = (checked: boolean) => {
    setSelectedContacts(checked ? contacts.map(c => c.id) : []);
  };

  const handleSelectContact = (contactId: number, checked: boolean) => {
    setSelectedContacts(prev => 
      checked ? [...prev, contactId] : prev.filter(id => id !== contactId)
    );
  };

  const handleApplyTag = async (tagName: string) => {
    if (!companyId || selectedContacts.length === 0) return;

    try {
      const { data: currentContacts, error: fetchError } = await supabase
        .from('appw_lista_' + companyId)
        .select('id, tag')
        .in('id', selectedContacts);

      if (fetchError) throw fetchError;

      const updates = currentContacts.map(contact => {
        const currentTags = contact.tag ? 
          (Array.isArray(contact.tag) ? contact.tag : JSON.parse(contact.tag)) : 
          [];
        
        if (!currentTags.includes(tagName)) {
          currentTags.push(tagName);
        }

        return {
          id: contact.id,
          tag: currentTags
        };
      });

      const { error: updateError } = await supabase
        .from('appw_lista_' + companyId)
        .upsert(updates);

      if (updateError) throw updateError;

      toast.success('Tags atualizadas com sucesso');
      setSelectedContacts([]);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    } catch (error) {
      console.error('Erro ao atualizar tags:', error);
      toast.error('Erro ao atualizar tags dos contatos');
    }
  };

  const handleRemoveTag = async (contactId: number, tagToRemove: string) => {
    if (!companyId) return;

    try {
      const { data: contact, error: fetchError } = await supabase
        .from('appw_lista_' + companyId)
        .select('id, tag')
        .eq('id', contactId)
        .single();

      if (fetchError) throw fetchError;

      const currentTags = contact.tag ? 
        (Array.isArray(contact.tag) ? contact.tag : JSON.parse(contact.tag)) : 
        [];
      
      const updatedTags = currentTags.filter((tag: string) => tag !== tagToRemove);

      const { error: updateError } = await supabase
        .from('appw_lista_' + companyId)
        .update({ tag: updatedTags })
        .eq('id', contactId);

      if (updateError) throw updateError;

      toast.success('Tag removida com sucesso');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    } catch (error) {
      console.error('Erro ao remover tag:', error);
      toast.error('Erro ao remover tag do contato');
    }
  };

  if (contacts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum contato encontrado.</p>
      </div>
    );
  }

  const getColumns = () => {
    const allColumns = new Set<string>();
    contacts.forEach(contact => {
      Object.keys(contact).forEach(key => {
        allColumns.add(key);
      });
    });
    
    const orderedColumns: string[] = [];
    const knownColumns = ["id", "Nome", "Numero", "Enviado", "Nome_Real", "Invalido", "tag"];
    
    knownColumns.forEach(col => {
      if (allColumns.has(col)) {
        orderedColumns.push(col);
        allColumns.delete(col);
      }
    });
    
    return [...orderedColumns, ...Array.from(allColumns)];
  };

  const formatCellValue = (value: any, column: string, contactId: number) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    if (column === "Enviado") {
      return value === true ? (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Sim
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          Não
        </Badge>
      );
    }

    if (column === "Invalido" && value) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          {value}
        </Badge>
      );
    }

    if (column === "tag" && value) {
      const tags = Array.isArray(value) ? value : JSON.parse(value);
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: string, index: number) => (
            <Badge 
              key={`${tag}-${index}`}
              variant="outline" 
              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              {tag}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(contactId, tag);
                }}
                className="ml-1 hover:bg-red-100 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      );
    }

    return String(value);
  };

  const columns = getColumns();

  return (
    <div className="rounded-md border">
      {selectedContacts.length > 0 && (
        <div className="p-2 border-b bg-muted/50 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedContacts.length} contatos selecionados
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Aplicar Tag
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {tags.map((tag) => (
                <DropdownMenuItem key={tag.name} onClick={() => handleApplyTag(tag.name)}>
                  {tag.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                onCheckedChange={handleSelectAll}
                checked={selectedContacts.length === contacts.length && contacts.length > 0}
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column}>
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={`${contact.id}-${column}`}>
                    {formatCellValue(contact[column], column, contact.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
