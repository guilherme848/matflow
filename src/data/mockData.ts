export interface Conversa {
  id: number;
  nome: string;
  telefone: string;
  preview: string;
  tempo: string;
  naoLidas: number;
  canal: string;
  vendedor: string;
  status: 'online' | 'offline';
  filtro: 'atendimento' | 'aguardando' | 'bot';
}

export const conversas: Conversa[] = [
  { id: 1, nome: "João Silva", telefone: "(11) 99234-5678", preview: "preciso de 500 sacos de cimento CP-II", tempo: "há 3 min", naoLidas: 2, canal: "WhatsApp", vendedor: "Carlos Silva", status: "online", filtro: "atendimento" },
  { id: 2, nome: "Construtora Alfa Ltda", telefone: "(11) 98765-4321", preview: "qual prazo de entrega do vergalhão?", tempo: "há 8 min", naoLidas: 1, canal: "WhatsApp", vendedor: "Ana Oliveira", status: "online", filtro: "atendimento" },
  { id: 3, nome: "Roberto Pedreiro", telefone: "(11) 97654-3210", preview: "vocês têm porcelanato 60x60 retificado?", tempo: "há 15 min", naoLidas: 0, canal: "WhatsApp", vendedor: "Carlos Silva", status: "offline", filtro: "aguardando" },
  { id: 4, nome: "Maria Arquiteta", telefone: "(11) 96543-2109", preview: "quero ver o catálogo de revestimentos", tempo: "há 22 min", naoLidas: 3, canal: "Instagram", vendedor: "Fernanda Lima", status: "online", filtro: "bot" },
  { id: 5, nome: "Obra Vila Nova", telefone: "(11) 95432-1098", preview: "preciso de orçamento urgente pra amanhã", tempo: "há 30 min", naoLidas: 1, canal: "WhatsApp", vendedor: "Ricardo Santos", status: "online", filtro: "atendimento" },
  { id: 6, nome: "Carlos Mestre", telefone: "(11) 94321-0987", preview: "quanto tá o saco de areia lavada?", tempo: "há 45 min", naoLidas: 0, canal: "WhatsApp", vendedor: "Ana Oliveira", status: "offline", filtro: "bot" },
  { id: 7, nome: "Ana Reformas", telefone: "(11) 93210-9876", preview: "a entrega de ontem veio errada", tempo: "há 1h", naoLidas: 4, canal: "WhatsApp", vendedor: "Carlos Silva", status: "online", filtro: "atendimento" },
  { id: 8, nome: "Pedro Construtor", telefone: "(11) 92109-8765", preview: "tem manta asfáltica em estoque?", tempo: "há 1h 20min", naoLidas: 0, canal: "WhatsApp", vendedor: "Fernanda Lima", status: "offline", filtro: "aguardando" },
  { id: 9, nome: "Loja Materiais Sul", telefone: "(11) 91098-7654", preview: "quero fazer pedido recorrente mensal", tempo: "há 2h", naoLidas: 2, canal: "WhatsApp", vendedor: "Ricardo Santos", status: "online", filtro: "bot" },
  { id: 10, nome: "Marcos Engenheiro", telefone: "(11) 90987-6543", preview: "preciso de NF para obra pública", tempo: "há 2h 30min", naoLidas: 0, canal: "WhatsApp", vendedor: "Ana Oliveira", status: "offline", filtro: "atendimento" },
  { id: 11, nome: "Julia Design", telefone: "(11) 89876-5432", preview: "catálogo de porcelanato para cozinha", tempo: "há 3h", naoLidas: 1, canal: "Instagram", vendedor: "Fernanda Lima", status: "online", filtro: "bot" },
  { id: 12, nome: "Antônio Pedreiro", telefone: "(11) 88765-4321", preview: "vocês parcelam em quantas vezes?", tempo: "há 4h", naoLidas: 0, canal: "WhatsApp", vendedor: "Carlos Silva", status: "offline", filtro: "aguardando" },
];

export interface Mensagem {
  id: number;
  remetente: 'cliente' | 'vendedor' | 'bot' | 'sistema';
  texto: string;
  hora: string;
  audio?: boolean;
  duracao?: string;
}

