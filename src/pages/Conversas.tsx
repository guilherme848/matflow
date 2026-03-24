import { useState, useEffect, useRef } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, Paperclip, Smile, Mic, Send, Zap, Volume2, MessageSquare, ArrowLeft, ExternalLink, X, MoreHorizontal, UserPlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "@/components/shared/EmptyState";

function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
function getAvatarColor(name: string) { const c = ["#6366F1","#0F766E","#F97316","#EAB308","#EF4444"]; return c[name.charCodeAt(0) % 5]; }
function fmt(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }); }

const filtros = [
  { key: "todas", label: "Todas" },
  { key: "ativo", label: "Em atendimento" },
  { key: "aguardando", label: "Aguardando" },
  { key: "bot", label: "Bot ativo" },
];

export default function Conversas() {
  const { contacts, conversations, messages, users, deals, activeConversationId, setActiveConversationId, adicionarMensagem, toggleBotAtivo, transferirConversa, fecharConversa, assumirConversa, getContact, getUser, setPipelineHighlightDealId } = useApp();
  const navigate = useNavigate();
  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversations = conversations.filter(c => c.status !== "fechada");
  const activeConv = activeConversations.find(c => c.id === activeConversationId) || activeConversations[0];
  const activeContact = activeConv ? getContact(activeConv.contact_id) : null;
  const activeVendedor = activeConv?.vendedor_id ? getUser(activeConv.vendedor_id) : null;
  const activeDeal = deals.find(d => d.id === activeConv?.deal_id);
  const activeMessages = activeConv ? (messages[activeConv.id] || []) : [];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeMessages.length]);
  useEffect(() => { if (activeConversationId) setMobileView('chat'); }, [activeConversationId]);

  const filtered = activeConversations.filter(c => {
    const contact = getContact(c.contact_id);
    if (searchQuery && !contact?.nome.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filtroAtivo === "todas") return true;
    if (filtroAtivo === "bot") return c.bot_ativo;
    return c.status === filtroAtivo;
  });

  const counts = {
    todas: activeConversations.length,
    ativo: activeConversations.filter(c => c.status === "ativo").length,
    aguardando: activeConversations.filter(c => c.status === "aguardando").length,
    bot: activeConversations.filter(c => c.bot_ativo).length,
  };

  const selectConversation = (id: string) => { setActiveConversationId(id); setMobileView('chat'); };

  const handleSend = () => {
    if (!inputValue.trim() || !activeConv) return;
    adicionarMensagem(activeConv.id, { de: "vendedor", texto: inputValue, hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), tipo: "texto" });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Conversas" />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left column */}
        <div className={`w-full md:w-[320px] md:min-w-[320px] md:max-w-[320px] bg-card border-r border-border flex flex-col shrink-0 overflow-hidden ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 shrink-0">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className="input-matflow w-full pl-9" placeholder="Buscar conversa..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"><X size={14} /></button>}
            </div>
          </div>
          <div className="flex gap-0 border-b border-border px-3 shrink-0 overflow-x-auto overflow-y-hidden">
            {filtros.map(f => (
              <button key={f.key} onClick={() => setFiltroAtivo(f.key)}
                className={`px-3 py-2 text-xs font-medium relative cursor-pointer whitespace-nowrap transition-colors ${filtroAtivo === f.key ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {f.label}
                <span className="ml-1 text-[10px] opacity-50">{counts[f.key as keyof typeof counts]}</span>
                {filtroAtivo === f.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {filtered.length === 0 ? (
              <EmptyState icon={MessageSquare} title={searchQuery ? `Nenhuma conversa para "${searchQuery}"` : "Nenhuma conversa"} subtitle="Tente outro filtro" />
            ) : filtered.map(conv => {
              const contact = getContact(conv.contact_id);
              if (!contact) return null;
              const isActive = activeConv?.id === conv.id;
              return (
                <button key={conv.id} onClick={() => selectConversation(conv.id)}
                  className="w-full text-left flex gap-3 border-b border-border overflow-hidden cursor-pointer transition-colors"
                  style={{ padding: "14px 16px", background: isActive ? "rgba(249,115,22,0.06)" : "transparent", boxShadow: isActive ? "inset 2px 0 0 #F97316" : "none" }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "hsl(var(--secondary))"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isActive ? "rgba(249,115,22,0.06)" : "transparent"; }}>
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: getAvatarColor(contact.nome) }}>{getInitials(contact.nome)}</div>
                    <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-card ${contact.status === "online" ? "bg-green-500" : "bg-border"}`} />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center gap-2">
                      <span className={`text-sm text-foreground truncate ${conv.nao_lidas > 0 ? "font-bold" : "font-semibold"}`}>{contact.nome}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">{conv.ultima_mensagem_hora}</span>
                    </div>
                    <p className={`text-[13px] truncate ${conv.nao_lidas > 0 ? "text-foreground" : "text-muted-foreground"}`}>{conv.ultima_mensagem}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="badge-success text-[10px] py-px px-1.5">{conv.canal}</span>
                      {conv.bot_ativo && <span className="text-[10px] px-1.5 py-px rounded-full font-medium" style={{ background: "rgba(99,102,241,0.10)", color: "#6366F1" }}>🤖 Bot</span>}
                      {conv.vendedor_id && <span className="text-[11px] text-muted-foreground truncate">{getUser(conv.vendedor_id)?.nome}</span>}
                      {!conv.vendedor_id && <span className="badge-danger text-[9px]">Sem vendedor</span>}
                    </div>
                  </div>
                  {conv.nao_lidas > 0 && <span className="flex items-center justify-center text-[10px] font-bold text-white shrink-0 self-center rounded-full bg-primary" style={{ width: 16, height: 16 }}>{conv.nao_lidas}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center column */}
        <div className={`flex-1 min-w-0 flex flex-col overflow-hidden ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {activeConv && activeContact ? (
            <>
              {/* Header */}
              <div className="bg-card border-b border-border px-4 md:px-5 flex items-center justify-between shrink-0 overflow-hidden" style={{ height: 56 }}>
                <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                  <button onClick={() => setMobileView('list')} className="md:hidden p-1 hover:bg-secondary rounded cursor-pointer shrink-0"><ArrowLeft size={18} className="text-muted-foreground" /></button>
                  <button onClick={() => navigate(`/clientes/${activeContact.id}`)} className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: getAvatarColor(activeContact.nome) }}>{getInitials(activeContact.nome)}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">{activeContact.nome}</div>
                      <div className="text-xs text-muted-foreground truncate">{activeContact.telefone}</div>
                    </div>
                  </button>
                  {activeDeal && <button onClick={() => { setPipelineHighlightDealId(activeDeal.id); navigate('/pipeline'); }} className="badge-orange cursor-pointer hover:opacity-80 transition-opacity shrink-0 hidden lg:inline-flex">Deal: {fmt(activeDeal.valor)}</button>}
                  {activeConv.bot_ativo && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold hidden sm:inline-flex" style={{ background: "rgba(99,102,241,0.10)", color: "#6366F1" }}>🤖 Bot ativo</span>}
                  {!activeConv.bot_ativo && activeConv.vendedor_id === null && <span className="badge-attention text-[10px] hidden sm:inline-flex">⚠ IA pausada</span>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!activeConv.vendedor_id && (
                    <button className="btn-primary text-xs h-[30px] hidden sm:inline-flex" onClick={() => { assumirConversa(activeConv.id); toast.success("Você assumiu esta conversa"); }}>
                      <UserPlus size={12} /> Assumir
                    </button>
                  )}
                  <button className="btn-outline text-xs hidden sm:inline-flex h-[30px]" onClick={() => setShowTransfer(true)}>Transferir</button>
                  <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-destructive text-destructive cursor-pointer hidden sm:inline-flex hover:bg-destructive/10 transition-colors" style={{ height: 30 }}
                    onClick={() => setShowCloseModal(true)}>Fechar</button>
                  
                  {/* More menu */}
                  <div className="relative">
                    <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-1 hover:bg-secondary rounded cursor-pointer"><MoreHorizontal size={16} className="text-muted-foreground" /></button>
                    {showMoreMenu && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowMoreMenu(false)} />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-40 py-1">
                          <button onClick={() => { navigate(`/clientes/${activeContact.id}`); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-secondary cursor-pointer">Ver histórico completo</button>
                          <button onClick={() => { setShowMoreMenu(false); toast.info("Marcada como não lida"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-secondary cursor-pointer">Marcar como não lida</button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border shrink-0">
                    <Zap size={13} className="text-primary" />
                    <button onClick={() => { toggleBotAtivo(activeConv.id); toast.info(activeConv.bot_ativo ? "Agente pausado" : "Agente ativado"); }}
                      className={`w-8 h-[18px] rounded-full relative cursor-pointer shrink-0 transition-colors ${activeConv.bot_ativo ? "bg-green-500" : "bg-border"}`}>
                      <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-card transition-[left] ${activeConv.bot_ativo ? "left-[14px]" : "left-[2px]"}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col bg-background" style={{ padding: "20px 24px" }}>
                {activeMessages.map((msg, idx) => {
                  if (msg.tipo === "sistema" || msg.de === "sistema") {
                    return (
                      <div key={msg.id} className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-border" />
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground px-3 py-1 rounded-full bg-secondary border border-border shrink-0">
                          <Zap size={11} className="text-primary" />{msg.texto}
                        </span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    );
                  }
                  const isCliente = msg.de === "cliente";
                  const isBot = msg.de === "bot";
                  const prevMsg = idx > 0 ? activeMessages[idx - 1] : null;
                  const sameGroup = prevMsg && prevMsg.de === msg.de;
                  return (
                    <div key={msg.id} className={`flex ${isCliente ? "justify-start" : "justify-end"}`} style={{ marginTop: idx > 0 ? (sameGroup ? 3 : 16) : 0 }}>
                      <div style={{ maxWidth: "72%", padding: "10px 14px", fontSize: 14, lineHeight: 1.5, wordBreak: "break-word", borderRadius: isCliente ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                        background: isCliente ? "hsl(var(--card))" : isBot ? "hsl(var(--card))" : "rgba(249,115,22,0.09)",
                        border: isCliente ? "1px solid hsl(var(--border))" : isBot ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(249,115,22,0.18)" }}>
                        {isBot && <span className="text-[10px] font-semibold block mb-1 text-info">🤖 Bot IA</span>}
                        {msg.tipo === "audio" ? (
                          <div className="flex items-center gap-2 text-muted-foreground"><Volume2 size={15} className="shrink-0" /><div className="w-24 h-1 bg-border rounded-full" /><span className="text-xs font-mono whitespace-nowrap">{msg.duracao}</span></div>
                        ) : <p className="text-foreground" style={{ whiteSpace: "normal" }}>{msg.texto}</p>}
                        <span className="text-[10px] text-muted-foreground mt-1 block text-right font-mono whitespace-nowrap">{msg.hora}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Copilot */}
              <div className="mx-4 md:mx-5 mb-2 rounded-xl shrink-0 overflow-hidden" style={{ borderLeft: "3px solid hsl(var(--primary))", background: "rgba(249,115,22,0.05)", padding: "12px 16px" }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">⚡ Copiloto MatFlow</div>
                <p className="text-sm text-foreground mb-3 line-clamp-2">Sim! Pedido gerado. Número #4821. Nossa equipe entrará em contato para confirmar o horário.</p>
                <div className="flex gap-2">
                  <button className="btn-primary text-xs h-[30px]" onClick={() => { setInputValue("Sim! Pedido gerado. Número #4821. Nossa equipe entrará em contato para confirmar o horário."); toast.success("✓ Sugestão copiada"); }}>Usar resposta</button>
                  <button className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Ignorar</button>
                </div>
              </div>

              {/* Input */}
              <div className="bg-card border-t border-border px-4 py-2.5 flex items-center gap-2 shrink-0" style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.04)" }}>
                <Paperclip size={18} className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0 hidden sm:block transition-colors" />
                <Smile size={18} className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0 hidden sm:block transition-colors" />
                <Mic size={18} className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0 transition-colors" />
                <input className="input-matflow flex-1 min-w-0" style={{ height: 36 }} placeholder="Digite uma mensagem..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                <button onClick={handleSend} className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer bg-primary hover:brightness-90 active:scale-95 transition-all"><Send size={15} /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center"><EmptyState icon={MessageSquare} title="Selecione uma conversa" subtitle="Escolha uma conversa na lista à esquerda" /></div>
          )}
        </div>

        {/* Right column */}
        {activeConv && activeContact && (
          <div className="bg-card border-l border-border overflow-y-auto overflow-x-hidden shrink-0 hidden xl:block" style={{ width: 300, minWidth: 300 }}>
            <div className="p-5 text-center border-b border-border">
              <button onClick={() => navigate(`/clientes/${activeContact.id}`)} className="cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-white mb-3" style={{ background: getAvatarColor(activeContact.nome) }}>{getInitials(activeContact.nome)}</div>
              </button>
              <span className={`text-[10px] mb-2 inline-block ${activeContact.status === "online" ? "badge-success" : "badge-neutral"}`}>{activeContact.status === "online" ? "Online" : "Offline"}</span>
              <div className="text-base font-semibold text-foreground truncate">{activeContact.nome}</div>
              <div className="text-sm text-muted-foreground truncate">{activeContact.telefone}</div>
            </div>
            {activeDeal && (
              <div className="p-4 mx-4 mt-4 rounded-xl" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Deal Ativo</div>
                <div className="font-mono text-lg font-bold text-primary mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(activeDeal.valor)}</div>
                <button onClick={() => { setPipelineHighlightDealId(activeDeal.id); navigate('/pipeline'); }} className="text-xs text-primary hover:underline cursor-pointer mt-2 flex items-center gap-1"><ExternalLink size={11} /> Ver no pipeline</button>
              </div>
            )}
            <div className="p-5 border-b border-border">
              <div className="rounded-xl p-4 text-center" style={{ background: "rgba(249,115,22,0.06)" }}>
                <div className="font-mono text-[28px] font-bold text-primary whitespace-nowrap" style={{ letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums" }}>{fmt(activeContact.ltv)}</div>
                <div className="text-xs text-muted-foreground mt-1">LTV Total</div>
              </div>
            </div>
            <div className="p-5 space-y-3 border-b border-border">
              {[{ label: "Canal", value: activeContact.canal_origem }, { label: "Vendedor", value: activeVendedor?.nome || "—" }, { label: "Score", value: `${activeContact.score}/100` }].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm gap-2"><span className="text-muted-foreground shrink-0">{item.label}</span><span className="font-medium text-foreground truncate">{item.value}</span></div>
              ))}
            </div>
            <div className="p-5 border-b border-border">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tags</div>
              <div className="flex flex-wrap gap-1.5">{activeContact.tags.map(t => <span key={t} className="badge-neutral">{t}</span>)}</div>
            </div>
            <div className="p-5 space-y-2">
              <button onClick={() => navigate(`/clientes/${activeContact.id}`)} className="btn-primary w-full text-sm">Ver perfil completo</button>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransfer && activeConv && (
        <>
          <div className="fixed inset-0 z-40 overlay-backdrop" onClick={() => setShowTransfer(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowTransfer(false)}>
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-[400px] animate-modal-enter" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Transferir conversa</h2>
                <button onClick={() => setShowTransfer(false)} className="p-1 hover:bg-secondary rounded cursor-pointer"><X size={18} className="text-muted-foreground" /></button>
              </div>
              <div className="p-5 space-y-2">
                {users.filter(u => u.role === "vendedor" && u.id !== activeConv.vendedor_id).map(u => (
                  <button key={u.id} onClick={() => { transferirConversa(activeConv.id, u.id); toast.success(`Transferido para ${u.nome}`); setShowTransfer(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: u.avatar_cor }}>{getInitials(u.nome)}</div>
                    <div className="flex-1 min-w-0 text-left"><div className="text-sm font-medium text-foreground">{u.nome}</div></div>
                    <span className={`text-[10px] ${u.status === "online" ? "badge-success" : "badge-neutral"}`}>{u.status === "online" ? "Online" : "Offline"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Close Modal */}
      {showCloseModal && activeConv && (
        <>
          <div className="fixed inset-0 z-40 overlay-backdrop" onClick={() => setShowCloseModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCloseModal(false)}>
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-[400px] animate-modal-enter" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-border"><h2 className="text-lg font-semibold text-foreground">Encerrar conversa</h2></div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-muted-foreground">Deseja criar um deal para esta conversa?</p>
                <div className="flex gap-2">
                  <button onClick={() => { fecharConversa(activeConv.id); setActiveConversationId(null); toast.info("Conversa encerrada"); setShowCloseModal(false); }}
                    className="btn-outline text-sm flex-1">Fechar sem deal</button>
                  <button onClick={() => { fecharConversa(activeConv.id); setActiveConversationId(null); toast.success("Conversa encerrada"); setShowCloseModal(false); }}
                    className="btn-primary text-sm flex-1">Sim, criar deal</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
