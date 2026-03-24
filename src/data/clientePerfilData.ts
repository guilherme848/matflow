// ═══════════════════════════════════════
// DADOS MOCKADOS PARA PERFIL RICO DO CLIENTE
// ═══════════════════════════════════════

export const obrasMock = [
  {
    id: 1,
    nome: "Casa da Rua das Flores",
    tipo: "Construção" as const,
    endereco: "Rua das Flores, 234 — Vila Nova, São Paulo/SP",
    area: 180,
    comodos: "3 quartos, 2 banheiros, sala, cozinha",
    estagio: "Alvenaria" as const,
    prazo: "Março 2025",
    orcamentoTotal: 120000,
    gastoLoja: 47200,
    ativa: true,
    materiaisComprados: [
      { nome: "Cimento CP-II 50kg", qtd: "500 sacos", valor: 16450 },
      { nome: "Vergalhão CA-50 8mm", qtd: "2.000 kg", valor: 9600 },
      { nome: "Porcelanato 60x60", qtd: "93 m²", valor: 8400 },
      { nome: "Areia Lavada", qtd: "12 m³", valor: 2160 },
      { nome: "Brita 1", qtd: "5 m³", valor: 1050 },
    ],
    materiaisPendentes: [
      { nome: "Tubos PVC 100mm", qtd: "~40 un", valorEstimado: 1680 },
      { nome: "Fios e Cabos Elétricos", qtd: "~200m", valorEstimado: 2400 },
      { nome: "Tinta Acrílica 18L", qtd: "~15 latas", valorEstimado: 2835 },
      { nome: "Portas e Janelas", qtd: "~12 un", valorEstimado: 18000 },
    ],
    notas: "Obra em bom ritmo. Pedreiro Zé é o responsável no local."
  },
  {
    id: 2,
    nome: "Muro e Calçada",
    tipo: "Reforma" as const,
    endereco: "Rua das Flores, 234 — Vila Nova",
    area: 45,
    comodos: "",
    estagio: "Concluída" as const,
    prazo: "Agosto 2024",
    orcamentoTotal: 8000,
    gastoLoja: 3200,
    ativa: false,
    materiaisComprados: [
      { nome: "Areia Lavada", qtd: "4 m³", valor: 720 },
      { nome: "Brita 1", qtd: "3 m³", valor: 630 },
      { nome: "Cimento CP-II 50kg", qtd: "50 sacos", valor: 1645 },
    ],
    materiaisPendentes: [],
    notas: ""
  }
];

export const estagiosObra = [
  "Fundação", "Estrutura", "Alvenaria", "Cobertura",
  "Instalações", "Acabamento", "Concluída"
] as const;

export const tiposObra = ["Construção", "Reforma", "Ampliação", "Acabamento", "Outro"] as const;

export const perfilFinanceiro = {
  limiteCredito: 15000,
  formaPagamento: "Pix" as const,
  historicoCredito: "Sempre em dia" as const,
  mediaDiasPagar: 2,
  descontoMaximo: 5,
  ultimaNegociacao: "15/10/2024 — 5% à vista em cimento",
  scorePagamento: 92,
  criterios: [
    { label: "Nunca atrasou", score: 5 },
    { label: "Paga antes do prazo", score: 4 },
    { label: "Ticket crescente", score: 5 },
    { label: "Recorrência sólida", score: 4 },
    { label: "Volume adequado", score: 3 },
  ],
};

export const evolucaoGasto = [
  { mes: "Jan", valor: 0 },
  { mes: "Fev", valor: 0 },
  { mes: "Mar", valor: 3200 },
  { mes: "Abr", valor: 0 },
  { mes: "Mai", valor: 4750 },
  { mes: "Jun", valor: 0 },
  { mes: "Jul", valor: 4800 },
  { mes: "Ago", valor: 3200 },
  { mes: "Set", valor: 8400 },
  { mes: "Out", valor: 26050 },
];

export const comparativoBase = [
  { label: "LTV", clienteValor: 47200, mediaValor: 12800, ratio: "3.7x acima", percentual: 100 },
  { label: "Ticket Médio", clienteValor: 9440, mediaValor: 5200, ratio: "1.8x acima", percentual: 65 },
  { label: "Frequência", clienteLabel: "38 dias", mediaLabel: "72 dias", ratio: "2x mais frequente", percentual: 80 },
  { label: "Conversão", clienteLabel: "84%", mediaLabel: "31%", ratio: "Top 5% da base", percentual: 95 },
];

