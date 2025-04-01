
import { createClient } from '@supabase/supabase-js';

// URL e chave anônima do Supabase para o cliente frontend
const supabaseUrl = 'https://supa.falcontruck.com.br/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Also export the URL for direct access
export { supabaseUrl };
