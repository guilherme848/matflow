import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, Paperclip, Smile, Mic, Send, Zap, Volume2, MessageSquare } from "lucide-react";
import { conversas, mensagensJoao, type Conversa } from "@/data/mockData";
import { toast } from "sonner";
import EmptyState from "@/components/shared/EmptyState";

const filtros = [
  { key: "todas", label: "Todas", count: 24 },
  { key: "atendimento", label: "Em atendimento", count: 8 },
  { key: "aguardando", label: "Aguardando", count: 5 },
  { key: "bot", label: "Bot ativo", count: 11 },
];

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ["#F97316", "#6366F1", "#0F766E", "#EAB308", "#EF4444", "#8B5CF6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Conversas() {
  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [conversaAtiva, setConversaAtiva] = useState<Conversa>(conversas[0]);
  const [iaAtiva, setIaAtiva] = useState(true);

  const filtered = filtroAtivo === "todas" ? conversas : conversas.filter(c => c.filtro === filtroAtivo);

  return (
    <div className="flex flex-col h-screen">
      <AppHeader title="Conversas" />
      <div className="flex flex-1 min-h-0">
        {/* Left column - conversation list */}
        <div className="w-[320px] bg-card border-r border-border flex flex-col shrink-0">
          <div className="p-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className="input-matflow w-full pl-9" placeholder="Buscar conversa ou cliente..." />
            </div>
          </div>
          <div className="flex gap-0 border-b border-border px-3">
            {filtros.map(f => (
              <button
                key={f.key}
                onClick={() => setFiltroAtivo(f.key)}
                className={`px-3 py-2 text-xs font-medium transition-colors relative cursor-pointer ${filtroAtivo === f.key ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f.label}
                <span className="ml-1 text-[10px] opacity-60">{f.count}</span>
                {filtroAtivo === f.key && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#F97316" }} />}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="Nenhuma conversa encontrada"
                subtitle="Tente outro filtro"
              />
            ) : (
              filtered.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setConversaAtiva(c)}
                  className={`w-full text-left px-4 py-4 flex gap-3 transition-colors relative animate-card-enter cursor-pointer border-b border-border ${
                    conversaAtiva.id === c.id
                      ? "border-l-[3px]"
                      : "border-l-[3px] border-l-transparent hover:bg-secondary"
                  }`}
                  style={{
                    animationDelay: `${i * 30}ms`,
                    ...(conversaAtiva.id === c.id ? { borderLeftColor: "#F97316", background: "rgba(249,115,22,0.06)" } : {}),
                  }}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: getAvatarColor(c.nome) }}>
                      {getInitials(c.nome)}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${c.status === "online" ? "bg-success" : "bg-border"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground truncate">{c.nome}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{c.tempo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate overflow-hidden whitespace-nowrap text-ellipsis">{c.preview}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="badge-success text-[9px] py-0 px-1.5">{c.canal}</span>
                      <span className="text-[10px] text-muted-foreground">{c.vendedor}</span>
                    </div>
                  </div>
                  {c.naoLidas > 0 && (
                    <span className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-primary-foreground shrink-0 self-center" style={{ background: "#F97316" }}>
                      {c.naoLidas}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Center column - Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="bg-card border-b border-border px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: getAvatarColor(conversaAtiva.nome) }}>
                {getInitials(conversaAtiva.nome)}
              </div>
              <div>
                <div className="font-semibold text-foreground">{conversaAtiva.nome}</div>
                <div className="text-xs text-muted-foreground">{conversaAtiva.telefone}</div>
              </div>
              <span className="badge-info ml-2">Cliente desde jan/2023</span>
              <span className="badge-success">{conversaAtiva.canal}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs rounded-lg border border-border text-foreground hover:bg-secondary transition-colors cursor-pointer" onClick={() => toast.success("Conversa transferida!")}>Transferir</button>
              <button className="px-3 py-1.5 text-xs rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" onClick={() => toast.info("Conversa encerrada e registrada no pipeline")}>Fechar</button>
              <button className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Ver perfil</button>
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
                <Zap size={14} className="text-primary" />
                <span className="text-xs font-medium">IA Ativa</span>
                <button
                  onClick={() => setIaAtiva(!iaAtiva)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${iaAtiva ? "bg-success" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card transition-transform ${iaAtiva ? "left-[18px]" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-background">
            {mensagensJoao.map((msg, idx) => {
              if (msg.remetente === "sistema") {
                return (
                  <div key={msg.id} className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-border" />
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                      <Zap size={12} style={{ color: "#F97316" }} />
                      {msg.texto}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                );
              }
              const isCliente = msg.remetente === "cliente";
              const isBot = msg.remetente === "bot";
              // Add extra spacing between sender groups
              const prevMsg = idx > 0 ? mensagensJoao[idx - 1] : null;
              const groupGap = prevMsg && prevMsg.remetente !== msg.remetente && prevMsg.remetente !== "sistema" ? "mt-5" : "mt-3";
              return (
                <div key={msg.id} className={`flex ${isCliente ? "justify-start" : "justify-end"} ${idx > 0 ? groupGap : ""}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 text-sm animate-card-enter ${
                      isCliente
                        ? "bg-card border border-border rounded-[0_16px_16px_16px]"
                        : isBot
                        ? "bg-card border rounded-[16px_0_16px_16px]"
                        : "rounded-[16px_0_16px_16px]"
                    }`}
                    style={
                      isBot
                        ? { borderColor: "rgba(99,102,241,0.30)" }
                        : !isCliente && !isBot
                        ? { background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.20)" }
                        : {}
                    }
                  >
                    {isBot && <span className="text-[10px] font-semibold block mb-1" style={{ color: "#6366F1" }}>🤖 Bot IA</span>}
                    {msg.audio ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Volume2 size={16} />
                        <div className="w-24 h-1 bg-border rounded-full" />
                        <span className="text-xs font-mono-kpi">{msg.duracao}</span>
                      </div>
                    ) : (
                      <p>{msg.texto}</p>
                    )}
                    <span className="text-[10px] text-muted-foreground mt-1 block text-right font-mono-kpi">{msg.hora}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Suggestion - Copilot card */}
          <div
            className="mx-5 mb-2 rounded-2xl border border-border animate-slide-up"
            style={{ borderLeftWidth: 4, borderLeftColor: "#F97316", background: "rgba(249,115,22,0.06)", padding: "16px 20px" }}
          >
            <div className="label-text mb-1" style={{ color: "#F97316" }}>⚡ Copiloto MatFlow</div>
            <p className="text-sm text-foreground mb-3">
              Sim! Pedido gerado. Número #4821. Nossa equipe entrará em contato para confirmar o horário. Precisando de mais alguma coisa, João?
            </p>
            <div className="flex gap-2">
              <button className="btn-primary text-xs h-8 px-4" onClick={() => toast.success("✓ Resposta enviada")}>Usar resposta</button>
              <button className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Ignorar</button>
            </div>
          </div>

          {/* Input bar */}
          <div className="bg-card border-t border-border px-5 py-3 flex items-center gap-3" style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.06)" }}>
            <Paperclip size={20} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            <Smile size={20} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            <Mic size={20} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            <input className="input-matflow flex-1" placeholder="Digite uma mensagem..." />
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground shrink-0 cursor-pointer" style={{ background: "#F97316", transition: "all 120ms ease" }}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Right column - Profile */}
        <div className="w-[300px] bg-card border-l border-border overflow-y-auto shrink-0 hidden xl:block">
          <div className="p-5 text-center border-b border-border">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold text-primary-foreground mb-3" style={{ background: getAvatarColor(conversaAtiva.nome) }}>
              {getInitials(conversaAtiva.nome)}
            </div>
            <span className="badge-success text-[9px] mb-2 inline-block">Online</span>
            <div className="text-lg font-bold text-foreground">{conversaAtiva.nome}</div>
            <div className="text-sm text-muted-foreground">{conversaAtiva.telefone}</div>
          </div>

          <div className="p-5 border-b border-border">
            <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.20)" }}>
              <div className="font-mono-kpi text-[32px] font-extrabold" style={{ color: "#F97316" }}>R$ 47.200</div>
              <div className="text-xs text-muted-foreground mt-1">Valor total em compras</div>
            </div>
          </div>

          <div className="p-5 space-y-3 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Canal de origem</span>
              <span className="badge-info">Meta Ads</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vendedor</span>
              <span className="font-medium text-foreground">Carlos Silva</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Primeiro contato</span>
              <span className="font-medium text-foreground">15 jan 2023</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Última compra</span>
              <span className="font-medium text-foreground font-mono-kpi">há 12 dias</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frequência</span>
              <span className="badge-success">Recorrente</span>
            </div>
          </div>

          <div className="p-5 border-b border-border">
            <div className="label-text mb-2">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              <span className="badge-neutral cursor-pointer hover:opacity-80 transition-opacity">Construtor</span>
              <span className="badge-attention cursor-pointer hover:opacity-80 transition-opacity">Alto Valor</span>
              <span className="badge-success cursor-pointer hover:opacity-80 transition-opacity">Recorrente</span>
            </div>
          </div>

          <div className="p-5 border-b border-border">
            <div className="label-text mb-3">Últimas compras</div>
            <div className="divide-y divide-border">
              {[
                { item: "Cimento + Vergalhão", valor: "R$ 26.050", tempo: "12 dias atrás" },
                { item: "Porcelanato 60x60", valor: "R$ 8.400", tempo: "1 mês atrás" },
                { item: "Areia + Brita", valor: "R$ 3.200", tempo: "2 meses atrás" },
              ].map((c, i) => (
                <div key={i} className="py-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">{c.item}</span>
                    <span className="font-mono-kpi font-bold text-foreground">{c.valor}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{c.tempo}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5">
            <button className="w-full h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer">
              Ver perfil completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
