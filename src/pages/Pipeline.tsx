import { useState, useEffect, useRef } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, MessageSquare, AlertCircle, Plus, X } from "lucide-react";
import { useApp, pipelineColumns, type Deal } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "@/components/shared/EmptyState";

function fmt(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }); }
function getAvatarColor(name: string) {
  const colors = ["#6366F1", "#0F766E", "#F97316", "#EAB308", "#EF4444"];
  return colors[name.charCodeAt(0) % 5];
}
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
function tempoColor(dias: number) {
  if (dias <= 2) return { color: "hsl(var(--muted-foreground))", urgent: false };
  if (dias <= 5) return { color: "#EAB308", urgent: false };
  return { color: "#EF4444", urgent: true };
}

const originBadge: Record<string, string> = {
  "Meta Ads": "badge-info", "WhatsApp": "badge-success", "Indicação": "badge-orange",
  "Balcão": "badge-neutral", "Instagram": "badge-info",
};

export default function Pipeline() {
  const { deals, contacts, users, conversations, moverDeal, fecharDeal, setActiveConversationId, pipelineHighlightDealId, setPipelineHighlightDealId, getContact, getUser } = useApp();
  const navigate = useNavigate();
  const [draggedDeal, setDraggedDeal] = useState<{ deal: Deal; fromStatus: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

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
    if (deal.conversation_id) {
      setActiveConversationId(deal.conversation_id);
      navigate('/conversas');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Pipeline" />
      <div className="px-6 lg:px-8 py-4 flex items-center gap-3 shrink-0 overflow-hidden flex-nowrap">
        <div className="relative shrink-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input-matflow pl-9 w-56" placeholder="Buscar deal..." />
        </div>
        <select className="input-matflow w-44 text-sm shrink-0"><option>Todos os vendedores</option></select>
        <button className="btn-primary ml-auto text-sm shrink-0 whitespace-nowrap">+ Novo Deal</button>
      </div>

      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden" style={{ padding: "0 32px 32px" }}>
        <div className="flex h-full" style={{ gap: 12, minWidth: "min-content" }}>
          {pipelineColumns.map(col => {
            const colDeals = deals.filter(d => d.status === col.key);
            const total = colDeals.reduce((s, d) => s + d.valor, 0);
            const isLost = col.key === "fechado_perdido";
            const isWon = col.key === "fechado_ganho";
            const isDragTarget = dragOverCol === col.key && draggedDeal?.fromStatus !== col.key;
            return (
              <div key={col.key}
                className="flex flex-col shrink-0 overflow-hidden rounded-xl"
                style={{
                  width: 272, minWidth: 272,
                  background: "hsl(var(--secondary))",
                  ...(isDragTarget ? { outline: "2px dashed #F97316", outlineOffset: -2, background: "rgba(249,115,22,0.04)" } : {}),
                }}
                onDragOver={e => { e.preventDefault(); setDragOverCol(col.key); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(col.key)}
              >
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
                    <EmptyState icon={Plus} title="Nenhum deal aqui" action={{ label: "+ Adicionar deal", onClick: () => {} }} />
                  ) : (
                    colDeals.map(deal => {
                      const contact = getContact(deal.contact_id);
                      const vendedor = getUser(deal.vendedor_id);
                      const tc = tempoColor(deal.dias_na_etapa);
                      const isHighlighted = pipelineHighlightDealId === deal.id;
                      const conv = conversations.find(c => c.id === deal.conversation_id);
                      const hasUnread = conv && conv.nao_lidas > 0;
                      return (
                        <div key={deal.id}
                          ref={isHighlighted ? highlightRef : undefined}
                          draggable
                          onDragStart={() => setDraggedDeal({ deal, fromStatus: deal.status })}
                          onClick={() => setSelectedDeal(deal)}
                          className={`bg-card border cursor-grab active:cursor-grabbing group overflow-hidden transition-all ${isLost ? "opacity-50" : ""} ${isHighlighted ? "animate-pulse ring-2 ring-primary ring-offset-2" : ""}`}
                          style={{
                            borderRadius: 10, padding: 14,
                            borderColor: isHighlighted ? "#F97316" : "hsl(var(--border))",
                            ...(tc.urgent ? { borderTop: "2px solid hsl(var(--destructive))" } : {}),
                            ...(isWon ? { borderLeft: "3px solid #0F766E" } : {}),
                          }}
                          onMouseEnter={e => { if (!isLost) { e.currentTarget.style.borderColor = "rgba(249,115,22,0.30)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; } }}
                          onMouseLeave={e => { if (!isHighlighted) { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.boxShadow = "none"; } }}
                        >
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${deal.contact_id}`); }}
                            className="text-sm font-semibold text-foreground truncate mb-0.5 hover:text-primary transition-colors cursor-pointer block text-left w-full">
                            {contact?.nome}
                          </button>
                          <div className="font-mono text-base font-bold text-foreground mt-1 whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(deal.valor)}</div>
                          <div className="text-xs text-muted-foreground mt-1 truncate">{deal.produto_principal}</div>
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
                                <button onClick={(e) => { e.stopPropagation(); openConversation(deal); }}
                                  className={`cursor-pointer transition-colors ${hasUnread ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                                  <MessageSquare size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                          {deal.motivo && <div className="mt-2 text-[11px] text-destructive truncate">Motivo: {deal.motivo}</div>}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deal Drawer */}
      {selectedDeal && (() => {
        const contact = getContact(selectedDeal.contact_id);
        const vendedor = getUser(selectedDeal.vendedor_id);
        return (
          <>
            <div className="fixed inset-0 z-40 bg-black/40 animate-fade-page" onClick={() => setSelectedDeal(null)} />
            <div className="fixed right-0 top-0 bottom-0 bg-card border-l border-border z-50 overflow-y-auto overflow-x-hidden animate-slide-in-right" style={{ width: 380, maxWidth: "90vw" }}>
              <div className="p-5 border-b border-border flex justify-between items-start">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-foreground truncate">{contact?.nome}</div>
                  <div className="font-mono text-xl font-bold text-primary mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(selectedDeal.valor)}</div>
                </div>
                <button onClick={() => setSelectedDeal(null)} className="p-1 hover:bg-secondary rounded cursor-pointer shrink-0"><X size={16} className="text-muted-foreground" /></button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex gap-2">
                  {selectedDeal.conversation_id && (
                    <button onClick={() => { openConversation(selectedDeal); setSelectedDeal(null); }} className="btn-primary text-xs flex-1">
                      <MessageSquare size={12} /> Ver conversa
                    </button>
                  )}
                  <button onClick={() => { navigate(`/clientes/${selectedDeal.contact_id}`); setSelectedDeal(null); }} className="btn-outline text-xs flex-1">Ver cliente</button>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Etapa</div>
                  <select
                    className="input-matflow w-full text-sm"
                    value={selectedDeal.status}
                    onChange={e => { moverDeal(selectedDeal.id, e.target.value as Deal["status"]); setSelectedDeal({ ...selectedDeal, status: e.target.value as Deal["status"] }); toast.success("Etapa atualizada"); }}
                  >
                    {pipelineColumns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Produto</div>
                  <div className="text-sm text-foreground">{selectedDeal.produto_principal}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDeal.produtos.map(p => <span key={p} className="badge-neutral text-[10px]">{p}</span>)}
                  </div>
                </div>

                {selectedDeal.observacao && (
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Observação</div>
                    <div className="text-sm text-muted-foreground">{selectedDeal.observacao}</div>
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Vendedor</div>
                  <div className="flex items-center gap-2">
                    {vendedor && <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: vendedor.avatar_cor }}>{getInitials(vendedor.nome)}</div>}
                    <span className="text-sm text-foreground">{vendedor?.nome}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <button onClick={() => { fecharDeal(selectedDeal.id, true); setSelectedDeal(null); toast.success("🎉 Venda fechada! +" + fmt(selectedDeal.valor)); }}
                    className="w-full h-9 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 cursor-pointer transition-colors">
                    Fechar como Ganho
                  </button>
                  <button onClick={() => { fecharDeal(selectedDeal.id, false, "Preço"); setSelectedDeal(null); toast.info("Deal fechado como perdido"); }}
                    className="w-full h-9 rounded-lg text-sm font-semibold text-destructive border border-destructive hover:bg-destructive/10 cursor-pointer transition-colors">
                    Fechar como Perdido
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
