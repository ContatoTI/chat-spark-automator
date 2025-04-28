
import React from "react";
import { Table } from "@/components/ui/table";
import { Contact } from "@/hooks/useContacts";
import { ContactFormDialog } from "./ContactFormDialog";
import { DeleteContactDialog } from "./DeleteContactDialog";
import { ContactsTableHeader } from "./table/ContactsTableHeader";
import { ContactsTableBody } from "./table/ContactsTableBody";
import { ContactsTableToolbar } from "./table/ContactsTableToolbar";
import { useContactsTable } from "./table/useContactsTable";

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  companyId: string | null;
  onRefresh: () => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ 
  contacts, 
  isLoading,
  companyId,
  onRefresh
}) => {
  const {
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
  } = useContactsTable({ contacts, companyId, onRefresh });

  const columns = getColumns();

  return (
    <div className="rounded-md border">
      <ContactsTableToolbar
        selectedContacts={selectedContacts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onApplyTag={handleApplyTag}
        tags={tags}
      />
      
      <Table>
        <ContactsTableHeader
          columns={columns}
          sortConfig={sortConfig}
          onSort={handleSort}
          onSelectAll={handleSelectAll}
          allSelected={selectedContacts.length === contacts.length}
          hasContacts={contacts.length > 0}
        />
        <ContactsTableBody
          contacts={filteredAndSortedContacts}
          columns={columns}
          isLoading={isLoading}
          selectedContacts={selectedContacts}
          handleSelectContact={handleSelectContact}
          getTagColor={getTagColor}
          handleRemoveTag={handleRemoveTag}
          handleEditContact={handleEditContact}
          handleDeleteContact={handleDeleteContact}
        />
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
