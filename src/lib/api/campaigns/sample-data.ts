
import { Campaign } from "./types";

// Sample campaigns data
export const sampleCampaigns: Campaign[] = [
  {
    nome: "Promoção de Verão",
    data: new Date().toISOString(),
    mensagem01: "Olá! Aproveite nossa promoção de verão com 20% de desconto em todos os produtos.",
    mensagem02: "Oferta válida até o final do mês!",
    mensagem03: null,
    mensagem04: null,
    tipo_midia: "image",
    url_midia: "https://example.com/summer-promo.jpg",
    data_disparo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    producao: false,
    limite_disparos: 2000,
    enviados: 1200,
    empresa_id: '1' // Added empresa_id
  },
  {
    nome: "Lançamento Produto X",
    data: new Date().toISOString(),
    mensagem01: "Estamos lançando nosso novo produto X! Confira as novidades.",
    mensagem02: "Condições especiais para os primeiros compradores.",
    mensagem03: "Garanta o seu com 15% de desconto!",
    mensagem04: null,
    tipo_midia: "video",
    url_midia: "https://example.com/product-x-launch.mp4",
    data_disparo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "scheduled",
    producao: false,
    limite_disparos: 1500,
    enviados: 0,
    empresa_id: '1' // Added empresa_id
  },
  {
    nome: "Pesquisa de Satisfação",
    data: new Date().toISOString(),
    mensagem01: "Gostaríamos de saber sua opinião sobre nossos produtos e serviços.",
    mensagem02: "Responda nossa pesquisa e ganhe um cupom de desconto!",
    mensagem03: null,
    mensagem04: null,
    tipo_midia: "link",
    url_midia: "https://example.com/survey",
    data_disparo: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "failed",
    producao: false,
    limite_disparos: 800,
    enviados: 600,
    empresa_id: '1' // Added empresa_id
  },
  {
    nome: "Atualização do Sistema",
    data: new Date().toISOString(),
    mensagem01: "Informamos que nosso sistema será atualizado no próximo domingo.",
    mensagem02: "O serviço estará indisponível das 2h às 4h da manhã.",
    mensagem03: "Agradecemos sua compreensão.",
    mensagem04: null,
    tipo_midia: null,
    url_midia: null,
    data_disparo: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    producao: true,
    limite_disparos: 3000,
    enviados: 2800,
    empresa_id: '1' // Added empresa_id
  },
  {
    nome: "Convite para Evento",
    data: new Date().toISOString(),
    mensagem01: "Você está convidado para nosso evento anual!",
    mensagem02: "Data: 20 de Dezembro às 19h",
    mensagem03: "Local: Av. Principal, 1000",
    mensagem04: "Confirme sua presença respondendo esta mensagem.",
    tipo_midia: "image",
    url_midia: "https://example.com/event-invite.jpg",
    data_disparo: null,
    status: "draft",
    producao: false,
    limite_disparos: 500,
    enviados: 0,
    empresa_id: '1' // Added empresa_id
  },
  {
    nome: "Confirmação de Pedido",
    data: new Date().toISOString(),
    mensagem01: "Seu pedido #12345 foi confirmado!",
    mensagem02: "Previsão de entrega: 3 dias úteis",
    mensagem03: "Obrigado por comprar conosco!",
    mensagem04: null,
    tipo_midia: null,
    url_midia: null,
    data_disparo: new Date().toISOString(),
    status: "sending",
    producao: true,
    limite_disparos: 1,
    enviados: 0,
    empresa_id: '1' // Added empresa_id
  }
];