export const mensagensJoao: Mensagem[] = [
  { id: 1, remetente: "cliente", texto: "Bom dia! Preciso de orçamento para 500 sacos de cimento CP-II e 2 toneladas de vergalhão 8mm. É para obra residencial.", hora: "09:14" },
  { id: 2, remetente: "vendedor", texto: "Bom dia, João! Claro, vou verificar a disponibilidade e já te passo o orçamento.", hora: "09:16" },
  { id: 3, remetente: "vendedor", texto: "Cimento CP-II 50kg: R$ 32,90/saco. 500 sacos = R$ 16.450,00. Vergalhão 8mm: R$ 4,80/kg, 2 ton = R$ 9.600,00. Total: R$ 26.050,00 + frete.", hora: "09:17" },
  { id: 4, remetente: "cliente", texto: "Tem desconto para pagamento à vista?", hora: "09:22" },
  { id: 5, remetente: "vendedor", texto: "Para pagamento à vista, consigo 5% de desconto. Total final: R$ 24.747,50 com frete grátis.", hora: "09:23" },
  { id: 6, remetente: "cliente", texto: "", hora: "09:28", audio: true, duracao: "0:34" },
  { id: 7, remetente: "vendedor", texto: "Perfeito! Para fechar, preciso do endereço da obra e CNPJ para a nota fiscal.", hora: "09:31" },
  { id: 8, remetente: "cliente", texto: "Rua das Flores, 234 — Vila Nova. CNPJ: 12.345.678/0001-90", hora: "09:45" },
  { id: 9, remetente: "cliente", texto: "Pode confirmar o prazo de entrega?", hora: "09:46" },
  { id: 10, remetente: "sistema", texto: "IA assumiu o atendimento", hora: "09:46" },
  { id: 11, remetente: "bot", texto: "Prazo de entrega para sua região: 2 dias úteis. Entrega confirmada para quarta-feira. Posso gerar o pedido agora?", hora: "09:47" },
];

export interface Deal {
  id: number;
  cliente: string;
  empresa?: string;
  valor: number;
  produto: string;
  origem: string;
  vendedor: string;
  tempoEtapa: string;
  diasEtapa: number;
  motivo?: string;
}

