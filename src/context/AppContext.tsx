import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════

export interface Contact {
  id: string;
  nome: string;
  apelido: string | null;
  telefone: string;
  telefone2?: string | null;
  email?: string;
  tipo: string;
  canal_origem: string;
  vendedor_id: string;
  ltv: number;
  ticket_medio: number;
  frequencia_dias: number;
  ultima_compra: string;
  score: number;
  plano: "recorrente" | "alto_valor" | "esporadico" | "inativo" | "novo";
  tags: string[];
  status: "online" | "offline";
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: "vendedor" | "gestor";
  avatar_cor: string;
  status: "online" | "offline";
  leads_mes?: number;
  fechados_mes?: number;
  ticket_medio?: number;
  tempo_resposta?: string;
}

export interface Conversation {
  id: string;
  contact_id: string;
  vendedor_id: string | null;
  status: "ativo" | "aguardando" | "bot" | "fechada";
  canal: string;
  bot_ativo: boolean;
  deal_id: string | null;
  ultima_mensagem: string;
  ultima_mensagem_hora: string;
  nao_lidas: number;
  aberta_em: string;
}

export interface Deal {
  id: string;
  contact_id: string;
  vendedor_id: string;
  conversation_id: string | null;
  status: "novo_lead" | "em_atendimento" | "proposta_aberta" | "aguardando" | "fechado_ganho" | "fechado_perdido";
  valor: number;
  produto_principal: string;
  produtos: string[];
  origem: string;
  created_at: string;
  dias_na_etapa: number;
  observacao: string | null;
  motivo?: string;
}

export interface Message {
  id: string;
  de: "cliente" | "vendedor" | "bot" | "sistema";
  texto: string;
  hora: string;
  tipo: "texto" | "audio" | "sistema";
  duracao?: string;
  sistema_texto?: string;
}

// ═══════════════════════════════════════
// DATA
// ═══════════════════════════════════════

const contacts: Contact[] = [
  { id: "c1", nome: "João Silva", apelido: "Seu João", telefone: "(11) 99234-5678", email: "joao@email.com", tipo: "Construtor", canal_origem: "Meta Ads", vendedor_id: "v1", ltv: 47200, ticket_medio: 9440, frequencia_dias: 38, ultima_compra: "2024-10-15", score: 78, plano: "recorrente", tags: ["Alto Valor","Recorrente","Paga à vista"], status: "online" },
  { id: "c2", nome: "Construtora Alfa Ltda", apelido: null, telefone: "(11) 98765-4321", tipo: "Empreiteiro", canal_origem: "Indicação", vendedor_id: "v2", ltv: 184000, ticket_medio: 36800, frequencia_dias: 21, ultima_compra: "2024-11-12", score: 94, plano: "alto_valor", tags: ["VIP","Alto Valor","PJ"], status: "offline" },
  { id: "c3", nome: "Roberto Pedreiro", apelido: "Robertão", telefone: "(11) 97654-3210", tipo: "Pedreiro", canal_origem: "WhatsApp", vendedor_id: "v1", ltv: 8400, ticket_medio: 2800, frequencia_dias: 72, ultima_compra: "2024-09-28", score: 42, plano: "esporadico", tags: ["Esporádico"], status: "offline" },
  { id: "c4", nome: "Maria Arquiteta", apelido: null, telefone: "(11) 96543-2109", tipo: "Arquiteto", canal_origem: "Instagram", vendedor_id: "v4", ltv: 62800, ticket_medio: 12560, frequencia_dias: 45, ultima_compra: "2024-11-08", score: 85, plano: "recorrente", tags: ["Recorrente","Alto Valor"], status: "online" },
  { id: "c5", nome: "Pedro Mestre", apelido: "Pedro", telefone: "(11) 95432-1098", tipo: "Mestre de obras", canal_origem: "Indicação", vendedor_id: "v1", ltv: 24000, ticket_medio: 8000, frequencia_dias: 55, ultima_compra: "2024-10-22", score: 67, plano: "esporadico", tags: ["Construtor"], status: "online" },
  { id: "c6", nome: "Obra Vila Nova", apelido: null, telefone: "(11) 94321-0987", tipo: "Empreiteiro", canal_origem: "Meta Ads", vendedor_id: "v3", ltv: 312000, ticket_medio: 52000, frequencia_dias: 14, ultima_compra: "2024-11-14", score: 97, plano: "alto_valor", tags: ["VIP","Alto Valor"], status: "offline" },
];

