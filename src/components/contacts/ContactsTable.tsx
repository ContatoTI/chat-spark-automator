
import React, { useState, useMemo } from "react";
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
import { Tag, X, ArrowUp, ArrowDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ContactFormDialog } from "./ContactFormDialog";
import { DeleteContactDialog } from "./DeleteContactDialog";

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  companyId: string | null;
  onRefresh: () => void;
}

type SortConfig = {
  column: string | null;
  direction: 'asc' | 'desc';
};

const tagColors: Record<string, string> = {
  "Teste": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Cliente": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Prospect": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Lead": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Importante": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "Fornecedor": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Parceiro": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "VIP": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
};

export const ContactsTable: React.FC<ContactsTableProps> = ({ 
  contacts, 
  isLoading,
  companyId,
  onRefresh
}) => {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const { tags } = useCompanyTags(companyId);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: 'asc' });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectedContacts(checked ? contacts.map(c => c.id) : []);
  };

  const handleSelectContact = (contactId: number, checked: boolean) => {
    setSelectedContacts(prev => 
      checked ? [...prev, contactId] : prev.filter(id => id !== contactId)
    );
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
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

  const handleSort = (column: string) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts;
    
    if (searchTerm) {
      filtered = contacts.filter(contact => {
        return Object.values(contact).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (sortConfig.column) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = String(a[sortConfig.column!] || '');
        const bValue = String(b[sortConfig.column!] || '');
        
        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      });
    }

    return filtered;
  }, [contacts, searchTerm, sortConfig]);

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

  const getTagColor = (tagName: string) => {
    const companyTag = tags.find(tag => tag.name === tagName);
    if (companyTag && companyTag.color) {
      return companyTag.color;
    }
    
    return tagColors[tagName] || "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
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
              className={cn("flex items-center gap-1", getTagColor(tag))}
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
      
      <div className="p-2 border-b bg-muted/20">
        <Input
          placeholder="Buscar contatos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
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
              <TableHead 
                key={column}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center gap-2">
                  {column}
                  {sortConfig.column === column && (
                    sortConfig.direction === 'asc' ? 
                      <ArrowUp className="h-4 w-4" /> : 
                      <ArrowDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-[80px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="h-24 text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : filteredAndSortedContacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="h-24 text-center">
                Nenhum contato encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedContacts.map((contact) => (
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
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditContact(contact)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteContact(contact)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ContactFormDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        contact={editingContact}
        companyId={companyId}
        onSuccess={onRefresh}
      />

      <DeleteContactDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        contact={contactToDelete}
        companyId={companyId}
        onSuccess={onRefresh}
      />
    </div>
  );
};