export const pipelineData: Record<string, { label: string; color: string; deals: Deal[] }> = {
  novoLead: {
    label: "Novo Lead", color: "info",
    deals: [
      { id: 1, cliente: "João Silva", valor: 26050, produto: "Cimento + Vergalhão", origem: "Meta Ads", vendedor: "Carlos Silva", tempoEtapa: "há 2 dias", diasEtapa: 2 },
      { id: 2, cliente: "Construtora Alfa", empresa: "Construtora Alfa Ltda", valor: 84000, produto: "Porcelanato completo", origem: "Indicação", vendedor: "Ana Oliveira", tempoEtapa: "há 1 dia", diasEtapa: 1 },
      { id: 3, cliente: "Roberto Mestre", valor: 4200, produto: "Areia e Brita", origem: "WhatsApp", vendedor: "Carlos Silva", tempoEtapa: "há 3 dias", diasEtapa: 3 },
      { id: 4, cliente: "Ana Arquiteta", valor: 31500, produto: "Revestimento externo", origem: "Meta Ads", vendedor: "Fernanda Lima", tempoEtapa: "há 4h", diasEtapa: 0 },
    ],
  },
  emAtendimento: {
    label: "Em Atendimento", color: "attention",
    deals: [
      { id: 5, cliente: "Pedro Construtor", valor: 24000, produto: "Vergalhão 10mm 5ton", origem: "Balcão", vendedor: "Carlos Silva", tempoEtapa: "há 1 dia", diasEtapa: 1 },
      { id: 6, cliente: "Maria Reformas", valor: 12800, produto: "Kit banheiro completo", origem: "WhatsApp", vendedor: "Ana Oliveira", tempoEtapa: "há 3 dias", diasEtapa: 3 },
      { id: 7, cliente: "Obra Vila Nova", valor: 32900, produto: "Cimento 1000 sacos", origem: "Meta Ads", vendedor: "Ricardo Santos", tempoEtapa: "há 2 dias", diasEtapa: 2 },
      { id: 8, cliente: "Carlos Empreiteiro", valor: 67000, produto: "Telhas + Estrutura", origem: "Indicação", vendedor: "Carlos Silva", tempoEtapa: "há 6 dias", diasEtapa: 6 },
      { id: 9, cliente: "Luiza Design", valor: 18400, produto: "Porcelanato importado", origem: "Instagram", vendedor: "Fernanda Lima", tempoEtapa: "há 1 dia", diasEtapa: 1 },
    ],
  },
  propostaAberta: {
    label: "Proposta Aberta", color: "warning",
    deals: [
      { id: 10, cliente: "Construtora Beta", empresa: "Construtora Beta Ltda", valor: 142000, produto: "Material completo", origem: "Indicação", vendedor: "Ricardo Santos", tempoEtapa: "há 4 dias", diasEtapa: 4 },
      { id: 11, cliente: "João Pedreiro", valor: 8700, produto: "Cimento + areia", origem: "WhatsApp", vendedor: "Carlos Silva", tempoEtapa: "há 2 dias", diasEtapa: 2 },
      { id: 12, cliente: "Obra Centro", valor: 23500, produto: "Impermeabilização", origem: "Meta Ads", vendedor: "Ana Oliveira", tempoEtapa: "há 7 dias", diasEtapa: 7 },
    ],
  },
  aguardandoCliente: {
    label: "Aguardando Cliente", color: "neutral",
    deals: [
      { id: 13, cliente: "Ricardo Engenheiro", valor: 89000, produto: "Estrutura metálica", origem: "Balcão", vendedor: "Ricardo Santos", tempoEtapa: "há 5 dias", diasEtapa: 5 },
      { id: 14, cliente: "Loja Revenda", valor: 34000, produto: "Compra recorrente", origem: "WhatsApp", vendedor: "Ana Oliveira", tempoEtapa: "há 3 dias", diasEtapa: 3 },
      { id: 15, cliente: "Ana Construtora", valor: 56000, produto: "Acabamento total", origem: "Indicação", vendedor: "Fernanda Lima", tempoEtapa: "há 8 dias", diasEtapa: 8 },
    ],
  },
  fechadoGanho: {
    label: "Fechado Ganho", color: "success",
    deals: [
      { id: 16, cliente: "Construtora Alfa", valor: 84000, produto: "Porcelanato completo", origem: "Indicação", vendedor: "Ana Oliveira", tempoEtapa: "há 1 dia", diasEtapa: 1 },
      { id: 17, cliente: "Pedro Construtor", valor: 24000, produto: "Vergalhão 10mm", origem: "Balcão", vendedor: "Carlos Silva", tempoEtapa: "há 3 dias", diasEtapa: 3 },
      { id: 18, cliente: "João Silva", valor: 26050, produto: "Cimento + Vergalhão", origem: "Meta Ads", vendedor: "Carlos Silva", tempoEtapa: "há 5 dias", diasEtapa: 5 },
      { id: 19, cliente: "Maria Design", valor: 18400, produto: "Porcelanato importado", origem: "Instagram", vendedor: "Fernanda Lima", tempoEtapa: "há 2 dias", diasEtapa: 2 },
    ],
  },
  fechadoPerdido: {
    label: "Fechado Perdido", color: "destructive",
    deals: [
      { id: 20, cliente: "Roberto Obras", valor: 45000, produto: "Material geral", origem: "Meta Ads", vendedor: "Ricardo Santos", tempoEtapa: "há 4 dias", diasEtapa: 4, motivo: "Preço" },
      { id: 21, cliente: "Carlos Mestre", valor: 12000, produto: "Cimento + Areia", origem: "WhatsApp", vendedor: "Ana Oliveira", tempoEtapa: "há 6 dias", diasEtapa: 6, motivo: "Sem resposta" },
    ],
  },
};

export interface Cliente {
  id: number;
  nome: string;
  empresa?: string;
  telefone: string;
  canal: string;
  ltv: number;
  ultimaCompra: string;
  frequencia: string;
  vendedor: string;
  tags: string[];
}