const users: User[] = [
  { id: "v1", nome: "Carlos Silva", email: "carlos@loja.com", role: "vendedor", avatar_cor: "#6366F1", status: "online", leads_mes: 89, fechados_mes: 28, ticket_medio: 18400, tempo_resposta: "4min" },
  { id: "v2", nome: "Ana Oliveira", email: "ana@loja.com", role: "vendedor", avatar_cor: "#0F766E", status: "online", leads_mes: 67, fechados_mes: 19, ticket_medio: 12200, tempo_resposta: "8min" },
  { id: "v3", nome: "Ricardo Santos", email: "ricardo@loja.com", role: "vendedor", avatar_cor: "#EAB308", status: "offline", leads_mes: 54, fechados_mes: 14, ticket_medio: 9800, tempo_resposta: "12min" },
  { id: "v4", nome: "Fernanda Lima", email: "fernanda@loja.com", role: "vendedor", avatar_cor: "#F97316", status: "offline", leads_mes: 41, fechados_mes: 10, ticket_medio: 7100, tempo_resposta: "18min" },
  { id: "g1", nome: "Carlos Gestor", email: "gestor@loja.com", role: "gestor", avatar_cor: "#F97316", status: "online" },
];

const initialConversations: Conversation[] = [
  { id: "conv1", contact_id: "c1", vendedor_id: "v1", status: "ativo", canal: "whatsapp", bot_ativo: false, deal_id: "d1", ultima_mensagem: "Pode confirmar o prazo de entrega?", ultima_mensagem_hora: "14:46", nao_lidas: 2, aberta_em: "2024-10-11T09:14:00" },
  { id: "conv2", contact_id: "c2", vendedor_id: "v2", status: "aguardando", canal: "whatsapp", bot_ativo: false, deal_id: "d2", ultima_mensagem: "qual prazo de entrega do vergalhão?", ultima_mensagem_hora: "há 47 min", nao_lidas: 3, aberta_em: "2024-11-12T08:30:00" },
  { id: "conv3", contact_id: "c3", vendedor_id: "v1", status: "ativo", canal: "whatsapp", bot_ativo: true, deal_id: "d3", ultima_mensagem: "vocês têm porcelanato 60x60 retificado?", ultima_mensagem_hora: "11:22", nao_lidas: 0, aberta_em: "2024-11-13T11:20:00" },
  { id: "conv4", contact_id: "c4", vendedor_id: "v4", status: "ativo", canal: "whatsapp", bot_ativo: false, deal_id: "d4", ultima_mensagem: "quero ver o catálogo de revestimentos", ultima_mensagem_hora: "09:15", nao_lidas: 1, aberta_em: "2024-11-14T09:10:00" },
  { id: "conv5", contact_id: "c5", vendedor_id: "v1", status: "aguardando", canal: "whatsapp", bot_ativo: false, deal_id: null, ultima_mensagem: "preciso de orçamento urgente pra amanhã", ultima_mensagem_hora: "há 31 min", nao_lidas: 1, aberta_em: "2024-11-14T13:28:00" },
  { id: "conv6", contact_id: "c6", vendedor_id: null, status: "aguardando", canal: "whatsapp", bot_ativo: false, deal_id: "d5", ultima_mensagem: "preciso do vergalhão urgente hoje", ultima_mensagem_hora: "há 1h 23min", nao_lidas: 4, aberta_em: "2024-11-14T12:00:00" },
];

