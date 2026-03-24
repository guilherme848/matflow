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
  email?: string;
  cnpj?: string;
  endereco?: string;
  canal: string;
  ltv: number;
  ultimaCompra: string;
  frequencia: string;
  vendedor: string;
  tags: string[];
  clienteDesde?: string;
}

export const clientes: Cliente[] = [
  { id: 1, nome: "João Silva", empresa: "Construções Silva ME", telefone: "(11) 99234-5678", email: "joao@construcoessilva.com.br", cnpj: "12.345.678/0001-90", endereco: "Rua das Flores, 234 — Vila Nova", canal: "Meta Ads", ltv: 47200, ultimaCompra: "há 12 dias", frequencia: "Recorrente", vendedor: "Carlos S.", tags: ["Construtor", "Alto Valor", "Recorrente"], clienteDesde: "15 de janeiro de 2023" },
  { id: 2, nome: "Construtora Alfa Ltda", empresa: "Construtora Alfa Ltda", telefone: "(11) 98765-4321", email: "contato@construtoraalfa.com.br", cnpj: "23.456.789/0001-01", canal: "Indicação", ltv: 184000, ultimaCompra: "há 3 dias", frequencia: "Alto Valor", vendedor: "Ana O.", tags: ["PJ", "VIP"], clienteDesde: "03 de março de 2022" },
  { id: 3, nome: "Roberto Pedreiro", telefone: "(11) 97654-3210", canal: "WhatsApp", ltv: 8400, ultimaCompra: "há 28 dias", frequencia: "Esporádico", vendedor: "Carlos S.", tags: ["Pedreiro"], clienteDesde: "20 de junho de 2023" },
  { id: 4, nome: "Maria Arquiteta", empresa: "MA Design", telefone: "(11) 96543-2109", email: "maria@madesign.com.br", canal: "Instagram", ltv: 62800, ultimaCompra: "há 7 dias", frequencia: "Recorrente", vendedor: "Fernanda L.", tags: ["Arquiteta", "Design"], clienteDesde: "10 de fevereiro de 2023" },
  { id: 5, nome: "Obra Vila Nova", empresa: "Obra Vila Nova", telefone: "(11) 95432-1098", email: "contato@obravilanova.com.br", cnpj: "34.567.890/0001-12", canal: "Meta Ads", ltv: 312000, ultimaCompra: "há 1 dia", frequencia: "Alto Valor", vendedor: "Ricardo S.", tags: ["PJ", "VIP", "Construção"], clienteDesde: "01 de agosto de 2022" },
  { id: 6, nome: "Carlos Empreiteiro", telefone: "(11) 94321-0987", canal: "Balcão", ltv: 28500, ultimaCompra: "há 45 dias", frequencia: "Esporádico", vendedor: "Ana O.", tags: ["Empreiteiro"], clienteDesde: "15 de setembro de 2023" },
  { id: 7, nome: "Luiza Design Studio", empresa: "Luiza Design Studio", telefone: "(11) 93210-9876", email: "luiza@designstudio.com.br", canal: "Instagram", ltv: 34200, ultimaCompra: "há 5 dias", frequencia: "Recorrente", vendedor: "Fernanda L.", tags: ["Design", "Acabamento"], clienteDesde: "22 de abril de 2023" },
  { id: 8, nome: "Pedro Mestre Obras", telefone: "(11) 92109-8765", canal: "WhatsApp", ltv: 15600, ultimaCompra: "há 21 dias", frequencia: "Esporádico", vendedor: "Carlos S.", tags: ["Mestre de Obras"], clienteDesde: "08 de julho de 2023" },
  { id: 9, nome: "Construtora Beta", empresa: "Construtora Beta Ltda", telefone: "(11) 91098-7654", email: "contato@construtorabeta.com.br", cnpj: "45.678.901/0001-23", canal: "Indicação", ltv: 267000, ultimaCompra: "há 2 dias", frequencia: "Alto Valor", vendedor: "Ricardo S.", tags: ["PJ", "VIP"], clienteDesde: "12 de janeiro de 2022" },
  { id: 10, nome: "Ana Reformas", telefone: "(11) 90987-6543", canal: "Meta Ads", ltv: 9800, ultimaCompra: "há 60 dias", frequencia: "Inativo", vendedor: "Ana O.", tags: ["Reforma"], clienteDesde: "30 de outubro de 2023" },
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

// ═══════════════════════════════════════
// CATÁLOGO
// ═══════════════════════════════════════

export interface Produto {
  id: number;
  sku: string;
  nome: string;
  sinonimos: string[];
  categoria: string;
  preco: number;
  unidade: string;
  estoque: number;
  ativo: boolean;
  atualizado: string;
}

export const produtos: Produto[] = [
  { id: 1, sku: "CIM-001", nome: "Cimento CP-II 50kg", sinonimos: ["cimento comum", "cp2", "cimento portland"], categoria: "Cimento", preco: 32.90, unidade: "saco", estoque: 2400, ativo: true, atualizado: "há 2 dias" },
  { id: 2, sku: "VER-008", nome: "Vergalhão CA-50 8mm", sinonimos: ["ferro 8mm", "varão 8mm", "rebar 8mm"], categoria: "Aço", preco: 4.80, unidade: "kg", estoque: 8600, ativo: true, atualizado: "há 1 dia" },
  { id: 3, sku: "POR-001", nome: "Porcelanato 60x60 Ret.", sinonimos: ["porcelanato retificado", "piso 60x60"], categoria: "Piso", preco: 89.90, unidade: "m²", estoque: 340, ativo: true, atualizado: "há 3 dias" },
  { id: 4, sku: "TIJ-001", nome: "Tijolo 8 Furos", sinonimos: ["tijolo comum", "tijolo baiano"], categoria: "Alvenaria", preco: 0.89, unidade: "un", estoque: 48000, ativo: true, atualizado: "há 5 dias" },
  { id: 5, sku: "ARE-001", nome: "Areia Lavada Média", sinonimos: ["areia fina", "areia de rio"], categoria: "Agregados", preco: 180.00, unidade: "m³", estoque: 45, ativo: true, atualizado: "há 1 dia" },
  { id: 6, sku: "BRI-001", nome: "Brita 1", sinonimos: ["pedra britada", "brita comum"], categoria: "Agregados", preco: 210.00, unidade: "m³", estoque: 30, ativo: true, atualizado: "há 2 dias" },
  { id: 7, sku: "MAN-001", nome: "Manta Asfáltica 3mm", sinonimos: ["impermeabilizante", "lona impermeável", "manta betuminosa"], categoria: "Impermeabilização", preco: 24.50, unidade: "m²", estoque: 820, ativo: true, atualizado: "há 4 dias" },
  { id: 8, sku: "TIN-001", nome: "Tinta Acrílica 18L", sinonimos: ["tinta parede", "tinta látex"], categoria: "Tintas", preco: 189.00, unidade: "lata", estoque: 156, ativo: true, atualizado: "há 1 semana" },
  { id: 9, sku: "TEL-001", nome: "Telha Metálica Galv.", sinonimos: ["telha de zinco", "telha ondulada"], categoria: "Cobertura", preco: 45.00, unidade: "m²", estoque: 1200, ativo: true, atualizado: "há 3 dias" },
  { id: 10, sku: "REJ-001", nome: "Rejunte Cinza 1kg", sinonimos: ["rejuntamento", "rejunte"], categoria: "Acabamento", preco: 8.90, unidade: "kg", estoque: 640, ativo: true, atualizado: "há 2 dias" },
  { id: 11, sku: "ARG-001", nome: "Argamassa AC-II 20kg", sinonimos: ["argamassa colante", "ac2"], categoria: "Argamassa", preco: 18.50, unidade: "saco", estoque: 1800, ativo: true, atualizado: "há 1 dia" },
  { id: 12, sku: "TUB-001", nome: "Tubo PVC 100mm 6m", sinonimos: ["cano esgoto 4pol", "tubo esgoto"], categoria: "Hidráulica", preco: 42.00, unidade: "un", estoque: 380, ativo: true, atualizado: "há 5 dias" },
  { id: 13, sku: "CAL-001", nome: "Cal Hidratada 20kg", sinonimos: ["cal", "calzão"], categoria: "Argamassa", preco: 14.90, unidade: "saco", estoque: 920, ativo: true, atualizado: "há 3 dias" },
  { id: 14, sku: "FER-001", nome: "Fio Arame Recozido", sinonimos: ["arame", "arame de amarrar"], categoria: "Aço", preco: 12.80, unidade: "kg", estoque: 2100, ativo: true, atualizado: "há 2 dias" },
  { id: 15, sku: "GES-001", nome: "Gesso 20kg", sinonimos: ["gessão", "pasta de gesso"], categoria: "Acabamento", preco: 16.90, unidade: "saco", estoque: 480, ativo: true, atualizado: "há 4 dias" },
];

// ═══════════════════════════════════════
// DISPAROS
// ═══════════════════════════════════════

export interface Campanha {
  id: number;
  nome: string;
  status: 'enviado' | 'agendado' | 'rascunho';
  enviados?: number;
  entregues?: number;
  lidos?: number;
  respondidos?: number;
  contatos?: number;
  dataEnvio?: string;
  dataAgendamento?: string;
}

export const campanhas: Campanha[] = [
  { id: 1, nome: "Promoção Cimento CP-II — Outubro", status: "enviado", enviados: 847, entregues: 831, lidos: 412, respondidos: 67, dataEnvio: "15/10/2024" },
  { id: 2, nome: "Follow-up Clientes Inativos 90 dias", status: "enviado", enviados: 234, entregues: 228, lidos: 189, respondidos: 41, dataEnvio: "08/10/2024" },
  { id: 3, nome: "Oferta Vergalhão — Black Friday", status: "agendado", contatos: 1240, dataAgendamento: "29/11/2024 às 09:00" },
  { id: 4, nome: "Lembrete orçamentos abertos", status: "rascunho", contatos: 89 },
];

export interface TemplateMensagem {
  id: number;
  nome: string;
  corpo: string;
  categoria: string;
  status: 'aprovado' | 'pendente';
  criadoEm: string;
}

export const templates: TemplateMensagem[] = [
  { id: 1, nome: "Promoção de Produto", corpo: "Oi {{nome}}! Temos uma oferta especial em {{produto}}: {{desconto}} de desconto essa semana. Aproveite! 🏗️", categoria: "Marketing", status: "aprovado", criadoEm: "01/10/2024" },
  { id: 2, nome: "Follow-up de Orçamento", corpo: "Oi {{nome}}, seu orçamento de {{produto}} ainda está disponível. Posso te ajudar a fechar? 😊", categoria: "Vendas", status: "aprovado", criadoEm: "15/09/2024" },
  { id: 3, nome: "Cliente Inativo", corpo: "Sentimos sua falta, {{nome}}! Temos novidades no estoque que podem te interessar. Vem conferir?", categoria: "Reativação", status: "aprovado", criadoEm: "20/09/2024" },
  { id: 4, nome: "Lembrete de Entrega", corpo: "Olá {{nome}}! Sua entrega de {{produto}} está confirmada para {{data}}. Qualquer dúvida, é só chamar!", categoria: "Operacional", status: "aprovado", criadoEm: "05/10/2024" },
];

// ═══════════════════════════════════════
// NOTIFICAÇÕES
// ═══════════════════════════════════════

export interface Notificacao {
  id: number;
  tipo: 'urgente' | 'transferencia' | 'sucesso' | 'relatorio' | 'meta';
  titulo: string;
  subtitulo: string;
  tempo: string;
  lida: boolean;
  acao?: string;
  acaoLabel?: string;
}

export const notificacoes: Notificacao[] = [
  { id: 1, tipo: "urgente", titulo: "Lead aguardando há 47 min sem resposta", subtitulo: "Obra Vila Nova — WhatsApp", tempo: "há 5 min", lida: false, acao: "/conversas", acaoLabel: "Assumir agora" },
  { id: 2, tipo: "transferencia", titulo: "Agente transferiu conversa para você", subtitulo: "João Silva perguntou sobre vergalhão CA-50", tempo: "há 12 min", lida: false, acao: "/conversas", acaoLabel: "Ver conversa" },
  { id: 3, tipo: "sucesso", titulo: "Ricardo Santos fechou deal de R$ 24.000", subtitulo: "Construtora Beta — Vergalhão + Cimento", tempo: "há 1h", lida: false },
  { id: 4, tipo: "relatorio", titulo: "Resumo do dia anterior disponível", subtitulo: "31 leads · 8 fechados · R$ 142k pipeline", tempo: "hoje às 08:00", lida: true, acao: "/dashboard", acaoLabel: "Ver dashboard" },
  { id: 5, tipo: "meta", titulo: "Equipe atingiu 80% da meta mensal", subtitulo: "Faltam R$ 48.000 para bater a meta", tempo: "ontem", lida: true },
];

// ═══════════════════════════════════════
// PERFIL DO CLIENTE (dados extras)
// ═══════════════════════════════════════

export const historicoConversasJoao = [
  { id: 1, data: "15/10/2024 — 09:14", duracao: "32 min", vendedor: "Carlos Silva", status: "Fechada" as const, preview: "Orçamento de cimento e vergalhão aprovado" },
  { id: 2, data: "12/09/2024 — 14:30", duracao: "18 min", vendedor: "Ana Oliveira", status: "Fechada" as const, preview: "Pedido de porcelanato 60x60 retificado" },
  { id: 3, data: "28/08/2024 — 10:00", duracao: "45 min", vendedor: "Carlos Silva", status: "Transferida" as const, preview: "Cotação de areia e brita para laje" },
  { id: 4, data: "05/07/2024 — 16:22", duracao: "12 min", vendedor: "Carlos Silva", status: "Bot" as const, preview: "Consulta sobre manta asfáltica disponível" },
  { id: 5, data: "18/05/2024 — 11:05", duracao: "28 min", vendedor: "Fernanda Lima", status: "Fechada" as const, preview: "Compra de tintas e rejunte para acabamento" },
];

export const historicoComprasJoao = [
  { data: "15/10/24", produtos: "Cimento + Vergalhão", valor: 26050, vendedor: "Carlos S." },
  { data: "12/09/24", produtos: "Porcelanato 60x60", valor: 8400, vendedor: "Ana O." },
  { data: "28/08/24", produtos: "Areia + Brita", valor: 3200, vendedor: "Carlos S." },
  { data: "05/07/24", produtos: "Manta Asfáltica", valor: 4800, vendedor: "Carlos S." },
  { data: "18/05/24", produtos: "Tintas + Rejunte", valor: 4750, vendedor: "Fernanda L." },
];

export const anotacoesJoao = [
  { data: "15/10", autor: "Carlos S.", texto: "Cliente prefere entrega às terças-feiras pela manhã" },
  { data: "02/09", autor: "Ana O.", texto: "CNPJ para obra pública — exige NF separada" },
];

export const dealsAtivosJoao = [
  { titulo: "Vergalhão CA-50 — 2 ton", status: "Proposta Aberta", valor: 9600, tempo: "há 3 dias" },
  { titulo: "Cimento CP-II — 500 sacos", status: "Em Atendimento", valor: 16450, tempo: "há 1 dia" },
];

export const comprasPorMesJoao = [
  { mes: "Mai", valor: 4750 },
  { mes: "Jun", valor: 0 },
  { mes: "Jul", valor: 4800 },
  { mes: "Ago", valor: 3200 },
  { mes: "Set", valor: 8400 },
  { mes: "Out", valor: 26050 },
];

// ═══════════════════════════════════════
// CONFIGURAÇÕES — Equipe
// ═══════════════════════════════════════

export const equipe = [
  { id: 1, nome: "Carlos Silva", email: "carlos@loja.com.br", perfil: "Gestor" as const, status: "online" as const, ultimoAcesso: "—" },
  { id: 2, nome: "Ana Oliveira", email: "ana@loja.com.br", perfil: "Vendedor" as const, status: "online" as const, ultimoAcesso: "—" },
  { id: 3, nome: "Ricardo Santos", email: "ricardo@loja.com.br", perfil: "Vendedor" as const, status: "offline" as const, ultimoAcesso: "há 2h" },
  { id: 4, nome: "Fernanda Lima", email: "fernanda@loja.com.br", perfil: "Vendedor" as const, status: "offline" as const, ultimoAcesso: "há 1 dia" },
];

export const aberturasCumulativas = [0, 18, 31, 40, 46, 49, 49];
export const horasAbertura = ["0h", "1h", "3h", "6h", "12h", "24h", "48h"];

// ═══════════════════════════════════════
// MOCK USER
// ═══════════════════════════════════════

export const mockUser = {
  nome: "Carlos Silva",
  loja: "Materiais Silva",
  plano: "pro" as "pro" | "base",
  firstAccess: false,
  role: "gestor" as "gestor" | "admin",
};

// ═══════════════════════════════════════
// MASTER PANEL DATA
// ═══════════════════════════════════════

export const masterMRRData = [
  { mes: "Jan", mrr: 8400 }, { mes: "Fev", mrr: 10200 }, { mes: "Mar", mrr: 11800 },
  { mes: "Abr", mrr: 13400 }, { mes: "Mai", mrr: 15600 }, { mes: "Jun", mrr: 17200 },
  { mes: "Jul", mrr: 19800 }, { mes: "Ago", mrr: 21400 }, { mes: "Set", mrr: 23100 },
  { mes: "Out", mrr: 25600 }, { mes: "Nov", mrr: 27200 }, { mes: "Dez", mrr: 28400 },
];

export const masterPlanoDistribuicao = [
  { name: "Plano Pro (IA)", value: 22, color: "#F97316" },
  { name: "Plano Base", value: 13, color: "#5D6B82" },
];

export interface Tenant {
  id: number;
  loja: string;
  plano: "Pro" | "Base";
  mrr: number;
  leadsMes: number;
  conversao: number;
  status: "Ativo" | "Trial";
  desde: string;
  logins30d?: number;
  mensagens?: number;
  usuarios?: number;
  whatsappConectado?: boolean;
  ultimoAcesso?: string;
}

export const tenants: Tenant[] = [
  { id: 1, loja: "Materiais Silva", plano: "Pro", mrr: 980, leadsMes: 847, conversao: 34, status: "Ativo", desde: "jan/24", logins30d: 87, mensagens: 2340, usuarios: 4, whatsappConectado: true, ultimoAcesso: "Agora" },
  { id: 2, loja: "Casa & Obra Ltda", plano: "Pro", mrr: 980, leadsMes: 634, conversao: 28, status: "Ativo", desde: "fev/24", logins30d: 65, mensagens: 1890, usuarios: 3, whatsappConectado: true, ultimoAcesso: "há 1h" },
  { id: 3, loja: "Depósito Central", plano: "Base", mrr: 490, leadsMes: 312, conversao: 19, status: "Ativo", desde: "mar/24", logins30d: 42, mensagens: 980, usuarios: 2, whatsappConectado: true, ultimoAcesso: "há 3h" },
  { id: 4, loja: "MatCon Nordeste", plano: "Pro", mrr: 980, leadsMes: 1243, conversao: 41, status: "Ativo", desde: "jan/24", logins30d: 112, mensagens: 3450, usuarios: 6, whatsappConectado: true, ultimoAcesso: "Agora" },
  { id: 5, loja: "Construfácil", plano: "Base", mrr: 490, leadsMes: 189, conversao: 15, status: "Ativo", desde: "abr/24", logins30d: 28, mensagens: 560, usuarios: 2, whatsappConectado: false, ultimoAcesso: "há 2 dias" },
  { id: 6, loja: "Obras & Cia", plano: "Pro", mrr: 980, leadsMes: 567, conversao: 31, status: "Ativo", desde: "mai/24", logins30d: 54, mensagens: 1670, usuarios: 3, whatsappConectado: true, ultimoAcesso: "há 30min" },
  { id: 7, loja: "Depósito Novo", plano: "Base", mrr: 490, leadsMes: 98, conversao: 12, status: "Trial", desde: "nov/24", logins30d: 15, mensagens: 210, usuarios: 1, whatsappConectado: true, ultimoAcesso: "há 1 dia" },
  { id: 8, loja: "MatBom", plano: "Pro", mrr: 980, leadsMes: 423, conversao: 26, status: "Trial", desde: "nov/24", logins30d: 33, mensagens: 890, usuarios: 2, whatsappConectado: true, ultimoAcesso: "há 4h" },
];

export const cobrancasMes = [
  { loja: "Materiais Silva", plano: "Pro", valor: 980, status: "Pago" as const, vencimento: "05/12" },
  { loja: "Casa & Obra Ltda", plano: "Pro", valor: 980, status: "Pago" as const, vencimento: "05/12" },
  { loja: "Depósito Central", plano: "Base", valor: 490, status: "Pago" as const, vencimento: "10/12" },
  { loja: "MatCon Nordeste", plano: "Pro", valor: 980, status: "Pago" as const, vencimento: "05/12" },
  { loja: "Construfácil", plano: "Base", valor: 490, status: "Pendente" as const, vencimento: "15/12" },
  { loja: "Obras & Cia", plano: "Pro", valor: 980, status: "Pago" as const, vencimento: "05/12" },
  { loja: "Depósito Novo", plano: "Base", valor: 490, status: "Pendente" as const, vencimento: "20/12" },
  { loja: "MatBom", plano: "Pro", valor: 980, status: "Pago" as const, vencimento: "10/12" },
];

// ═══════════════════════════════════════
// LTV POR CANAL
// ═══════════════════════════════════════

export const ltvPorCanal = [
  { canal: "Meta Ads", ltv: 18400, clientes: 847, conversao: 34 },
  { canal: "Indicação", ltv: 31200, clientes: 234, conversao: 51, melhor: true },
  { canal: "WhatsApp Orgânico", ltv: 12800, clientes: 412, conversao: 28 },
  { canal: "Balcão / Presencial", ltv: 24600, clientes: 189, conversao: 43 },
  { canal: "Instagram", ltv: 9200, clientes: 97, conversao: 19 },
];

export const ltvCanalTabela = [
  { canal: "Meta Ads", clientes: 847, ltv: 18400, ticketMedio: 4200, frequencia: "a cada 45 dias", conversao: "34%", custoLead: "R$ 12,50" },
  { canal: "Indicação", clientes: 234, ltv: 31200, ticketMedio: 8900, frequencia: "a cada 28 dias", conversao: "51%", custoLead: "R$ 0,00" },
  { canal: "WhatsApp Orgânico", clientes: 412, ltv: 12800, ticketMedio: 3100, frequencia: "a cada 52 dias", conversao: "28%", custoLead: "R$ 0,00" },
  { canal: "Balcão / Presencial", clientes: 189, ltv: 24600, ticketMedio: 6800, frequencia: "a cada 35 dias", conversao: "43%", custoLead: "R$ 0,00" },
  { canal: "Instagram", clientes: 97, ltv: 9200, ticketMedio: 2400, frequencia: "a cada 60 dias", conversao: "19%", custoLead: "R$ 8,90" },
];

// ═══════════════════════════════════════
// FOLLOW-UPS
// ═══════════════════════════════════════

export interface FollowUp {
  id: number;
  cliente: string;
  empresa?: string;
  produto: string;
  valor: number;
  vendedor: string;
  tipo: "d1" | "d3" | "d7";
  ultimaMensagem: string;
  tempoOrcamento: string;
}

export const followUps: FollowUp[] = [
  { id: 1, cliente: "João Silva", produto: "Cimento + Vergalhão", valor: 26050, vendedor: "Carlos Silva", tipo: "d1", ultimaMensagem: "Vou analisar o orçamento e te retorno", tempoOrcamento: "Orçamento enviado há 1 dia" },
  { id: 2, cliente: "Construtora Alfa", empresa: "Construtora Alfa Ltda", produto: "Porcelanato", valor: 84000, vendedor: "Ana Oliveira", tipo: "d1", ultimaMensagem: "Preciso verificar com o engenheiro", tempoOrcamento: "Orçamento enviado há 1 dia" },
  { id: 3, cliente: "Pedro Mestre", produto: "Areia + Brita", valor: 4200, vendedor: "Carlos Silva", tipo: "d1", ultimaMensagem: "Vou confirmar a quantidade", tempoOrcamento: "Orçamento enviado há 1 dia" },
  { id: 4, cliente: "Maria Arquiteta", produto: "Revestimentos", valor: 31500, vendedor: "Fernanda Lima", tipo: "d1", ultimaMensagem: "Preciso do catálogo completo", tempoOrcamento: "Orçamento enviado há 1 dia" },
  { id: 5, cliente: "Roberto Pedreiro", produto: "Tijolo + Cimento", valor: 12400, vendedor: "Carlos Silva", tipo: "d3", ultimaMensagem: "Vou pensar e te falo", tempoOrcamento: "Orçamento enviado há 3 dias" },
  { id: 6, cliente: "Obra Centro", produto: "Impermeabilização", valor: 23500, vendedor: "Ana Oliveira", tipo: "d3", ultimaMensagem: "Estou comparando preços", tempoOrcamento: "Orçamento enviado há 3 dias" },
  { id: 7, cliente: "Carlos Mestre", produto: "Areia lavada", valor: 5400, vendedor: "Ricardo Santos", tipo: "d3", ultimaMensagem: "Preciso de mais um orçamento", tempoOrcamento: "Orçamento enviado há 3 dias" },
  { id: 8, cliente: "Luiza Design", produto: "Porcelanato importado", valor: 18400, vendedor: "Fernanda Lima", tipo: "d3", ultimaMensagem: "Vou verificar com a cliente", tempoOrcamento: "Orçamento enviado há 3 dias" },
  { id: 9, cliente: "Marcos Engenheiro", produto: "Estrutura metálica", valor: 67000, vendedor: "Ricardo Santos", tipo: "d3", ultimaMensagem: "Aguardando aprovação do projeto", tempoOrcamento: "Orçamento enviado há 3 dias" },
  { id: 10, cliente: "Ana Reformas", produto: "Kit completo reforma", valor: 15800, vendedor: "Ana Oliveira", tipo: "d7", ultimaMensagem: "Vou dar uma resposta semana que vem", tempoOrcamento: "Orçamento enviado há 7 dias" },
  { id: 11, cliente: "Pedro Construtor", produto: "Vergalhão 10mm", valor: 24000, vendedor: "Carlos Silva", tipo: "d7", ultimaMensagem: "Tô vendo com outro fornecedor", tempoOrcamento: "Orçamento enviado há 7 dias" },
  { id: 12, cliente: "Construtora Beta", produto: "Material completo", valor: 142000, vendedor: "Ricardo Santos", tipo: "d7", ultimaMensagem: "Precisamos renegociar o prazo", tempoOrcamento: "Orçamento enviado há 7 dias" },
];
