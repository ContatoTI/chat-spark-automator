
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Plus, MoreHorizontal, Users, Tag } from "lucide-react";
import { ContactsSyncDialog } from "@/components/contacts/ContactsSyncDialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock data for contacts
const mockContacts = [
  { id: 1, name: "João Silva", phone: "+55 11 98765-4321", tags: ["Cliente", "VIP"] },
  { id: 2, name: "Maria Oliveira", phone: "+55 21 98765-4321", tags: ["Fornecedor"] },
  { id: 3, name: "Pedro Santos", phone: "+55 31 98765-4321", tags: ["Cliente"] },
  { id: 4, name: "Ana Costa", phone: "+55 41 98765-4321", tags: ["Prospecto"] },
  { id: 5, name: "Lucas Ferreira", phone: "+55 51 98765-4321", tags: ["Cliente", "Inativo"] },
  { id: 6, name: "Juliana Martins", phone: "+55 61 98765-4321", tags: ["VIP"] },
  { id: 7, name: "Roberto Almeida", phone: "+55 71 98765-4321", tags: ["Fornecedor"] },
  { id: 8, name: "Fernanda Lima", phone: "+55 81 98765-4321", tags: ["Cliente"] },
];

// Tag component
const ContactTag: React.FC<{ label: string }> = ({ label }) => {
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'cliente':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 'vip':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case 'fornecedor':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'prospecto':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case 'inativo':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
      getTagColor(label)
    )}>
      {label}
    </span>
  );
};

const Contacts = () => {
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = searchQuery
    ? mockContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        contact.phone.includes(searchQuery)
      )
    : mockContacts;

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Contatos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus contatos do WhatsApp
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => setSyncDialogOpen(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar
            </Button>
            <Button className="w-full sm:w-auto bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Contato
            </Button>
          </div>
        </div>

        <div className="glass-panel px-4 py-3">
          <div className="flex flex-col md:flex-row gap-4 w-full items-center">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contatos..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 hidden md:flex justify-end">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredContacts.length} de {mockContacts.length} contatos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="card-hover">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>{contact.name}</CardTitle>
                  <CardDescription className="text-sm">{contact.phone}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Editar contato</DropdownMenuItem>
                    <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                    <DropdownMenuItem>Adicionar tag</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mt-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag, index) => (
                      <ContactTag key={index} label={tag} />
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Adicionar a Grupo
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <ContactsSyncDialog 
        open={syncDialogOpen} 
        onOpenChange={setSyncDialogOpen} 
      />
    </Layout>
  );
};

export default Contacts;
