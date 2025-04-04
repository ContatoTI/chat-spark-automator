
import { supabase } from "@/lib/supabase";
import { sampleCampaigns } from "./sample-data";

// Insert sample campaigns if none exist
export const insertSampleCampaigns = async (): Promise<void> => {
  const { data } = await supabase
    .from('AppW_Campanhas')
    .select('*')
    .limit(1);
  
  if (data && data.length > 0) {
    return; // Campaigns already exist
  }
  
  try {
    await supabase.from('AppW_Campanhas').insert(sampleCampaigns);
    console.log('Sample campaigns inserted successfully');
  } catch (error) {
    console.error('Error inserting sample campaigns:', error);
  }
};
