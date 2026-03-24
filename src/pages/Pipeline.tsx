import { useState, useEffect, useRef } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, MessageSquare, AlertCircle, Plus, X, LayoutGrid, List, User, MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { useApp, pipelineColumns, origens, type Deal } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "@/components/shared/EmptyState";

function fmt(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }); }
function getAvatarColor(name: string) { const c = ["#6366F1","#0F766E","#F97316","#EAB308","#EF4444"]; return c[name.charCodeAt(0) % 5]; }
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
function tempoColor(dias: number) {
  if (dias <= 2) return { color: "hsl(var(--muted-foreground))", urgent: false };
  if (dias <= 5) return { color: "#EAB308", urgent: false };
  return { color: "#EF4444", urgent: true };
}

const originBadge: Record<string, string> = { "Meta Ads": "badge-info", WhatsApp: "badge-success", Indicação: "badge-orange", Balcão: "badge-neutral", Instagram: "badge-info" };

export default function Pipeline() {
  const { deals, contacts, users, conversations, moverDeal, fecharDeal, atualizarDeal, adicionarDeal, setActiveConversationId, pipelineHighlightDealId, setPipelineHighlightDealId, getContact, getUser } = useApp();
  const navigate = useNavigate();
  const [draggedDeal, setDraggedDeal] = useState<{ deal: Deal; fromStatus: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // View toggle
  const [viewMode, setViewMode] = useState<"kanban" | "list">(() => (localStorage.getItem("matflow-pipeline-view") as "kanban" | "list") || "kanban");
  useEffect(() => { localStorage.setItem("matflow-pipeline-view", viewMode); }, [viewMode]);

  // Filters
  const [search, setSearch] = useState("");
  const [filterVendedor, setFilterVendedor] = useState("");
  const [filterOrigem, setFilterOrigem] = useState("");
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [lostMotivo, setLostMotivo] = useState("");

  // List sort
  const [sortCol, setSortCol] = useState<"valor" | "dias_na_etapa" | "status">("valor");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Auto-scroll to highlighted deal
  useEffect(() => {
    if (pipelineHighlightDealId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      const timer = setTimeout(() => setPipelineHighlightDealId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [pipelineHighlightDealId, setPipelineHighlightDealId]);

  const handleDrop = (toStatus: Deal["status"]) => {
    if (!draggedDeal || draggedDeal.fromStatus === toStatus) { setDraggedDeal(null); setDragOverCol(null); return; }
    moverDeal(draggedDeal.deal.id, toStatus);
    const col = pipelineColumns.find(c => c.key === toStatus);
    toast.success(`${getContact(draggedDeal.deal.contact_id)?.nome} movido para ${col?.label}`);
    setDraggedDeal(null); setDragOverCol(null);
  };

  const openConversation = (deal: Deal) => {
    if (deal.conversation_id) { setActiveConversationId(deal.conversation_id); navigate('/conversas'); }
  };

  // Filtered deals
  const filteredDeals = deals.filter(d => {
    const contact = getContact(d.contact_id);
    if (search && !contact?.nome.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterVendedor && d.vendedor_id !== filterVendedor) return false;
    if (filterOrigem && d.origem !== filterOrigem) return false;
    return true;
  });

  const activeFilters = [filterVendedor, filterOrigem].filter(Boolean).length;

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const sortedListDeals = [...filteredDeals].sort((a, b) => {
    const m = sortDir === "asc" ? 1 : -1;
    if (sortCol === "valor") return (a.valor - b.valor) * m;
    if (sortCol === "dias_na_etapa") return (a.dias_na_etapa - b.dias_na_etapa) * m;
    return a.status.localeCompare(b.status) * m;
  });

  // Sync selectedDeal with state
  useEffect(() => {
    if (selectedDeal) {
      const updated = deals.find(d => d.id === selectedDeal.id);
      if (updated && updated.status !== selectedDeal.status) setSelectedDeal(updated);
    }
  }, [deals, selectedDeal]);

  const SortIcon = ({ col }: { col: typeof sortCol }) => (
    sortCol === col ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronDown size={12} className="opacity-30" />
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Pipeline" />

      {/* Toolbar */}
      <div className="px-6 lg:px-8 py-3 flex items-center gap-2 shrink-0 overflow-hidden flex-wrap">
        <div className="relative shrink-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input-matflow pl-9 w-52" placeholder="Buscar cliente ou deal..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"><X size={14} /></button>}
        </div>
        <select className="input-matflow w-44 text-sm shrink-0" value={filterVendedor} onChange={e => setFilterVendedor(e.target.value)}>
          <option value="">Todos vendedores</option>
          {users.filter(u => u.role === "vendedor").map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
        <select className="input-matflow w-36 text-sm shrink-0" value={filterOrigem} onChange={e => setFilterOrigem(e.target.value)}>
          <option value="">Todas origens</option>
          {origens.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {activeFilters > 0 && <button onClick={() => { setFilterVendedor(""); setFilterOrigem(""); setSearch(""); }} className="text-xs text-primary hover:underline cursor-pointer shrink-0">Limpar filtros</button>}

        <div className="flex-1" />

        <div className="flex bg-secondary rounded-lg p-0.5 border border-border shrink-0">
          <button onClick={() => setViewMode("kanban")} className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${viewMode === "kanban" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            <LayoutGrid size={13} /> Kanban
          </button>
          <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            <List size={13} /> Lista
          </button>
        </div>

        <button onClick={() => setShowNewDeal(true)} className="btn-primary text-sm shrink-0 whitespace-nowrap">+ Novo Deal</button>
      </div>

      <div className="px-6 lg:px-8 mb-2 shrink-0">
        <span className="text-xs text-muted-foreground">Mostrando {filteredDeals.length} de {deals.length} deals</span>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === "kanban" && (
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden" style={{ padding: "0 32px 32px" }}>
          <div className="flex h-full" style={{ gap: 12, minWidth: "min-content" }}>
            {pipelineColumns.map(col => {
              const colDeals = filteredDeals.filter(d => d.status === col.key);
              const total = colDeals.reduce((s, d) => s + d.valor, 0);
              const isLost = col.key === "fechado_perdido";
              const isWon = col.key === "fechado_ganho";
              const isDragTarget = dragOverCol === col.key && draggedDeal?.fromStatus !== col.key;
              return (
                <div key={col.key} className="flex flex-col shrink-0 overflow-hidden rounded-xl" style={{ width: 272, minWidth: 272, background: "hsl(var(--secondary))", ...(isDragTarget ? { outline: "2px dashed #F97316", outlineOffset: -2, background: "rgba(249,115,22,0.04)" } : {}) }}
                  onDragOver={e => { e.preventDefault(); setDragOverCol(col.key); }} onDragLeave={() => setDragOverCol(null)} onDrop={() => handleDrop(col.key)}>
                  <div className="shrink-0" style={{ padding: "14px 16px 10px" }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: col.dotColor }} />
                      <span className="text-[13px] font-semibold text-foreground truncate">{col.label}</span>
                      <span className="text-[11px] font-semibold px-2 rounded-full shrink-0 bg-background border border-border" style={{ height: 18, lineHeight: "18px" }}>{colDeals.length}</span>
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(total)}</span>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-2" style={{ padding: "0 8px 8px" }}>
                    {colDeals.length === 0 ? (
                      <EmptyState icon={Plus} title="Nenhum deal" />
                    ) : colDeals.map(deal => {
                      const contact = getContact(deal.contact_id);
                      const vendedor = getUser(deal.vendedor_id);
                      const tc = tempoColor(deal.dias_na_etapa);
                      const isHighlighted = pipelineHighlightDealId === deal.id;
                      const conv = conversations.find(c => c.id === deal.conversation_id);
                      const hasUnread = conv && conv.nao_lidas > 0;
                      return (
                        <div key={deal.id} ref={isHighlighted ? highlightRef : undefined} draggable
                          onDragStart={() => setDraggedDeal({ deal, fromStatus: deal.status })}
                          onClick={() => setSelectedDeal(deal)}
                          className={`bg-card border cursor-grab active:cursor-grabbing group overflow-hidden transition-all ${isLost ? "opacity-50" : ""} ${isHighlighted ? "animate-pulse ring-2 ring-primary ring-offset-2" : ""}`}
                          style={{ borderRadius: 10, padding: 14, borderColor: isHighlighted ? "#F97316" : "hsl(var(--border))", ...(tc.urgent ? { borderTop: "2px solid hsl(var(--destructive))" } : {}), ...(isWon ? { borderLeft: "3px solid #0F766E" } : {}) }}
                          onMouseEnter={e => { if (!isLost) { e.currentTarget.style.borderColor = "rgba(249,115,22,0.30)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; } }}
                          onMouseLeave={e => { if (!isHighlighted) { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.boxShadow = "none"; } }}>
                          <button onClick={e => { e.stopPropagation(); navigate(`/clientes/${deal.contact_id}`); }}
                            className="text-sm font-semibold text-foreground truncate mb-0.5 hover:text-primary transition-colors cursor-pointer block text-left w-full">
                            {contact?.nome}
                          </button>
                          <div className="font-mono text-base font-bold text-foreground mt-1 whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(deal.valor)}</div>
                          <div className="flex items-center justify-between gap-2 mt-2 overflow-hidden">
                            <span className="text-[11px] flex items-center gap-1 shrink-0 whitespace-nowrap" style={{ color: tc.color, fontWeight: tc.urgent ? 600 : 400 }}>
                              {tc.urgent && <AlertCircle size={11} className="shrink-0" />}há {deal.dias_na_etapa}d
                            </span>
                            <span className={`${originBadge[deal.origem] || "badge-neutral"} text-[10px] shrink-0`}>{deal.origem}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border overflow-hidden">
                            {vendedor && (
                              <>
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: vendedor.avatar_cor }}>{getInitials(vendedor.nome)}</div>
                                <span className="text-[11px] text-muted-foreground flex-1 min-w-0 truncate">{vendedor.nome}</span>
                              </>
                            )}
                            <div className="flex gap-1.5 shrink-0">
                              {hasUnread && <span className="badge-danger text-[9px] py-0">● {conv!.nao_lidas}</span>}
                              {deal.conversation_id && (
                                <button onClick={e => { e.stopPropagation(); openConversation(deal); }} className={`cursor-pointer transition-colors ${hasUnread ? "text-primary" : "text-muted-foreground hover:text-primary"}`}><MessageSquare size={13} /></button>
                              )}
                              <button onClick={e => { e.stopPropagation(); navigate(`/clientes/${deal.contact_id}`); }} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"><User size={13} /></button>
                            </div>
                          </div>
                          {deal.motivo && <div className="mt-2 text-[11px] text-destructive truncate">Motivo: {deal.motivo}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 lg:px-8 pb-8">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 800 }}>
                <colgroup>
                  <col style={{ width: "22%" }} /><col style={{ width: "14%" }} /><col style={{ width: "16%" }} />
                  <col style={{ width: "12%" }} /><col style={{ width: "14%" }} /><col style={{ width: "10%" }} /><col style={{ width: "12%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">Cliente</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-3 px-3 text-left cursor-pointer" onClick={() => toggleSort("valor")}>
                      <span className="flex items-center gap-1">Valor <SortIcon col="valor" /></span>
                    </th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-3 px-3 text-left cursor-pointer" onClick={() => toggleSort("status")}>
                      <span className="flex items-center gap-1">Etapa <SortIcon col="status" /></span>
                    </th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-3 px-3 text-left">Origem</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-3 px-3 text-left">Vendedor</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-3 px-3 text-left cursor-pointer" onClick={() => toggleSort("dias_na_etapa")}>
                      <span className="flex items-center gap-1">Tempo <SortIcon col="dias_na_etapa" /></span>
                    </th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-3 px-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedListDeals.map(deal => {
                    const contact = getContact(deal.contact_id);
                    const vendedor = getUser(deal.vendedor_id);
                    const tc = tempoColor(deal.dias_na_etapa);
                    const col = pipelineColumns.find(c => c.key === deal.status);
                    return (
                      <tr key={deal.id} onClick={() => setSelectedDeal(deal)} className="border-t border-border cursor-pointer hover:bg-secondary/50 transition-colors" style={{ height: 48 }}>
                        <td className="py-0 px-4"><span className="text-sm font-medium text-foreground truncate block">{contact?.nome}</span></td>
                        <td className="py-0 px-3 font-mono font-bold text-foreground whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(deal.valor)}</td>
                        <td className="py-0 px-3"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: `${col?.dotColor}18`, color: col?.dotColor }}>{col?.label}</span></td>
                        <td className="py-0 px-3"><span className={`${originBadge[deal.origem] || "badge-neutral"} text-[10px]`}>{deal.origem}</span></td>
                        <td className="py-0 px-3 text-muted-foreground text-xs truncate">{vendedor?.nome}</td>
                        <td className="py-0 px-3"><span className="text-[11px] whitespace-nowrap" style={{ color: tc.color }}>há {deal.dias_na_etapa}d</span></td>
                        <td className="py-0 px-3">
                          <div className="flex gap-1.5">
                            {deal.conversation_id && <button onClick={e => { e.stopPropagation(); openConversation(deal); }} className="text-muted-foreground hover:text-primary cursor-pointer"><MessageSquare size={13} /></button>}
                            <button onClick={e => { e.stopPropagation(); navigate(`/clientes/${deal.contact_id}`); }} className="text-muted-foreground hover:text-primary cursor-pointer"><User size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NEW DEAL MODAL */}
      {showNewDeal && <NewDealModal onClose={() => setShowNewDeal(false)} />}

      {/* DEAL DRAWER */}
      {selectedDeal && <DealDrawer deal={selectedDeal} onClose={() => setSelectedDeal(null)} />}
    </div>
  );
}

function NewDealModal({ onClose }: { onClose: () => void }) {
  const { contacts, users, adicionarDeal } = useApp();
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [valor, setValor] = useState("");
  const [etapa, setEtapa] = useState<Deal["status"]>("novo_lead");
  const [origem, setOrigem] = useState("Meta Ads");
  const [vendedor, setVendedor] = useState("v1");
  const [obs, setObs] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredContacts = contactSearch ? contacts.filter(c => c.nome.toLowerCase().includes(contactSearch.toLowerCase())).slice(0, 5) : [];
  const selectedContactObj = contacts.find(c => c.id === selectedContact);

  const handleSave = () => {
    if (!selectedContact || !valor) { toast.error("Preencha cliente e valor"); return; }
    setSaving(true);
    setTimeout(() => {
      adicionarDeal({
        contact_id: selectedContact,
        vendedor_id: vendedor,
        conversation_id: null,
        status: etapa,
        valor: parseFloat(valor.replace(/\D/g, "")) / 100 || 0,
        produto_principal: "Novo negócio",
        produtos: [],
        origem,
        created_at: new Date().toISOString().split("T")[0],
        dias_na_etapa: 0,
        observacao: obs || null,
      });
      toast.success("Deal criado com sucesso");
      setSaving(false);
      onClose();
    }, 800);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 overlay-backdrop animate-fade-page" style={{ backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-[480px] animate-modal-enter" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Novo Deal</h2>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded cursor-pointer"><X size={18} className="text-muted-foreground" /></button>
          </div>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="relative">
              <label className="label-text mb-1.5 block">Cliente *</label>
              {selectedContactObj ? (
                <div className="input-matflow w-full flex items-center justify-between">
                  <span className="text-sm">{selectedContactObj.nome}</span>
                  <button onClick={() => { setSelectedContact(""); setContactSearch(""); }} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <input className="input-matflow w-full" placeholder="Buscar cliente..." value={contactSearch}
                    onChange={e => { setContactSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)} />
                  {showDropdown && filteredContacts.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                      {filteredContacts.map(c => (
                        <button key={c.id} onClick={() => { setSelectedContact(c.id); setContactSearch(c.nome); setShowDropdown(false); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-secondary cursor-pointer flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: getAvatarColor(c.nome) }}>{getInitials(c.nome)}</div>
                          {c.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div><label className="label-text mb-1.5 block">Valor estimado *</label><input className="input-matflow w-full" placeholder="R$ 0,00" value={valor} onChange={e => setValor(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-text mb-1.5 block">Etapa</label>
                <select className="input-matflow w-full text-sm" value={etapa} onChange={e => setEtapa(e.target.value as Deal["status"])}>
                  {pipelineColumns.filter(c => !c.key.startsWith("fechado")).map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div><label className="label-text mb-1.5 block">Origem</label>
                <select className="input-matflow w-full text-sm" value={origem} onChange={e => setOrigem(e.target.value)}>
                  {origens.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div><label className="label-text mb-1.5 block">Vendedor</label>
              <select className="input-matflow w-full text-sm" value={vendedor} onChange={e => setVendedor(e.target.value)}>
                {users.filter(u => u.role === "vendedor").map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
              </select>
            </div>
            <div><label className="label-text mb-1.5 block">Observação</label><textarea className="input-matflow w-full" rows={2} placeholder="Detalhes do negócio..." value={obs} onChange={e => setObs(e.target.value)} /></div>
          </div>
          <div className="p-6 border-t border-border flex justify-end gap-3">
            <button onClick={onClose} className="h-10 px-4 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm" style={{ opacity: saving ? 0.7 : 1 }}>{saving ? "Criando..." : "Criar deal"}</button>
          </div>
        </div>
      </div>
    </>
  );
}

function DealDrawer({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const { getContact, getUser, moverDeal, fecharDeal, atualizarDeal, setActiveConversationId, users, getAtividadesByDeal, concluirAtividade } = useApp();
  const navigate = useNavigate();
  const contact = getContact(deal.contact_id);
  const vendedor = getUser(deal.vendedor_id);
  const [editingObs, setEditingObs] = useState(deal.observacao || "");
  const [showLostModal, setShowLostModal] = useState(false);
  const [lostMotivo, setLostMotivo] = useState("Preço");

  const openConv = () => {
    if (deal.conversation_id) { setActiveConversationId(deal.conversation_id); navigate('/conversas'); onClose(); }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 animate-fade-page" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 bg-card border-l border-border z-50 overflow-y-auto overflow-x-hidden animate-slide-in-right" style={{ width: 380, maxWidth: "90vw" }}>
        <div className="p-5 border-b border-border flex justify-between items-start">
          <div className="min-w-0">
            <button onClick={() => { navigate(`/clientes/${deal.contact_id}`); onClose(); }} className="text-base font-semibold text-foreground truncate hover:text-primary transition-colors cursor-pointer block">{contact?.nome}</button>
            <div className="font-mono text-xl font-bold text-primary mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(deal.valor)}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded cursor-pointer shrink-0"><X size={16} className="text-muted-foreground" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-2">
            {deal.conversation_id && <button onClick={openConv} className="btn-primary text-xs flex-1"><MessageSquare size={12} /> Ver conversa</button>}
            <button onClick={() => { navigate(`/clientes/${deal.contact_id}`); onClose(); }} className="btn-outline text-xs flex-1">Ver cliente</button>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Etapa</div>
            <select className="input-matflow w-full text-sm" value={deal.status}
              onChange={e => { moverDeal(deal.id, e.target.value as Deal["status"]); toast.success("Etapa atualizada"); }}>
              {pipelineColumns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Vendedor</div>
            <select className="input-matflow w-full text-sm" value={deal.vendedor_id}
              onChange={e => { atualizarDeal(deal.id, { vendedor_id: e.target.value }); toast.success("Vendedor atualizado"); }}>
              {users.filter(u => u.role === "vendedor").map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Observações</div>
            <textarea className="input-matflow w-full text-sm" rows={3} value={editingObs} onChange={e => setEditingObs(e.target.value)}
              onBlur={() => { atualizarDeal(deal.id, { observacao: editingObs || null }); }}
              placeholder="Detalhes do negócio..." />
            <div className="text-[10px] text-muted-foreground mt-1">Salva automaticamente</div>
          </div>

          {/* Atividades do Deal */}
          <DealAtividades dealId={deal.id} contactId={deal.contact_id} onClose={onClose} />

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Movimentações</div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" /><span>Criado como {pipelineColumns.find(c => c.key === "novo_lead")?.label} · {deal.created_at}</span></div>
              {deal.status !== "novo_lead" && <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /><span>Movido para {pipelineColumns.find(c => c.key === deal.status)?.label} · há {deal.dias_na_etapa}d</span></div>}
            </div>
          </div>

          {!deal.status.startsWith("fechado") && (
            <div className="pt-4 border-t border-border space-y-2">
              <button onClick={() => { fecharDeal(deal.id, true); toast.success("🎉 Venda fechada! +" + fmt(deal.valor)); onClose(); }}
                className="w-full h-9 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 cursor-pointer transition-colors">Fechar como Ganho</button>
              {!showLostModal ? (
                <button onClick={() => setShowLostModal(true)}
                  className="w-full h-9 rounded-lg text-sm font-semibold text-destructive border border-destructive hover:bg-destructive/10 cursor-pointer transition-colors">Fechar como Perdido</button>
              ) : (
                <div className="p-3 rounded-lg border border-destructive/30 space-y-2">
                  <div className="text-xs font-semibold text-foreground">Motivo da perda</div>
                  {["Preço", "Concorrente", "Sem resposta", "Outro"].map(m => (
                    <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="motivo" checked={lostMotivo === m} onChange={() => setLostMotivo(m)} className="accent-destructive" />{m}
                    </label>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setShowLostModal(false)} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Cancelar</button>
                    <button onClick={() => { fecharDeal(deal.id, false, lostMotivo); toast.info("Deal marcado como perdido"); onClose(); }}
                      className="text-xs font-semibold text-destructive cursor-pointer hover:underline">Confirmar</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
