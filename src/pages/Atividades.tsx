import { useState, useMemo } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useApp, atividadeTipoConfig, type Atividade, type AtividadeTipo } from "@/context/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Search, X, Plus, List, CalendarDays, Check, Edit2, MoreHorizontal, ChevronDown, ChevronRight, RefreshCw, MessageCircle, Phone, FileText, MapPin } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";

function fmt(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }); }
function getInitials(n: string) { return n.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
function getAvatarColor(n: string) { const c = ["#6366F1","#0F766E","#F97316","#EAB308","#EF4444"]; return c[n.charCodeAt(0) % 5]; }

const tipoIcons: Record<AtividadeTipo, typeof RefreshCw> = { follow_up: RefreshCw, whatsapp: MessageCircle, ligacao: Phone, orcamento: FileText, visita: MapPin };

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const prioridadeBadge: Record<string, string> = { alta: "badge-danger", media: "badge-attention", baixa: "badge-neutral" };
const prioridadeLabel: Record<string, string> = { alta: "Alta", media: "Média", baixa: "Baixa" };

function dateGroup(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
  if (d < today) return "Atrasadas";
  if (d < tomorrow) return "Hoje";
  if (d < new Date(tomorrow.getTime() + 86400000)) return "Amanhã";
  if (d < nextWeek) return "Esta semana";
  return "Mais tarde";
}

export default function Atividades() {
  const { atividades, contacts, users, deals, getContact, getUser, concluirAtividade, cancelarAtividade, adicionarAtividade, atualizarAtividade, setActiveConversationId, setPipelineHighlightDealId, atividadesAtrasadas, atividadesHoje } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<"lista" | "calendario">(() => (localStorage.getItem("matflow-atividades-view") as "lista" | "calendario") || "lista");
  const [search, setSearch] = useState(searchParams.get("cliente") ? contacts.find(c => c.id === searchParams.get("cliente"))?.nome || "" : "");
  const [filterVendedor, setFilterVendedor] = useState(searchParams.get("vendedor") || "");
  const [filterTipo, setFilterTipo] = useState<string>(searchParams.get("tipo") || "");
  const [filterPrioridade, setFilterPrioridade] = useState("");
  const [filterPeriodo, setFilterPeriodo] = useState(searchParams.get("periodo") || "semana");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);
  const [showConcluirId, setShowConcluirId] = useState<string | null>(null);
  const [concluirNotas, setConcluirNotas] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date(2024, 10, 1)); // Nov 2024

  // Save view mode
  const saveView = (v: "lista" | "calendario") => { setViewMode(v); localStorage.setItem("matflow-atividades-view", v); };

  // Filtered
  const filtered = useMemo(() => {
    return atividades.filter(a => {
      if (a.status === "cancelada") return false;
      const contact = getContact(a.contact_id);
      if (search && !a.titulo.toLowerCase().includes(search.toLowerCase()) && !contact?.nome.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterVendedor && a.vendedor_id !== filterVendedor) return false;
      if (filterTipo && a.tipo !== filterTipo) return false;
      if (filterPrioridade && a.prioridade !== filterPrioridade) return false;
      if (filterPeriodo === "atrasadas" && a.status !== "atrasada") return false;
      return true;
    }).sort((a, b) => {
      if (a.status === "concluida" && b.status !== "concluida") return 1;
      if (b.status === "concluida" && a.status !== "concluida") return -1;
      if (a.status === "atrasada" && b.status !== "atrasada") return -1;
      if (b.status === "atrasada" && a.status !== "atrasada") return 1;
      const prioOrd: Record<string, number> = { alta: 0, media: 1, baixa: 2 };
      if (prioOrd[a.prioridade] !== prioOrd[b.prioridade]) return prioOrd[a.prioridade] - prioOrd[b.prioridade];
      return a.data_agendada.localeCompare(b.data_agendada);
    });
  }, [atividades, search, filterVendedor, filterTipo, filterPrioridade, filterPeriodo, getContact]);

  // Grouped
  const groups = useMemo(() => {
    const g: Record<string, Atividade[]> = {};
    const order = ["Atrasadas", "Hoje", "Amanhã", "Esta semana", "Mais tarde", "Concluídas"];
    for (const a of filtered) {
      const key = a.status === "concluida" ? "Concluídas" : dateGroup(a.data_agendada);
      if (!g[key]) g[key] = [];
      g[key].push(a);
    }
    return order.filter(k => g[k]?.length).map(k => ({ label: k, items: g[k] }));
  }, [filtered]);

  const toggleGroup = (label: string) => setCollapsedGroups(p => ({ ...p, [label]: !p[label] }));

  const handleConcluir = (id: string) => {
    concluirAtividade(id, concluirNotas || undefined);
    toast.success("✓ Atividade concluída!");
    setShowConcluirId(null);
    setConcluirNotas("");
  };

  const activeFilters = [filterVendedor, filterTipo, filterPrioridade].filter(Boolean).length + (filterPeriodo !== "semana" ? 1 : 0);

  // Calendar helpers
  const calYear = calendarMonth.getFullYear();
  const calMonth = calendarMonth.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calWeeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { calWeeks.push(week); week = []; }
  }
  if (week.length) { while (week.length < 7) week.push(null); calWeeks.push(week); }

  const getActivitiesForDay = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return atividades.filter(a => a.data_agendada.startsWith(dateStr) && a.status !== "cancelada");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Atividades" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" style={{ padding: "24px 32px" }}>
        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex bg-secondary rounded-lg p-0.5 border border-border shrink-0">
            <button onClick={() => saveView("lista")} className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${viewMode === "lista" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <List size={13} /> Lista
            </button>
            <button onClick={() => saveView("calendario")} className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${viewMode === "calendario" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <CalendarDays size={13} /> Calendário
            </button>
          </div>
          <div className="flex-1" />
          <button onClick={() => setShowNewModal(true)} className="btn-primary text-sm shrink-0 whitespace-nowrap"><Plus size={14} /> Nova Atividade</button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <select className="input-matflow w-40 text-sm shrink-0" value={filterVendedor} onChange={e => setFilterVendedor(e.target.value)}>
            <option value="">Toda a equipe</option>
            <option value="v1">Minhas atividades</option>
            {users.filter(u => u.role === "vendedor").map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
          </select>
          <select className="input-matflow w-36 text-sm shrink-0" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value="">Todos os tipos</option>
            {(Object.keys(atividadeTipoConfig) as AtividadeTipo[]).map(t => <option key={t} value={t}>{atividadeTipoConfig[t].label}</option>)}
          </select>
          <select className="input-matflow w-32 text-sm shrink-0" value={filterPrioridade} onChange={e => setFilterPrioridade(e.target.value)}>
            <option value="">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
          <select className="input-matflow w-36 text-sm shrink-0" value={filterPeriodo} onChange={e => setFilterPeriodo(e.target.value)}>
            <option value="semana">Esta semana</option>
            <option value="hoje">Hoje</option>
            <option value="amanha">Amanhã</option>
            <option value="7d">Próximos 7 dias</option>
            <option value="atrasadas">Atrasadas</option>
            <option value="todas">Todas</option>
          </select>
          <div className="relative flex-1 min-w-0 max-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="input-matflow w-full pl-9 text-sm" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"><X size={14} /></button>}
          </div>
          {activeFilters > 0 && <button onClick={() => { setFilterVendedor(""); setFilterTipo(""); setFilterPrioridade(""); setFilterPeriodo("semana"); setSearch(""); }} className="text-xs text-primary hover:underline cursor-pointer shrink-0">Limpar filtros</button>}
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444" }}>🔴 {atividadesAtrasadas.length} atrasadas</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(234,179,8,0.10)", color: "#EAB308" }}>🟡 {atividadesHoje.length} para hoje</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">⚪ {filtered.length} total</span>
        </div>

        {/* LIST VIEW */}
        {viewMode === "lista" && (
          <div className="space-y-4">
            {groups.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8">
                <EmptyState icon={Check} title="Nenhuma atividade" subtitle="Crie uma nova atividade para começar" />
              </div>
            ) : groups.map(group => {
              const isCollapsed = collapsedGroups[group.label];
              const isOverdue = group.label === "Atrasadas";
              const isDone = group.label === "Concluídas";
              return (
                <div key={group.label} className="bg-card border border-border rounded-xl overflow-hidden" style={isOverdue ? { borderLeft: "3px solid hsl(var(--destructive))", background: "rgba(239,68,68,0.03)" } : {}}>
                  <button onClick={() => toggleGroup(group.label)} className="w-full flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {isCollapsed ? <ChevronRight size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                      <span className={`text-sm font-semibold ${isOverdue ? "text-destructive" : "text-foreground"}`}>{group.label}</span>
                      <span className="text-[11px] font-semibold px-2 rounded-full bg-secondary text-muted-foreground">{group.items.length}</span>
                    </div>
                  </button>
                  {!isCollapsed && (
                    <div>
                      {group.items.map(atv => {
                        const contact = getContact(atv.contact_id);
                        const vendedor = getUser(atv.vendedor_id);
                        const deal = atv.deal_id ? deals.find(d => d.id === atv.deal_id) : null;
                        const cfg = atividadeTipoConfig[atv.tipo];
                        const TipoIcon = tipoIcons[atv.tipo];
                        const isOverdueItem = atv.status === "atrasada";
                        const isConcluida = atv.status === "concluida";

                        return (
                          <div key={atv.id} onClick={() => setSelectedAtividade(atv)}
                            className={`flex items-center gap-3 px-5 border-t border-border cursor-pointer group transition-colors hover:bg-secondary/50 ${isConcluida ? "opacity-55" : ""}`}
                            style={{ height: 64 }}>
                            {/* Type icon / checkbox */}
                            <button onClick={e => { e.stopPropagation(); if (!isConcluida) setShowConcluirId(atv.id); }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${isConcluida ? "bg-green-500/20" : ""}`}
                              style={!isConcluida ? { background: cfg.bg } : {}}>
                              {isConcluida ? <Check size={14} className="text-green-600" /> : <TipoIcon size={14} style={{ color: cfg.color }} />}
                            </button>

                            {/* Content */}
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className={`text-sm font-semibold truncate ${isConcluida ? "line-through text-muted-foreground" : isOverdueItem ? "text-destructive" : "text-foreground"}`}>{atv.titulo}</div>
                              <div className="flex items-center gap-2 mt-0.5 overflow-hidden">
                                {contact && (
                                  <button onClick={e => { e.stopPropagation(); navigate(`/clientes/${contact.id}`); }}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0">
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{ background: getAvatarColor(contact.nome) }}>{getInitials(contact.nome)}</div>
                                    <span className="truncate max-w-[120px]">{contact.nome}</span>
                                  </button>
                                )}
                                {deal && (
                                  <>
                                    <span className="text-muted-foreground text-[10px]">·</span>
                                    <button onClick={e => { e.stopPropagation(); setPipelineHighlightDealId(deal.id); navigate("/pipeline"); }}
                                      className="badge-orange text-[10px] cursor-pointer hover:opacity-80 transition-opacity shrink-0">Deal {fmt(deal.valor)}</button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Meta */}
                            <span className={`font-mono text-xs font-medium whitespace-nowrap shrink-0 ${isOverdueItem ? "text-destructive font-bold" : isConcluida ? "text-muted-foreground" : "text-muted-foreground"}`}
                              style={{ fontVariantNumeric: "tabular-nums" }}>
                              {isConcluida ? formatDate(atv.data_concluida || atv.data_agendada) : formatTime(atv.data_agendada)}
                            </span>
                            {isOverdueItem && <span className="badge-danger text-[9px] animate-pulse shrink-0">Atrasada</span>}
                            {isConcluida && <span className="badge-success text-[9px] shrink-0">Concluída</span>}
                            <span className={`${prioridadeBadge[atv.prioridade]} text-[10px] shrink-0 hidden sm:inline-flex`}>{prioridadeLabel[atv.prioridade]}</span>

                            {/* Actions */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              {!isConcluida && (
                                <button onClick={e => { e.stopPropagation(); setShowConcluirId(atv.id); }}
                                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-green-500/10 text-muted-foreground hover:text-green-600 cursor-pointer transition-colors">
                                  <Check size={14} />
                                </button>
                              )}
                              <button onClick={e => { e.stopPropagation(); setSelectedAtividade(atv); }}
                                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                <Edit2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CALENDAR VIEW */}
        {viewMode === "calendario" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <button onClick={() => setCalendarMonth(new Date(calYear, calMonth - 1, 1))} className="text-muted-foreground hover:text-foreground cursor-pointer p-1">←</button>
              <span className="text-sm font-semibold text-foreground">{calendarMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</span>
              <button onClick={() => setCalendarMonth(new Date(calYear, calMonth + 1, 1))} className="text-muted-foreground hover:text-foreground cursor-pointer p-1">→</button>
            </div>
            <div className="grid grid-cols-7">
              {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d => (
                <div key={d} className="text-center py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">{d}</div>
              ))}
              {calWeeks.flat().map((day, idx) => {
                const dayActivities = day ? getActivitiesForDay(day) : [];
                const isToday = day === new Date().getDate() && calMonth === new Date().getMonth() && calYear === new Date().getFullYear();
                return (
                  <div key={idx} className={`min-h-[100px] border-b border-r border-border p-1.5 ${day ? "cursor-pointer hover:bg-secondary/30 transition-colors" : "bg-secondary/20"}`}
                    onClick={() => { if (day && dayActivities.length === 0) setShowNewModal(true); }}>
                    {day && (
                      <>
                        <div className="flex justify-end mb-1">
                          <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-primary text-white" : "text-foreground"}`}>{day}</span>
                        </div>
                        <div className="space-y-0.5">
                          {dayActivities.slice(0, 3).map(a => {
                            const cfg = atividadeTipoConfig[a.tipo];
                            const TipoIcon = tipoIcons[a.tipo];
                            return (
                              <button key={a.id} onClick={e => { e.stopPropagation(); setSelectedAtividade(a); }}
                                className="w-full flex items-center gap-1 rounded px-1.5 py-0.5 text-left cursor-pointer truncate transition-colors hover:opacity-80"
                                style={{ background: cfg.bg, height: 20 }}>
                                <TipoIcon size={10} style={{ color: cfg.color }} className="shrink-0" />
                                <span className="text-[10px] font-medium truncate" style={{ color: cfg.color }}>{a.titulo}</span>
                              </button>
                            );
                          })}
                          {dayActivities.length > 3 && <span className="text-[10px] text-muted-foreground pl-1">+{dayActivities.length - 3} mais</span>}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Concluir inline modal */}
      {showConcluirId && (
        <>
          <div className="fixed inset-0 z-40 overlay-backdrop" onClick={() => setShowConcluirId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowConcluirId(null)}>
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-[400px] animate-modal-enter" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-border"><h2 className="text-base font-semibold text-foreground">Concluir atividade</h2></div>
              <div className="p-5">
                <label className="label-text mb-1.5 block">Notas do resultado (opcional)</label>
                <textarea className="input-matflow w-full text-sm" rows={3} placeholder="Como foi?" value={concluirNotas} onChange={e => setConcluirNotas(e.target.value)} />
              </div>
              <div className="p-5 border-t border-border flex justify-end gap-3">
                <button onClick={() => { handleConcluir(showConcluirId); }} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer px-3 py-1.5">Pular</button>
                <button onClick={() => { handleConcluir(showConcluirId); }} className="btn-primary text-sm bg-green-600 hover:bg-green-700">Salvar e concluir</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Activity Modal */}
      {showNewModal && <NovaAtividadeModal onClose={() => setShowNewModal(false)} />}

      {/* Activity Drawer */}
      {selectedAtividade && <AtividadeDrawer atividade={selectedAtividade} onClose={() => setSelectedAtividade(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════
// NOVA ATIVIDADE MODAL
// ═══════════════════════════════════════

function NovaAtividadeModal({ onClose, defaultContactId, defaultDealId, defaultTipo }: { onClose: () => void; defaultContactId?: string; defaultDealId?: string; defaultTipo?: AtividadeTipo }) {
  const { contacts, users, deals, adicionarAtividade, getDealsForContact } = useApp();
  const [tipo, setTipo] = useState<AtividadeTipo>(defaultTipo || "follow_up");
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(defaultContactId || "");
  const [selectedDeal, setSelectedDeal] = useState(defaultDealId || "");
  const [showContactDD, setShowContactDD] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState("10:00");
  const [prioridade, setPrioridade] = useState<"alta" | "media" | "baixa">("media");
  const [vendedor, setVendedor] = useState("v1");
  const [lembrete, setLembrete] = useState(30);
  const [saving, setSaving] = useState(false);
  const [criarOutra, setCriarOutra] = useState(false);

  const filteredContacts = contactSearch ? contacts.filter(c => c.nome.toLowerCase().includes(contactSearch.toLowerCase())).slice(0, 5) : [];
  const selectedContactObj = contacts.find(c => c.id === selectedContact);
  const contactDeals = selectedContact ? getDealsForContact(selectedContact).filter(d => !d.status.startsWith("fechado")) : [];

  const placeholders: Record<AtividadeTipo, string> = {
    follow_up: "O que você vai verificar?",
    whatsapp: "Qual mensagem vai enviar?",
    ligacao: "Qual o objetivo da ligação?",
    orcamento: "Quais produtos orçar?",
    visita: "Objetivo e local da visita",
  };

  const handleSave = () => {
    if (!selectedContact || !titulo.trim()) { toast.error("Preencha cliente e título"); return; }
    setSaving(true);
    setTimeout(() => {
      adicionarAtividade({
        tipo, titulo, descricao: descricao || undefined, contact_id: selectedContact,
        deal_id: selectedDeal || undefined, vendedor_id: vendedor,
        data_agendada: `${data}T${hora}:00`, status: "pendente",
        prioridade, lembrete_minutos: lembrete,
      });
      toast.success(`Atividade criada para ${selectedContactObj?.nome}`);
      setSaving(false);
      if (criarOutra) { setTitulo(""); setDescricao(""); } else onClose();
    }, 600);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 overlay-backdrop" style={{ backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-[520px] animate-modal-enter max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Nova Atividade</h2>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded cursor-pointer"><X size={18} className="text-muted-foreground" /></button>
          </div>
          <div className="p-6 space-y-5">
            {/* Type selector */}
            <div>
              <label className="label-text mb-2 block">Tipo de atividade</label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(atividadeTipoConfig) as AtividadeTipo[]).map(t => {
                  const cfg = atividadeTipoConfig[t];
                  const TipoIcon = tipoIcons[t];
                  const selected = tipo === t;
                  return (
                    <button key={t} onClick={() => setTipo(t)}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl cursor-pointer transition-all"
                      style={{ height: 64, background: selected ? cfg.bg : "hsl(var(--secondary))", border: selected ? `2px solid ${cfg.color}` : "1px solid hsl(var(--border))" }}>
                      <TipoIcon size={18} style={{ color: selected ? cfg.color : "hsl(var(--muted-foreground))" }} />
                      <span className="text-[10px] font-medium" style={{ color: selected ? cfg.color : "hsl(var(--muted-foreground))" }}>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="label-text mb-1.5 block">Título *</label>
              <input className="input-matflow w-full" placeholder="Ex: Follow-up proposta cimento" value={titulo} onChange={e => setTitulo(e.target.value)} />
            </div>

            {/* Client */}
            <div className="relative">
              <label className="label-text mb-1.5 block">Cliente *</label>
              {selectedContactObj ? (
                <div className="input-matflow w-full flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: getAvatarColor(selectedContactObj.nome) }}>{getInitials(selectedContactObj.nome)}</div>
                    {selectedContactObj.nome}
                  </span>
                  <button onClick={() => { setSelectedContact(""); setContactSearch(""); setSelectedDeal(""); }} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <input className="input-matflow w-full" placeholder="Buscar cliente..." value={contactSearch}
                    onChange={e => { setContactSearch(e.target.value); setShowContactDD(true); }} onFocus={() => setShowContactDD(true)} />
                  {showContactDD && filteredContacts.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-[160px] overflow-y-auto">
                      {filteredContacts.map(c => (
                        <button key={c.id} onClick={() => { setSelectedContact(c.id); setContactSearch(c.nome); setShowContactDD(false); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-secondary cursor-pointer flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: getAvatarColor(c.nome) }}>{getInitials(c.nome)}</div>
                          {c.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              {selectedContact && contactDeals.length > 0 && (
                <div className="mt-2">
                  <label className="text-[11px] text-muted-foreground">Associar a um deal?</label>
                  <select className="input-matflow w-full text-sm mt-1" value={selectedDeal} onChange={e => setSelectedDeal(e.target.value)}>
                    <option value="">Nenhum</option>
                    {contactDeals.map(d => <option key={d.id} value={d.id}>{d.produto_principal} — {fmt(d.valor)}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Date / Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text mb-1.5 block">Data</label>
                <input type="date" className="input-matflow w-full text-sm" value={data} onChange={e => setData(e.target.value)} />
              </div>
              <div>
                <label className="label-text mb-1.5 block">Hora</label>
                <input type="time" className="input-matflow w-full text-sm" value={hora} onChange={e => setHora(e.target.value)} />
              </div>
            </div>

            {/* Priority + Vendedor + Lembrete */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label-text mb-1.5 block">Prioridade</label>
                <div className="flex gap-1">
                  {(["alta","media","baixa"] as const).map(p => (
                    <button key={p} onClick={() => setPrioridade(p)}
                      className={`flex-1 h-8 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${prioridade === p ? (p === "alta" ? "bg-destructive/10 text-destructive border border-destructive/30" : p === "media" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30" : "bg-secondary text-muted-foreground border border-border") : "bg-secondary text-muted-foreground border border-transparent"}`}>
                      {p === "alta" ? "🔴" : p === "media" ? "🟡" : "⚪"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-text mb-1.5 block">Vendedor</label>
                <select className="input-matflow w-full text-sm" value={vendedor} onChange={e => setVendedor(e.target.value)}>
                  {users.filter(u => u.role === "vendedor").map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text mb-1.5 block">Lembrete</label>
                <select className="input-matflow w-full text-sm" value={lembrete} onChange={e => setLembrete(Number(e.target.value))}>
                  <option value={0}>Sem lembrete</option>
                  <option value={15}>15 min antes</option>
                  <option value={30}>30 min antes</option>
                  <option value={60}>1h antes</option>
                  <option value={120}>2h antes</option>
                  <option value={1440}>1 dia antes</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label-text mb-1.5 block">Descrição</label>
              <textarea className="input-matflow w-full text-sm" rows={3} placeholder={placeholders[tipo]} value={descricao} onChange={e => setDescricao(e.target.value)} maxLength={500} />
              <div className="text-right text-[10px] text-muted-foreground mt-0.5">{descricao.length}/500</div>
            </div>
          </div>
          <div className="p-6 border-t border-border flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={criarOutra} onChange={e => setCriarOutra(e.target.checked)} className="accent-primary" />
              Criar outra ao salvar
            </label>
            <div className="flex gap-3">
              <button onClick={onClose} className="h-10 px-4 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm" style={{ opacity: saving ? 0.7 : 1 }}>{saving ? "Criando..." : "Criar atividade"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// ACTIVITY DRAWER
// ═══════════════════════════════════════

function AtividadeDrawer({ atividade, onClose }: { atividade: Atividade; onClose: () => void }) {
  const { getContact, getUser, deals, concluirAtividade, cancelarAtividade, atualizarAtividade, setActiveConversationId, setPipelineHighlightDealId, conversations } = useApp();
  const navigate = useNavigate();
  const contact = getContact(atividade.contact_id);
  const vendedor = getUser(atividade.vendedor_id);
  const deal = atividade.deal_id ? deals.find(d => d.id === atividade.deal_id) : null;
  const cfg = atividadeTipoConfig[atividade.tipo];
  const TipoIcon = tipoIcons[atividade.tipo];
  const [notas, setNotas] = useState("");
  const isConcluida = atividade.status === "concluida";

  const openConversation = () => {
    const conv = conversations.find(c => c.contact_id === atividade.contact_id && c.status !== "fechada");
    if (conv) { setActiveConversationId(conv.id); navigate("/conversas"); onClose(); }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 animate-fade-page" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 bg-card border-l border-border z-50 overflow-y-auto overflow-x-hidden animate-slide-in-right" style={{ width: 400, maxWidth: "90vw" }}>
        <div className="p-5 border-b border-border flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
              <TipoIcon size={20} style={{ color: cfg.color }} />
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold text-foreground">{atividade.titulo}</div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${atividade.status === "atrasada" ? "bg-destructive/10 text-destructive" : atividade.status === "concluida" ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                {atividade.status === "atrasada" ? "Atrasada" : atividade.status === "concluida" ? "Concluída" : "Pendente"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded cursor-pointer shrink-0"><X size={16} className="text-muted-foreground" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Details */}
          <div className="space-y-3">
            {contact && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Cliente</span>
                <button onClick={() => { navigate(`/clientes/${contact.id}`); onClose(); }} className="text-sm font-medium text-foreground hover:text-primary cursor-pointer transition-colors">{contact.nome}</button>
              </div>
            )}
            {deal && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Deal</span>
                <button onClick={() => { setPipelineHighlightDealId(deal.id); navigate("/pipeline"); onClose(); }} className="badge-orange text-[10px] cursor-pointer">{fmt(deal.valor)}</button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Data/Hora</span>
              <span className="text-sm font-mono text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{new Date(atividade.data_agendada).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Prioridade</span>
              <span className={`${prioridadeBadge[atividade.prioridade]} text-[10px]`}>{prioridadeLabel[atividade.prioridade]}</span>
            </div>
            {vendedor && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Vendedor</span>
                <span className="text-sm text-foreground">{vendedor.nome}</span>
              </div>
            )}
          </div>

          {atividade.descricao && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Descrição</div>
              <p className="text-sm text-foreground leading-relaxed">{atividade.descricao}</p>
            </div>
          )}

          {/* Quick actions */}
          {!isConcluida && (
            <div className="space-y-2 pt-2">
              {(atividade.tipo === "whatsapp" || atividade.tipo === "follow_up") && (
                <button onClick={openConversation} className="btn-primary w-full text-sm">
                  <MessageCircle size={14} /> Abrir conversa
                </button>
              )}
              {atividade.tipo === "ligacao" && (
                <button onClick={openConversation} className="btn-primary w-full text-sm">
                  <Phone size={14} /> Registrar ligação
                </button>
              )}
            </div>
          )}

          {/* Conclusion notes */}
          {atividade.notas_resultado && (
            <div className="rounded-lg p-3" style={{ background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.15)" }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-green-700 mb-1">Resultado</div>
              <p className="text-sm text-foreground">{atividade.notas_resultado}</p>
            </div>
          )}

          {/* History */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Histórico</div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" /><span>Criada por {vendedor?.nome || "—"} · {new Date(atividade.created_at).toLocaleDateString("pt-BR")}</span></div>
              {atividade.data_concluida && <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /><span>Concluída · {new Date(atividade.data_concluida).toLocaleString("pt-BR")}</span></div>}
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-border space-y-2">
            {!isConcluida ? (
              <>
                <button onClick={() => { concluirAtividade(atividade.id, notas || undefined); toast.success("✓ Atividade concluída!"); onClose(); }}
                  className="w-full h-9 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 cursor-pointer transition-colors">Concluir atividade</button>
                <button onClick={() => { cancelarAtividade(atividade.id); toast.info("Atividade cancelada"); onClose(); }}
                  className="w-full h-9 rounded-lg text-sm font-semibold text-destructive border border-destructive/30 hover:bg-destructive/10 cursor-pointer transition-colors">Cancelar atividade</button>
              </>
            ) : (
              <div className="text-center">
                <span className="badge-success text-xs">Concluída em {new Date(atividade.data_concluida!).toLocaleDateString("pt-BR")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export { NovaAtividadeModal };
