
import { useState, useMemo } from "react";
import { Contact } from "@/hooks/useContacts";
import { useCompanyTags } from "@/hooks/useCompanyTags";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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

interface UseContactsTableProps {
  contacts: Contact[];
  companyId: string | null;
  onRefresh: () => void;
}

export const useContactsTable = ({ contacts, companyId, onRefresh }: UseContactsTableProps) => {
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

  return {
    selectedContacts,
    searchTerm,
    setSearchTerm,
    sortConfig,
    editingContact,
    isEditDialogOpen,
    setIsEditDialogOpen,
    contactToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    filteredAndSortedContacts,
    handleSelectAll,
    handleSelectContact,
    handleEditContact,
    handleDeleteContact,
    handleApplyTag,
    handleRemoveTag,
    handleSort,
    getColumns,
    getTagColor,
    tags
  };
};