const initialDeals: Deal[] = [
  { id: "d1", contact_id: "c1", vendedor_id: "v1", conversation_id: "conv1", status: "proposta_aberta", valor: 26050, produto_principal: "Cimento CP-II + Vergalhão 8mm", produtos: ["Cimento CP-II 50kg","Vergalhão CA-50 8mm"], origem: "Meta Ads", created_at: "2024-10-10", dias_na_etapa: 3, observacao: "5% desconto à vista combinado" },
  { id: "d2", contact_id: "c2", vendedor_id: "v2", conversation_id: "conv2", status: "em_atendimento", valor: 84000, produto_principal: "Porcelanato completo", produtos: ["Porcelanato 60x60 Ret."], origem: "Indicação", created_at: "2024-11-10", dias_na_etapa: 2, observacao: null },
  { id: "d3", contact_id: "c3", vendedor_id: "v1", conversation_id: "conv3", status: "novo_lead", valor: 4200, produto_principal: "Areia + Brita", produtos: ["Areia Lavada Média","Brita 1"], origem: "WhatsApp", created_at: "2024-11-13", dias_na_etapa: 1, observacao: null },
  { id: "d4", contact_id: "c4", vendedor_id: "v4", conversation_id: "conv4", status: "em_atendimento", valor: 31500, produto_principal: "Revestimento externo", produtos: ["Porcelanato 60x60 Ret.","Rejunte"], origem: "Instagram", created_at: "2024-11-12", dias_na_etapa: 2, observacao: null },
  { id: "d5", contact_id: "c6", vendedor_id: "v3", conversation_id: "conv6", status: "aguardando", valor: 142000, produto_principal: "Material completo obra", produtos: ["Cimento CP-II","Vergalhão","Areia","Brita"], origem: "Indicação", created_at: "2024-11-08", dias_na_etapa: 6, observacao: "Cliente aguardando confirmação de prazo" },
  { id: "d6", contact_id: "c5", vendedor_id: "v1", conversation_id: "conv5", status: "novo_lead", valor: 24000, produto_principal: "Vergalhão CA-50 5 ton", produtos: ["Vergalhão CA-50 10mm"], origem: "Balcão", created_at: "2024-11-14", dias_na_etapa: 0, observacao: null },
  { id: "d7", contact_id: "c1", vendedor_id: "v1", conversation_id: null, status: "fechado_ganho", valor: 8400, produto_principal: "Porcelanato 60x60", produtos: ["Porcelanato 60x60 Ret."], origem: "Meta Ads", created_at: "2024-09-12", dias_na_etapa: 0, observacao: null },
  { id: "d8", contact_id: "c2", vendedor_id: "v2", conversation_id: null, status: "fechado_ganho", valor: 84000, produto_principal: "Porcelanato completo", produtos: ["Porcelanato 60x60 Ret."], origem: "Indicação", created_at: "2024-10-15", dias_na_etapa: 0, observacao: null },
  { id: "d9", contact_id: "c3", vendedor_id: "v3", conversation_id: null, status: "fechado_perdido", valor: 45000, produto_principal: "Material geral", produtos: [], origem: "Meta Ads", created_at: "2024-10-20", dias_na_etapa: 0, observacao: null, motivo: "Preço" },
];