export const conversasCliente = [
  {
    id: 1, data: "15/10/2024", hora: "09:14", duracao: "32 min",
    vendedor: "Carlos Silva", badge: "Fechou deal" as const, badgeValor: 26050,
    mensagens: ["Preciso de 500 sacos de cimento...", "Pode confirmar o prazo de entrega?"],
    produtos: ["Cimento CP-II", "Vergalhão 8mm"],
  },
  {
    id: 2, data: "11/10/2024", hora: "16:20", duracao: "18 min",
    vendedor: "Bot + Carlos Silva", badge: "Bot transferiu" as const,
    mensagens: ["Qual preço do vergalhão?", "Preciso de 2 toneladas"],
    produtos: ["Vergalhão 8mm"],
  },
  {
    id: 3, data: "12/09/2024", hora: "14:30", duracao: "45 min",
    vendedor: "Ana Oliveira", badge: "Fechou deal" as const, badgeValor: 8400,
    mensagens: ["Quero ver porcelanato 60x60...", "Tem retificado em estoque?"],
    produtos: ["Porcelanato 60x60"],
  },
  {
    id: 4, data: "28/08/2024", hora: "10:00", duracao: "12 min",
    vendedor: "Carlos Silva", badge: "Follow-up" as const,
    mensagens: ["Preciso de areia e brita para a laje"],
    produtos: ["Areia Lavada", "Brita 1"],
  },
  {
    id: 5, data: "15/01/2024", hora: "08:47", duracao: "8 min",
    vendedor: "Bot", badge: "Primeiro contato" as const,
    mensagens: ["Boa tarde, vi o anúncio de vocês..."],
    produtos: [],
  },
];

export const comprasDetalhadas = [
  {
    data: "15/10/24", produtos: "Cimento CP-II + Vergalhão 8mm", qtdItens: 2,
    valor: 26050, pagamento: "Pix", vendedor: "Carlos S.",
    itens: [
      { nome: "Cimento CP-II 50kg", sku: "CIM-001", qtd: 500, unidade: "sacos", precoUnit: 32.90, subtotal: 16450 },
      { nome: "Vergalhão CA-50 8mm", sku: "VER-008", qtd: 2000, unidade: "kg", precoUnit: 4.80, subtotal: 9600 },
    ],
    desconto: "5% à vista (-R$ 1.302,50)", frete: "Grátis",
  },
  {
    data: "12/09/24", produtos: "Porcelanato 60x60 Ret.", qtdItens: 1,
    valor: 8400, pagamento: "Pix", vendedor: "Ana O.",
    itens: [
      { nome: "Porcelanato 60x60 Ret.", sku: "POR-001", qtd: 93.43, unidade: "m²", precoUnit: 89.90, subtotal: 8400 },
    ],
    desconto: null, frete: "R$ 180,00",
  },
  {
    data: "28/08/24", produtos: "Areia Lavada + Brita 1", qtdItens: 2,
    valor: 3200, pagamento: "À vista", vendedor: "Carlos S.",
    itens: [
      { nome: "Areia Lavada Média", sku: "ARE-001", qtd: 12, unidade: "m³", precoUnit: 180, subtotal: 2160 },
      { nome: "Brita 1", sku: "BRI-001", qtd: 5, unidade: "m³", precoUnit: 210, subtotal: 1050 },
    ],
    desconto: null, frete: "R$ 250,00",
  },
  {
    data: "05/07/24", produtos: "Manta Asfáltica 3mm", qtdItens: 1,
    valor: 4800, pagamento: "30 dias", vendedor: "Carlos S.",
    itens: [
      { nome: "Manta Asfáltica 3mm", sku: "MAN-001", qtd: 195.92, unidade: "m²", precoUnit: 24.50, subtotal: 4800 },
    ],
    desconto: null, frete: "Grátis",
  },
  {
    data: "18/05/24", produtos: "Tinta Acrílica + Rejunte", qtdItens: 2,
    valor: 4750, pagamento: "Pix", vendedor: "Fernanda L.",
    itens: [
      { nome: "Tinta Acrílica 18L", sku: "TIN-001", qtd: 22, unidade: "latas", precoUnit: 189, subtotal: 4158 },
      { nome: "Rejunte Cinza 1kg", sku: "REJ-001", qtd: 66.52, unidade: "kg", precoUnit: 8.90, subtotal: 592 },
    ],
    desconto: null, frete: "R$ 120,00",
  },
];

export const categoriasPie = [
  { name: "Aço", value: 34, fill: "hsl(var(--primary))" },
  { name: "Cimento", value: 28, fill: "hsl(var(--info))" },
  { name: "Piso", value: 18, fill: "hsl(var(--success))" },
  { name: "Outros", value: 20, fill: "hsl(var(--muted-foreground))" },
];

export const preferenciasCliente = {
  marcas: ["Votorantim", "Gerdau", "Eliane"],
  categorias: [
    { nome: "Cimento e Argamassa", ativo: true },
    { nome: "Aço e Vergalhão", ativo: true },
    { nome: "Pisos e Revestimentos", ativo: true },
    { nome: "Hidráulica", ativo: false },
    { nome: "Elétrica", ativo: false },
    { nome: "Impermeabilização", ativo: true },
    { nome: "Cobertura", ativo: false },
    { nome: "Tintas", ativo: false },
  ],
  produtosRecorrentes: [
    { nome: "Cimento CP-II 50kg", vezes: 3 },
    { nome: "Vergalhão CA-50 8mm", vezes: 2 },
    { nome: "Areia Lavada", vezes: 2 },
  ],
  horario: "Manhã" as const,
  canal: "WhatsApp" as const,
  tom: "Informal" as const,
  aceitaPromocoes: true,
  aceitaDisparos: true,
  frequenciaContato: "1x por semana",
};

