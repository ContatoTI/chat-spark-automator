
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { NewCampaignDialog } from "@/components/campaigns/NewCampaignDialog";
import { ContactsSyncDialog } from "@/components/contacts/ContactsSyncDialog";

const Dashboard = () => {
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus contatos e campanhas de WhatsApp
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => setSyncDialogOpen(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar Contatos
            </Button>
            <Button 
              className="w-full sm:w-auto bg-primary"
              onClick={() => setNewCampaignDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Campanha
            </Button>
          </div>
        </div>

        <DashboardStats />

        <div className="mt-4">
          <RecentCampaigns />
        </div>
      </div>
      
      <NewCampaignDialog 
        open={newCampaignDialogOpen} 
        onOpenChange={setNewCampaignDialogOpen} 
      />
      
      <ContactsSyncDialog 
        open={syncDialogOpen} 
        onOpenChange={setSyncDialogOpen} 
      />
    </Layout>
  );
};

export default Dashboard;