const initialMessages: Record<string, Message[]> = {
  conv1: [
    { id: "m1", de: "cliente", texto: "Bom dia! Preciso de orçamento para 500 sacos de cimento CP-II e 2 toneladas de vergalhão 8mm. É para obra residencial.", hora: "09:14", tipo: "texto" },
    { id: "m2", de: "vendedor", texto: "Bom dia, João! Claro, vou verificar a disponibilidade agora.", hora: "09:16", tipo: "texto" },
    { id: "m3", de: "vendedor", texto: "Cimento CP-II 50kg: R$ 32,90/saco. 500 sacos = R$ 16.450. Vergalhão 8mm: R$ 4,80/kg, 2 ton = R$ 9.600. Total: R$ 26.050 + frete.", hora: "09:17", tipo: "texto" },
    { id: "m4", de: "cliente", texto: "Tem desconto para pagamento à vista?", hora: "09:22", tipo: "texto" },
    { id: "m5", de: "vendedor", texto: "Para pagamento à vista, consigo 5% de desconto. Total final: R$ 24.747,50 com frete grátis.", hora: "09:23", tipo: "texto" },
    { id: "m6", de: "cliente", texto: "", hora: "09:28", tipo: "audio", duracao: "0:34" },
    { id: "m7", de: "vendedor", texto: "Perfeito! Para fechar, preciso do endereço da obra e CNPJ para a nota fiscal.", hora: "09:31", tipo: "texto" },
    { id: "m8", de: "cliente", texto: "Rua das Flores, 234 — Vila Nova. CPF: 123.456.789-00", hora: "09:45", tipo: "texto" },
    { id: "m9", de: "cliente", texto: "Pode confirmar o prazo de entrega?", hora: "14:46", tipo: "texto" },
  ],
  conv2: [
    { id: "m1", de: "cliente", texto: "Bom dia, qual o prazo de entrega do vergalhão CA-50?", hora: "08:30", tipo: "texto" },
    { id: "m2", de: "bot", texto: "Olá! Nosso prazo de entrega para vergalhão é de 1 a 2 dias úteis para sua região. Qual a quantidade que você precisa?", hora: "08:30", tipo: "texto" },
    { id: "m3", de: "cliente", texto: "Preciso de 5 toneladas de 10mm e 3 toneladas de 8mm para obra em São Paulo", hora: "08:35", tipo: "texto" },
    { id: "m4", de: "sistema", texto: "IA transferiu para Ana Oliveira", hora: "08:35", tipo: "sistema" },
  ],
  conv3: [
    { id: "m1", de: "cliente", texto: "Vocês têm porcelanato 60x60 retificado? Preciso pra cozinha e sala.", hora: "11:20", tipo: "texto" },
    { id: "m2", de: "bot", texto: "Temos sim! Porcelanato 60x60 Retificado a R$ 89,90/m². Qual a metragem que você precisa?", hora: "11:21", tipo: "texto" },
  ],
  conv4: [
    { id: "m1", de: "cliente", texto: "Bom dia! Quero ver o catálogo de revestimentos para fachada.", hora: "09:10", tipo: "texto" },
    { id: "m2", de: "vendedor", texto: "Bom dia Maria! Temos porcelanato e cerâmica para fachada. Vou te enviar o catálogo.", hora: "09:15", tipo: "texto" },
  ],
  conv5: [
    { id: "m1", de: "cliente", texto: "Boa tarde! Preciso de orçamento urgente pra amanhã cedo de vergalhão CA-50 5 toneladas 10mm", hora: "13:28", tipo: "texto" },
    { id: "m2", de: "cliente", texto: "é pra começar concretagem amanhã de manhã", hora: "13:29", tipo: "texto" },
  ],
  conv6: [
    { id: "m1", de: "cliente", texto: "Preciso do vergalhão urgente hoje! Obra parou esperando material", hora: "12:00", tipo: "texto" },
    { id: "m2", de: "cliente", texto: "alguém me atende??", hora: "12:22", tipo: "texto" },
    { id: "m3", de: "cliente", texto: "vou ter que ligar pra outro lugar", hora: "12:45", tipo: "texto" },
    { id: "m4", de: "cliente", texto: "última chance, me respondem ou vou buscar em outro lugar", hora: "13:38", tipo: "texto" },
  ],
};

// ═══════════════════════════════════════
// PIPELINE COLUMN CONFIG
// ═══════════════════════════════════════