export const comportamentoCliente = {
  tempoResposta: "~2h",
  taxaFollowUp: 80,
  aberturaCampanhas: 100,
  sensibilidadePreco: 3,
};

export const insightsIA = [
  "Último pico de compra foi em outubro. Histórico sugere nova compra em novembro/dezembro.",
  "Compra principalmente cimento e vergalhão. Nunca comprou hidráulica — oportunidade de oferecer na próxima conversa.",
  "Ticket médio aumentou 40% nas últimas 2 compras. Cliente em expansão da obra.",
  "Indicou Pedro Mestre que já gastou R$ 18.400. Potencial para programa de indicação.",
];

export const timelineCompleta = [
  { data: "15/10/2024", hora: "14:32", tipo: "compra" as const, texto: "Compra fechada R$ 26.050", detalhe: "Cimento + Vergalhão · Carlos S.", valor: 26050 },
  { data: "15/10/2024", hora: "14:15", tipo: "conversa" as const, texto: "Conversa via WhatsApp (32 min)", detalhe: "Bot + Carlos S. · Negociação" },
  { data: "11/10/2024", hora: "11:20", tipo: "followup" as const, texto: "Follow-up D+3 enviado", detalhe: "Carlos S. · sem resposta" },
  { data: "11/10/2024", hora: "09:08", tipo: "followup" as const, texto: "Follow-up D+1 enviado", detalhe: "Carlos S. · Respondeu em 23 min" },
  { data: "10/10/2024", hora: "16:44", tipo: "deal" as const, texto: "Deal criado R$ 26.050 no pipeline", detalhe: "Cimento + Vergalhão" },
  { data: "10/10/2024", hora: "16:20", tipo: "conversa" as const, texto: "Conversa iniciada WhatsApp", detalhe: "João buscando orçamento" },
  { data: "12/09/2024", hora: "14:30", tipo: "compra" as const, texto: "Compra R$ 8.400", detalhe: "Porcelanato 60x60 · Ana O.", valor: 8400 },
  { data: "12/09/2024", hora: "14:00", tipo: "conversa" as const, texto: "Conversa WhatsApp (45 min)", detalhe: "Ana O. · negociação porcelanato" },
  { data: "10/09/2024", hora: "10:00", tipo: "followup" as const, texto: "Follow-up D+1 enviado", detalhe: "Ana O." },
  { data: "28/08/2024", hora: "10:00", tipo: "compra" as const, texto: "Compra R$ 3.200", detalhe: "Areia + Brita · Carlos S.", valor: 3200 },
  { data: "05/07/2024", hora: "15:00", tipo: "compra" as const, texto: "Compra R$ 4.800", detalhe: "Manta Asfáltica · Carlos S.", valor: 4800 },
  { data: "18/05/2024", hora: "11:00", tipo: "compra" as const, texto: "Compra R$ 4.750", detalhe: "Tintas + Rejunte · Fernanda L.", valor: 4750 },
  { data: "15/01/2024", hora: "09:00", tipo: "tag" as const, texto: "Tag 'Recorrente' adicionada", detalhe: "Sistema automático" },
  { data: "15/01/2024", hora: "08:50", tipo: "nota" as const, texto: "Nota: 'Prefere entrega terças'", detalhe: "Carlos S." },
  { data: "15/01/2024", hora: "08:47", tipo: "conversa" as const, texto: "Primeiro contato WhatsApp", detalhe: "Cadastro automático via bot" },
  { data: "15/01/2024", hora: "08:47", tipo: "cadastro" as const, texto: "Cadastro criado automaticamente", detalhe: "Via WhatsApp · Meta Ads" },
];

export const notasEquipe = [
  { id: 1, autor: "Carlos S.", avatar: "CS", data: "há 3 dias", texto: "Prefere entrega às terças de manhã. Portão azul, falar com o pedreiro Zé." },
  { id: 2, autor: "Ana O.", avatar: "AO", data: "15/09", texto: "Cliente perguntou sobre parcelamento em 3x. Verificar política com gestor." },
  { id: 3, autor: "Carlos S.", avatar: "CS", data: "15/01", texto: "CNPJ para obra pública — exige NF separada por material." },
];

export const redeIndicacoes = {
  indicadoPor: { nome: "Pedro Mestre", id: 8 },
  indicou: [
    { nome: "Marcos Engenheiro", id: 10, gastoTotal: 9800 },
    { nome: "Ana Reformas", id: 10, gastoTotal: 9800 },
    { nome: "Roberto Pedreiro", id: 3, gastoTotal: 8400 },
  ],
  totalGerado: 28000,
};
