import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, Paperclip, Smile, Mic, Send, Zap, Volume2, MessageSquare, ArrowLeft } from "lucide-react";
import { conversas, mensagensJoao, type Conversa } from "@/data/mockData";
import { toast } from "sonner";
import EmptyState from "@/components/shared/EmptyState";

const filtros = [
  { key: "todas", label: "Todas", count: 24 },
  { key: "atendimento", label: "Em atendimento", count: 8 },
  { key: "aguardando", label: "Aguardando", count: 5 },
  { key: "bot", label: "Bot ativo", count: 11 },
];

function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
function getAvatarColor(name: string) {
  const colors = ["#6366F1", "#0F766E", "#F97316", "#EAB308", "#EF4444"];
  return colors[name.charCodeAt(0) % 5];
}

export default function Conversas() {
  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [conversaAtiva, setConversaAtiva] = useState<Conversa>(conversas[0]);
  const [iaAtiva, setIaAtiva] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const filtered = filtroAtivo === "todas" ? conversas : conversas.filter(c => c.filtro === filtroAtivo);

  const selectConversation = (c: Conversa) => {
    setConversaAtiva(c);
    setMobileView('chat');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Conversas" />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left column */}
        <div className={`w-full md:w-[320px] md:min-w-[320px] md:max-w-[320px] bg-card border-r border-border flex flex-col shrink-0 overflow-hidden ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 shrink-0">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className="input-matflow w-full pl-9" placeholder="Buscar conversa..." />
            </div>
          </div>
          <div className="flex gap-0 border-b border-border px-3 shrink-0 overflow-x-auto overflow-y-hidden">
            {filtros.map(f => (
              <button key={f.key} onClick={() => setFiltroAtivo(f.key)}
                className={`px-3 py-2 text-xs font-medium relative cursor-pointer whitespace-nowrap ${filtroAtivo === f.key ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                style={{ transition: "color 120ms ease" }}>
                {f.label}
                <span className="ml-1 text-[10px] opacity-50">{f.count}</span>
                {filtroAtivo === f.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#F97316" }} />}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {filtered.length === 0 ? (
              <EmptyState icon={MessageSquare} title="Nenhuma conversa encontrada" subtitle="Tente outro filtro" />
            ) : (
              filtered.map((c, i) => {
                const isActive = conversaAtiva.id === c.id;
                return (
                  <button key={c.id} onClick={() => selectConversation(c)}
                    className="w-full text-left flex gap-3 border-b border-border overflow-hidden animate-card-enter cursor-pointer"
                    style={{
                      padding: "14px 16px",
                      animationDelay: `${i * 25}ms`,
                      background: isActive ? "rgba(249,115,22,0.06)" : "transparent",
                      boxShadow: isActive ? "inset 2px 0 0 #F97316" : "none",
                      transition: "background-color 120ms ease",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "hsl(var(--secondary))"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: getAvatarColor(c.nome) }}>
                        {getInitials(c.nome)}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-card ${c.status === "online" ? "bg-success" : "bg-border"}`} />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-sm text-foreground truncate ${c.naoLidas > 0 ? "font-bold" : "font-semibold"}`}>{c.nome}</span>
                        <span className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">{c.tempo}</span>
                      </div>
                      <p className={`text-[13px] truncate ${c.naoLidas > 0 ? "text-foreground" : "text-muted-foreground"}`}>{c.preview}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="badge-success text-[10px] py-px px-1.5">{c.canal}</span>
                        <span className="text-[11px] text-muted-foreground truncate">{c.vendedor}</span>
                      </div>
                    </div>
                    {c.naoLidas > 0 && (
                      <span className="flex items-center justify-center text-[10px] font-bold text-white shrink-0 self-center rounded-full" style={{ background: "#F97316", width: 16, height: 16 }}>
                        {c.naoLidas}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Center column - Chat */}
        <div className={`flex-1 min-w-0 flex flex-col overflow-hidden ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat header */}
          <div className="bg-card border-b border-border px-4 md:px-5 flex items-center justify-between shrink-0 overflow-hidden" style={{ height: 56 }}>
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
              <button onClick={() => setMobileView('list')} className="md:hidden p-1 hover:bg-secondary rounded cursor-pointer shrink-0">
                <ArrowLeft size={18} className="text-muted-foreground" />
              </button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: getAvatarColor(conversaAtiva.nome) }}>
                {getInitials(conversaAtiva.nome)}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{conversaAtiva.nome}</div>
                <div className="text-xs text-muted-foreground truncate">{conversaAtiva.telefone}</div>
              </div>
              <span className="badge-info ml-1 shrink-0 whitespace-nowrap hidden lg:inline-flex">Cliente desde jan/2023</span>
              <span className="badge-success shrink-0 whitespace-nowrap hidden sm:inline-flex">{conversaAtiva.canal}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button className="btn-outline-primary hidden sm:inline-flex" onClick={() => toast.success("Conversa transferida!")}>Transferir</button>
              <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-destructive text-destructive cursor-pointer hidden sm:inline-flex" style={{ height: 30, transition: "background-color 120ms ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                onClick={() => toast.info("Conversa encerrada")}>Fechar</button>
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border shrink-0">
                <Zap size={13} style={{ color: "#F97316" }} />
                <button onClick={() => setIaAtiva(!iaAtiva)}
                  className={`w-8 h-[18px] rounded-full relative cursor-pointer shrink-0 ${iaAtiva ? "bg-success" : "bg-border"}`} style={{ transition: "background-color 120ms ease" }}>
                  <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-card ${iaAtiva ? "left-[14px]" : "left-[2px]"}`} style={{ transition: "left 120ms ease" }} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col bg-background" style={{ padding: "20px 24px" }}>
            {mensagensJoao.map((msg, idx) => {
              if (msg.remetente === "sistema") {
                return (
                  <div key={msg.id} className="flex items-center gap-3" style={{ margin: "16px 0" }}>
                    <div className="flex-1 h-px bg-border" />
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground px-3 py-1 rounded-full shrink-0" style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}>
                      <Zap size={11} style={{ color: "#F97316" }} />
                      {msg.texto}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                );
              }
              const isCliente = msg.remetente === "cliente";
              const isBot = msg.remetente === "bot";
              const prevMsg = idx > 0 ? mensagensJoao[idx - 1] : null;
              const sameGroup = prevMsg && prevMsg.remetente === msg.remetente;
              const gap = sameGroup ? 3 : 16;
              return (
                <div key={msg.id} className={`flex ${isCliente ? "justify-start" : "justify-end"}`} style={{ marginTop: idx > 0 ? gap : 0 }}>
                  <div
                    className="animate-card-enter"
                    style={{
                      maxWidth: "72%",
                      padding: "10px 14px",
                      fontSize: 14,
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      borderRadius: isCliente ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                      background: isCliente ? "hsl(var(--card))" : isBot ? "hsl(var(--card))" : "rgba(249,115,22,0.09)",
                      border: isCliente ? "1px solid hsl(var(--border))" : isBot ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(249,115,22,0.18)",
                    }}
                  >
                    {isBot && <span className="text-[10px] font-semibold block mb-1" style={{ color: "#6366F1" }}>🤖 Bot IA</span>}
                    {msg.audio ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Volume2 size={15} className="shrink-0" />
                        <div className="w-24 h-1 bg-border rounded-full" />
                        <span className="text-xs font-mono-kpi whitespace-nowrap">{msg.duracao}</span>
                      </div>
                    ) : (
                      <p className="text-foreground" style={{ whiteSpace: "normal" }}>{msg.texto}</p>
                    )}
                    <span className="text-[10px] text-muted-foreground mt-1 block text-right font-mono-kpi whitespace-nowrap">{msg.hora}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Copilot */}
          <div className="mx-4 md:mx-5 mb-2 rounded-xl animate-slide-up shrink-0 overflow-hidden"
            style={{ borderLeft: "3px solid #F97316", background: "rgba(249,115,22,0.05)", padding: "12px 16px" }}>
            <div className="label-text mb-1" style={{ color: "#F97316", fontSize: 10 }}>⚡ Copiloto MatFlow</div>
            <p className="text-sm text-foreground mb-3" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
              Sim! Pedido gerado. Número #4821. Nossa equipe entrará em contato para confirmar o horário. Precisando de mais alguma coisa, João?
            </p>
            <div className="flex gap-2">
              <button className="btn-primary text-xs" style={{ height: 30 }} onClick={() => toast.success("✓ Resposta enviada")}>Usar resposta</button>
              <button className="text-xs text-muted-foreground hover:text-foreground cursor-pointer" style={{ transition: "color 120ms ease" }}>Ignorar</button>
            </div>
          </div>

          {/* Input bar */}
          <div className="bg-card border-t border-border px-4 py-2.5 flex items-center gap-2 shrink-0" style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.04)" }}>
            <Paperclip size={18} className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0 hidden sm:block" style={{ transition: "color 120ms ease" }} />
            <Smile size={18} className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0 hidden sm:block" style={{ transition: "color 120ms ease" }} />
            <Mic size={18} className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0" style={{ transition: "color 120ms ease" }} />
            <input className="input-matflow flex-1 min-w-0" style={{ height: 36 }} placeholder="Digite uma mensagem..." />
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer" style={{ background: "#F97316", transition: "background-color 120ms ease, transform 120ms ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#EA6C0A"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F97316"; }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Right column - Profile */}
        <div className="bg-card border-l border-border overflow-y-auto overflow-x-hidden shrink-0 hidden xl:block" style={{ width: 300, minWidth: 300 }}>
          <div className="p-5 text-center border-b border-border">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-white mb-3" style={{ background: getAvatarColor(conversaAtiva.nome) }}>
              {getInitials(conversaAtiva.nome)}
            </div>
            <span className="badge-success text-[10px] mb-2 inline-block">Online</span>
            <div className="text-base font-semibold text-foreground truncate">{conversaAtiva.nome}</div>
            <div className="text-sm text-muted-foreground truncate">{conversaAtiva.telefone}</div>
          </div>
          <div className="p-5 border-b border-border">
            <div className="rounded-xl p-4 text-center" style={{ background: "rgba(249,115,22,0.06)" }}>
              <div className="font-mono-kpi text-[28px] font-bold whitespace-nowrap" style={{ color: "#F97316", letterSpacing: "-0.5px" }}>R$ 47.200</div>
              <div className="text-xs text-muted-foreground mt-1">Valor total em compras</div>
            </div>
          </div>
          <div className="p-5 space-y-3 border-b border-border">
            {[
              { label: "Canal de origem", value: <span className="badge-info">Meta Ads</span> },
              { label: "Vendedor", value: <span className="font-medium text-foreground">Carlos Silva</span> },
              { label: "Primeiro contato", value: <span className="text-foreground">15 jan 2023</span> },
              { label: "Última compra", value: <span className="font-mono-kpi text-foreground">há 12 dias</span> },
              { label: "Frequência", value: <span className="badge-success">Recorrente</span> },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm gap-2">
                <span className="text-muted-foreground shrink-0">{item.label}</span>
                {item.value}
              </div>
            ))}
          </div>
          <div className="p-5 border-b border-border">
            <div className="label-text mb-2">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              <span className="badge-neutral cursor-pointer">Construtor</span>
              <span className="badge-attention cursor-pointer">Alto Valor</span>
              <span className="badge-success cursor-pointer">Recorrente</span>
            </div>
          </div>
          <div className="p-5 border-b border-border">
            <div className="label-text mb-3">Últimas compras</div>
            {[
              { item: "Cimento + Vergalhão", valor: "R$ 26.050", tempo: "12 dias atrás" },
              { item: "Porcelanato 60x60", valor: "R$ 8.400", tempo: "1 mês atrás" },
              { item: "Areia + Brita", valor: "R$ 3.200", tempo: "2 meses atrás" },
            ].map((c, i) => (
              <div key={i} className="py-3 text-sm overflow-hidden border-t border-border first:border-0">
                <div className="flex justify-between gap-2">
                  <span className="font-medium text-foreground truncate">{c.item}</span>
                  <span className="font-mono-kpi font-bold text-foreground whitespace-nowrap shrink-0">{c.valor}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{c.tempo}</span>
              </div>
            ))}
          </div>
          <div className="p-5 space-y-2">
            <button className="btn-primary w-full text-sm">Abrir conversa</button>
            <button className="w-full rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary cursor-pointer" style={{ height: 36, transition: "background-color 120ms ease" }}>Ver pipeline</button>
          </div>
        </div>
      </div>
    </div>
  );
}
