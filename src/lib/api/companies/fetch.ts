
import { supabase } from "@/lib/supabase";
import { Company } from "./types";

// Função para buscar empresas
export const fetchCompanies = async (empresa_id?: string): Promise<Company[]> => {
  console.log("Buscando empresas", empresa_id ? `para empresa ${empresa_id}` : 'todas');
  
  // Se não houver empresa_id e não for uma busca de todas as empresas ('*'), retorna lista vazia
  if (!empresa_id) {
    console.log("Nenhuma empresa selecionada, retornando lista vazia");
    return [];
  }
  
  try {
    const start = performance.now();
    
    // Query base
    let query = supabase
      .from('AppW_Options')
      .select('empresa_id, nome_da_empresa, created_at')
      .limit(100)
      .order('created_at', { ascending: false });
    
    // Adicionar filtro apenas se não for buscar todas as empresas
    if (empresa_id !== '*') {
      query = query.eq('empresa_id', empresa_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao buscar empresas:", error);
      throw new Error(`Falha ao buscar empresas: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("Nenhuma empresa encontrada");
      return [];
    }
    
    // Remover duplicatas usando Map para melhor performance
    const uniqueCompanies = new Map<string, Company>();
    
    data.forEach(company => {
      if (company.empresa_id && !uniqueCompanies.has(company.empresa_id)) {
        uniqueCompanies.set(company.empresa_id, {
          id: company.empresa_id,
          name: company.nome_da_empresa || 'Empresa sem nome',
          created_at: company.created_at || new Date().toISOString()
        });
      }
    });
    
    const companies = Array.from(uniqueCompanies.values());
    
    const end = performance.now();
    console.log(`Empresas processadas: ${companies.length} em ${(end - start).toFixed(2)}ms`);
    
    return companies;
  } catch (error) {
    console.error("Erro em fetchCompanies:", error);
    throw error;
  }
};