export const pipelineColumns: { key: Deal["status"]; label: string; dotColor: string }[] = [
  { key: "novo_lead", label: "Novo Lead", dotColor: "#6366F1" },
  { key: "em_atendimento", label: "Em Atendimento", dotColor: "#F97316" },
  { key: "proposta_aberta", label: "Proposta Aberta", dotColor: "#EAB308" },
  { key: "aguardando", label: "Aguardando", dotColor: "#8892A4" },
  { key: "fechado_ganho", label: "Fechado Ganho", dotColor: "#0F766E" },
  { key: "fechado_perdido", label: "Fechado Perdido", dotColor: "#EF4444" },
];

// ═══════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════

interface AppContextType {
  contacts: Contact[];
  users: User[];
  conversations: Conversation[];
  deals: Deal[];
  messages: Record<string, Message[]>;

  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  pipelineHighlightDealId: string | null;
  setPipelineHighlightDealId: (id: string | null) => void;

  // Helpers
  getContact: (id: string) => Contact | undefined;
  getUser: (id: string) => User | undefined;
  getConversationForContact: (contactId: string) => Conversation | undefined;
  getDealsForContact: (contactId: string) => Deal[];

  // Actions
  moverDeal: (dealId: string, novoStatus: Deal["status"]) => void;
  adicionarMensagem: (convId: string, msg: Omit<Message, "id">) => void;
  fecharDeal: (dealId: string, ganho: boolean, motivo?: string) => void;
  transferirConversa: (convId: string, vendedorId: string) => void;
  toggleBotAtivo: (convId: string) => void;
}

const AppContext = createContext<AppContextType>(null!);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [conversationsState, setConversations] = useState(initialConversations);
  const [dealsState, setDeals] = useState(initialDeals);
  const [messagesState, setMessages] = useState(initialMessages);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [pipelineHighlightDealId, setPipelineHighlightDealId] = useState<string | null>(null);

  const getContact = useCallback((id: string) => contacts.find(c => c.id === id), []);
  const getUser = useCallback((id: string) => users.find(u => u.id === id), []);
  const getConversationForContact = useCallback((contactId: string) => conversationsState.find(c => c.contact_id === contactId && c.status !== "fechada"), [conversationsState]);
  const getDealsForContact = useCallback((contactId: string) => dealsState.filter(d => d.contact_id === contactId), [dealsState]);

  const moverDeal = useCallback((dealId: string, novoStatus: Deal["status"]) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: novoStatus, dias_na_etapa: 0 } : d));
  }, []);

  const adicionarMensagem = useCallback((convId: string, msg: Omit<Message, "id">) => {
    const id = `m${Date.now()}`;
    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), { ...msg, id }],
    }));
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, ultima_mensagem: msg.texto || "Áudio", ultima_mensagem_hora: msg.hora, nao_lidas: 0 } : c));
  }, []);

  const fecharDeal = useCallback((dealId: string, ganho: boolean, motivo?: string) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: ganho ? "fechado_ganho" : "fechado_perdido", dias_na_etapa: 0, motivo } : d));
  }, []);

  const transferirConversa = useCallback((convId: string, vendedorId: string) => {
    const user = users.find(u => u.id === vendedorId);
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, vendedor_id: vendedorId } : c));
    if (user) {
      adicionarMensagem(convId, { de: "sistema", texto: `Transferido para ${user.nome}`, hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), tipo: "sistema" });
    }
  }, [adicionarMensagem]);

  const toggleBotAtivo = useCallback((convId: string) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, bot_ativo: !c.bot_ativo } : c));
  }, []);

  return (
    <AppContext.Provider value={{
      contacts,
      users,
      conversations: conversationsState,
      deals: dealsState,
      messages: messagesState,
      activeConversationId,
      setActiveConversationId,
      pipelineHighlightDealId,
      setPipelineHighlightDealId,
      getContact,
      getUser,
      getConversationForContact,
      getDealsForContact,
      moverDeal,
      adicionarMensagem,
      fecharDeal,
      transferirConversa,
      toggleBotAtivo,
    }}>
      {children}
    </AppContext.Provider>
  );
}