export const clientes: Cliente[] = [
  { id: 1, nome: "João Silva", telefone: "(11) 99234-5678", canal: "Meta Ads", ltv: 47200, ultimaCompra: "há 12 dias", frequencia: "Recorrente", vendedor: "Carlos S.", tags: ["Construtor", "Alto Valor"] },
  { id: 2, nome: "Construtora Alfa Ltda", empresa: "Construtora Alfa Ltda", telefone: "(11) 98765-4321", canal: "Indicação", ltv: 184000, ultimaCompra: "há 3 dias", frequencia: "Alto Valor", vendedor: "Ana O.", tags: ["PJ", "VIP"] },
  { id: 3, nome: "Roberto Pedreiro", telefone: "(11) 97654-3210", canal: "WhatsApp", ltv: 8400, ultimaCompra: "há 28 dias", frequencia: "Esporádico", vendedor: "Carlos S.", tags: ["Pedreiro"] },
  { id: 4, nome: "Maria Arquiteta", telefone: "(11) 96543-2109", canal: "Instagram", ltv: 62800, ultimaCompra: "há 7 dias", frequencia: "Recorrente", vendedor: "Fernanda L.", tags: ["Arquiteta", "Design"] },
  { id: 5, nome: "Obra Vila Nova", empresa: "Obra Vila Nova", telefone: "(11) 95432-1098", canal: "Meta Ads", ltv: 312000, ultimaCompra: "há 1 dia", frequencia: "Alto Valor", vendedor: "Ricardo S.", tags: ["PJ", "VIP", "Construção"] },
  { id: 6, nome: "Carlos Empreiteiro", telefone: "(11) 94321-0987", canal: "Balcão", ltv: 28500, ultimaCompra: "há 45 dias", frequencia: "Esporádico", vendedor: "Ana O.", tags: ["Empreiteiro"] },
  { id: 7, nome: "Luiza Design Studio", empresa: "Luiza Design Studio", telefone: "(11) 93210-9876", canal: "Instagram", ltv: 34200, ultimaCompra: "há 5 dias", frequencia: "Recorrente", vendedor: "Fernanda L.", tags: ["Design", "Acabamento"] },
  { id: 8, nome: "Pedro Mestre Obras", telefone: "(11) 92109-8765", canal: "WhatsApp", ltv: 15600, ultimaCompra: "há 21 dias", frequencia: "Esporádico", vendedor: "Carlos S.", tags: ["Mestre de Obras"] },
  { id: 9, nome: "Construtora Beta", empresa: "Construtora Beta Ltda", telefone: "(11) 91098-7654", canal: "Indicação", ltv: 267000, ultimaCompra: "há 2 dias", frequencia: "Alto Valor", vendedor: "Ricardo S.", tags: ["PJ", "VIP"] },
  { id: 10, nome: "Ana Reformas", telefone: "(11) 90987-6543", canal: "Meta Ads", ltv: 9800, ultimaCompra: "há 60 dias", frequencia: "Inativo", vendedor: "Ana O.", tags: ["Reforma"] },
];

export const vendedoresPerformance = [
  { nome: "Carlos Silva", leads: 89, fechados: 28, tmResposta: "4min", ticketMedio: 18400, melhor: true },
  { nome: "Ana Oliveira", leads: 67, fechados: 19, tmResposta: "8min", ticketMedio: 12200, melhor: false },
  { nome: "Ricardo Santos", leads: 54, fechados: 14, tmResposta: "12min", ticketMedio: 9800, melhor: false },
  { nome: "Fernanda Lima", leads: 41, fechados: 10, tmResposta: "18min", ticketMedio: 7100, melhor: false },
];

export const produtosMaisOrcados = [
  { produto: "Cimento CP-II 50kg", orcamentos: 89, valorMedio: "R$ 32,90" },
  { produto: "Vergalhão 8mm", orcamentos: 67, valorMedio: "R$ 4,80/kg" },
  { produto: "Porcelanato 60x60", orcamentos: 54, valorMedio: "R$ 89,90/m²" },
  { produto: "Tijolo 8 furos", orcamentos: 43, valorMedio: "R$ 0,89/un" },
  { produto: "Areia lavada", orcamentos: 38, valorMedio: "R$ 180,00/m³" },
  { produto: "Manta asfáltica", orcamentos: 29, valorMedio: "R$ 24,50/m²" },
  { produto: "Tinta acrílica 18L", orcamentos: 22, valorMedio: "R$ 189,00" },
  { produto: "Telha metálica", orcamentos: 17, valorMedio: "R$ 45,00/m²" },
];

export const leadsPerDay = [12,8,15,22,19,31,28,24,17,33,29,26,34,34];

export const aguardandoResposta = [
  { nome: "Obra Horizonte", canal: "WhatsApp", tempo: "1h 23min", vendedor: "Sem vendedor", urgente: true },
  { nome: "Pedro Mestre", canal: "WhatsApp", tempo: "47min", vendedor: "Ana Oliveira", urgente: true },
  { nome: "Construtora ABC", canal: "WhatsApp", tempo: "31min", vendedor: "Ricardo Santos", urgente: true },
  { nome: "Maria Arquiteta", canal: "WhatsApp", tempo: "18min", vendedor: "Carlos Silva", urgente: false },
  { nome: "João Reformas", canal: "WhatsApp", tempo: "8min", vendedor: "Fernanda Lima", urgente: false },
];
