import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, MessageSquare, ArrowRight, X, AlertCircle, Plus, CheckCircle, Send, Eye } from "lucide-react";
import { pipelineData, type Deal, followUps, type FollowUp } from "@/data/mockData";
import { toast } from "sonner";
import EmptyState from "@/components/shared/EmptyState";
import { FeatureLock } from "@/components/FeatureLock";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

function getAvatarColor(name: string) {
  const colors = ["#F97316", "#6366F1", "#0F766E", "#EAB308", "#EF4444", "#8B5CF6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

const colorMap: Record<string, string> = {
  info: "rgba(99,102,241,0.08)",
  attention: "rgba(249,115,22,0.08)",
  warning: "rgba(234,179,8,0.08)",
  neutral: "rgba(15,23,42,0.04)",
  success: "rgba(15,118,110,0.08)",
  destructive: "rgba(239,68,68,0.06)",
};

const originBadgeClass: Record<string, string> = {
  "Meta Ads": "badge-info",
  "WhatsApp": "badge-success",
  "Indicação": "badge-attention",
  "Balcão": "badge-neutral",
  "Instagram": "badge-info",
};

function tempoColor(dias: number) {
  if (dias <= 2) return { color: "hsl(215,17%,44%)", icon: false };
  if (dias <= 5) return { color: "#EAB308", icon: false };
  return { color: "#EF4444", icon: true };
}

export default function Pipeline() {
  const [pipeline, setPipeline] = useState(pipelineData);
  const [draggedDeal, setDraggedDeal] = useState<{ deal: Deal; fromCol: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"kanban" | "followups">("kanban");
  const [followUpFilter, setFollowUpFilter] = useState<"all" | "d1" | "d3" | "d7">("all");
  const [followUpModal, setFollowUpModal] = useState<FollowUp | null>(null);
  const [selectedScript, setSelectedScript] = useState(0);

  const handleDragStart = (deal: Deal, colKey: string) => {
    setDraggedDeal({ deal, fromCol: colKey });
  };

  const handleDrop = (toCol: string) => {
    if (!draggedDeal || draggedDeal.fromCol === toCol) {
      setDraggedDeal(null);
      setDragOverCol(null);
      return;
    }
    setPipeline(prev => {
      const newPipeline = { ...prev };
      newPipeline[draggedDeal.fromCol] = {
        ...newPipeline[draggedDeal.fromCol],
        deals: newPipeline[draggedDeal.fromCol].deals.filter(d => d.id !== draggedDeal.deal.id),
      };
      newPipeline[toCol] = {
        ...newPipeline[toCol],
        deals: [...newPipeline[toCol].deals, draggedDeal.deal],
      };
      return newPipeline;
    });
    toast.success(`${draggedDeal.deal.cliente} movido para ${pipeline[toCol].label}`);
    setDraggedDeal(null);
    setDragOverCol(null);
  };

  const d1 = followUps.filter(f => f.tipo === "d1");
  const d3 = followUps.filter(f => f.tipo === "d3");
  const d7 = followUps.filter(f => f.tipo === "d7");
  const filteredFollowUps = followUpFilter === "all" ? followUps : followUps.filter(f => f.tipo === followUpFilter);

  const scripts = [
    `Oi ${followUpModal?.cliente || "[nome]"}! Passando para saber se teve alguma dúvida sobre o orçamento que enviei ontem. Posso te ajudar a fechar?`,
    `Oi ${followUpModal?.cliente || "[nome]"}, o orçamento de ${followUpModal?.produto || "[produto]"} ainda está disponível. Vamos fechar?`,
    "",
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Pipeline" />

      {/* Tabs */}
      <div className="px-5 pt-3 flex gap-4 shrink-0 border-b border-border">
        <button onClick={() => setActiveTab("kanban")} className={`pb-2 text-sm font-medium cursor-pointer border-b-2 transition-colors ${activeTab === "kanban" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Kanban</button>
        <button onClick={() => setActiveTab("followups")} className={`pb-2 text-sm font-medium cursor-pointer border-b-2 transition-colors flex items-center gap-2 ${activeTab === "followups" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          Follow-ups
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}>{followUps.length} pendentes</span>
        </button>
      </div>

      {activeTab === "kanban" ? (
        <>
          {/* Filters bar */}
          <div className="px-5 py-4 flex items-center gap-3 shrink-0 overflow-hidden flex-nowrap">
            <div className="relative shrink-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className="input-matflow pl-9 w-64" placeholder="Buscar deal ou cliente..." />
            </div>
            <select className="input-matflow w-48 text-sm shrink-0">
              <option>Todos os vendedores</option>
            </select>
            <select className="input-matflow w-40 text-sm shrink-0">
              <option>Todos os canais</option>
            </select>
            <button className="btn-primary ml-auto text-sm shrink-0 whitespace-nowrap">+ Novo Deal</button>
          </div>

          {/* Kanban columns */}
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-5 pb-5">
            <div className="flex gap-4 h-full" style={{ minWidth: "min-content" }}>
              {Object.entries(pipeline).map(([key, col]) => {
                const total = col.deals.reduce((s, d) => s + d.valor, 0);
                const isLost = key === "fechadoPerdido";
                const isWon = key === "fechadoGanho";
                const isDragTarget = dragOverCol === key && draggedDeal?.fromCol !== key;
                return (
                  <div
                    key={key}
                    className={`w-[280px] min-w-[280px] max-w-[280px] rounded-2xl flex flex-col shrink-0 overflow-hidden transition-all ${isDragTarget ? "ring-2 ring-dashed" : ""}`}
                    style={{
                      background: isDragTarget ? "rgba(249,115,22,0.04)" : (colorMap[col.color] || "transparent"),
                      ...(isDragTarget ? { outline: "2px dashed #F97316", outlineOffset: "-2px" } : {}),
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOverCol(key); }}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={() => handleDrop(key)}
                  >
                    <div className="p-3 pb-2 shrink-0" style={{ background: colorMap[col.color] || "transparent" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-foreground text-sm truncate">{col.label}</span>
                        <span className="badge-neutral shrink-0">{col.deals.length}</span>
                      </div>
                      <span className="font-mono-kpi text-xs text-muted-foreground whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 pb-3 space-y-2">
                      {col.deals.length === 0 ? (
                        <EmptyState icon={Plus} title="Nenhum deal aqui" action={{ label: "+ Adicionar deal", onClick: () => {} }} />
                      ) : (
                        col.deals.map((deal, i) => {
                          const tc = tempoColor(deal.diasEtapa);
                          return (
                            <div key={deal.id} draggable onDragStart={() => handleDragStart(deal, key)}
                              className={`bg-card rounded-2xl border border-border cursor-grab active:cursor-grabbing animate-card-enter group transition-all overflow-hidden ${isLost ? "opacity-60" : "hover:-translate-y-px"} ${isWon ? "border-l-[3px]" : ""}`}
                              style={{ animationDelay: `${i * 40}ms`, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", ...(isWon ? { borderLeftColor: "#0F766E" } : {}) }}
                              onMouseEnter={(e) => { if (!isLost) (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"; }}>
                              <div className="flex items-start justify-between mb-1 gap-2 overflow-hidden">
                                <div className="min-w-0">
                                  <div className="font-semibold text-sm text-foreground truncate">{deal.cliente}</div>
                                  {deal.empresa && <div className="text-[11px] text-muted-foreground truncate">{deal.empresa}</div>}
                                </div>
                                {isWon && <span className="text-success font-bold shrink-0">✓</span>}
                              </div>
                              <div className="font-mono-kpi text-base font-bold text-foreground mb-1 whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(deal.valor)}</div>
                              <div className="text-[12px] text-muted-foreground mb-2 truncate">{deal.produto}</div>
                              <div className="flex items-center justify-between gap-2 overflow-hidden">
                                <span className="text-[11px] flex items-center gap-1 shrink-0 whitespace-nowrap" style={{ color: tc.color, fontWeight: tc.icon ? 600 : 400 }}>
                                  {tc.icon && <AlertCircle size={12} className="shrink-0" />}{deal.tempoEtapa}
                                </span>
                                <span className={`${originBadgeClass[deal.origem] || "badge-neutral"} shrink-0 whitespace-nowrap`}>{deal.origem}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border overflow-hidden">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-foreground shrink-0" style={{ background: getAvatarColor(deal.vendedor) }}>{getInitials(deal.vendedor)}</div>
                                <span className="text-[11px] text-muted-foreground flex-1 min-w-0 truncate">{deal.vendedor}</span>
                                <div className="hidden group-hover:flex gap-1 shrink-0">
                                  <MessageSquare size={14} className="text-muted-foreground hover:text-primary cursor-pointer" />
                                  <ArrowRight size={14} className="text-muted-foreground hover:text-primary cursor-pointer" />
                                  <X size={14} className="text-muted-foreground hover:text-destructive cursor-pointer" />
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
        </>
      ) : (
        <FeatureLock feature="Follow-ups Automáticos" description="Acompanhe orçamentos pendentes com follow-up D+1, D+3 e D+7">
          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
            {/* Follow-up filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { key: "all" as const, label: "Todos", count: followUps.length },
                { key: "d1" as const, label: "D+1", count: d1.length },
                { key: "d3" as const, label: "D+3", count: d3.length },
                { key: "d7" as const, label: "D+7", count: d7.length },
              ].map(tab => (
                <button key={tab.key} onClick={() => setFollowUpFilter(tab.key)}
                  className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-colors ${followUpFilter === tab.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {tab.label} ({tab.count})
                </button>
              ))}
              <span className="text-sm text-muted-foreground ml-auto">{followUps.length} orçamentos aguardando retorno</span>
            </div>

            {filteredFollowUps.length === 0 ? (
              <div className="card-matflow text-center py-12">
                <CheckCircle size={48} className="text-success mx-auto mb-3" />
                <div className="text-foreground font-semibold">Nenhum orçamento aguardando retorno</div>
                <div className="text-muted-foreground text-sm mt-1">Todos os follow-ups estão em dia</div>
              </div>
            ) : (
              filteredFollowUps.map(fu => (
                <div key={fu.id} className={`card-matflow animate-card-enter overflow-hidden ${fu.tipo === "d7" ? "border-l-[3px]" : ""}`} style={fu.tipo === "d7" ? { borderLeftColor: "hsl(var(--destructive))" } : {}}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground truncate">{fu.cliente}</span>
                        {fu.empresa && <span className="text-xs text-muted-foreground truncate">· {fu.empresa}</span>}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1 truncate">{fu.produto}</div>
                      <div className="font-mono-kpi text-lg font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(fu.valor)}</div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 whitespace-nowrap ${
                      fu.tipo === "d1" ? "bg-primary/15 text-primary" : fu.tipo === "d3" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                    }`}>
                      {fu.tipo === "d1" ? "Retornar hoje" : fu.tipo === "d3" ? "Retornar em 2 dias" : "Urgente — último follow-up"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-foreground shrink-0" style={{ background: getAvatarColor(fu.vendedor) }}>{getInitials(fu.vendedor)}</div>
                    <span className="truncate">{fu.vendedor}</span>
                    <span className="mx-1">·</span>
                    <span className="truncate">"{fu.ultimaMensagem}"</span>
                    <span className="mx-1">·</span>
                    <span className="shrink-0">{fu.tempoOrcamento}</span>
                  </div>
                  {fu.tipo === "d7" && <div className="text-xs text-destructive mt-2 font-medium">Último contato antes de arquivar</div>}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <button onClick={() => { setFollowUpModal(fu); setSelectedScript(0); }} className="btn-primary text-xs"><Send size={12} className="mr-1" />Enviar follow-up</button>
                    <button className="btn-outline-primary text-xs"><Eye size={12} className="mr-1" />Ver conversa</button>
                    <button className="text-xs text-success hover:underline cursor-pointer" onClick={() => toast.success(`${fu.cliente} marcado como fechado!`)}>Marcar como fechado</button>
                    <button className="text-xs text-muted-foreground hover:underline cursor-pointer">Desistiu</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </FeatureLock>
      )}

      {/* Follow-up Modal */}
      {followUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--overlay)" }} onClick={() => setFollowUpModal(null)}>
          <div className="bg-card rounded-2xl border border-border max-w-[560px] w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-enter" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">Follow-up — {followUpModal.cliente}</div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                  followUpModal.tipo === "d1" ? "bg-primary/15 text-primary" : followUpModal.tipo === "d3" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                }`}>{followUpModal.tipo === "d1" ? "D+1 — primeiro retorno" : followUpModal.tipo === "d3" ? "D+3 — segundo retorno" : "D+7 — último retorno"}</span>
              </div>
              <button onClick={() => setFollowUpModal(null)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-2">Selecione o script:</div>
                {[
                  { label: "Script D+1", text: scripts[0] },
                  { label: "Mais direto", text: scripts[1] },
                  { label: "Mensagem personalizada", text: "" },
                ].map((s, i) => (
                  <label key={i} className={`block p-3 rounded-lg border mb-2 cursor-pointer transition-colors ${selectedScript === i ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="script" checked={selectedScript === i} onChange={() => setSelectedScript(i)} className="accent-primary" />
                      <span className="text-sm font-medium text-foreground">{s.label}</span>
                    </div>
                    {i < 2 && <div className="text-sm text-muted-foreground mt-1 ml-6">{s.text}</div>}
                    {i === 2 && selectedScript === 2 && <textarea className="input-matflow w-full mt-2 ml-6" rows={3} placeholder="Digite sua mensagem..." />}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <span className="text-muted-foreground">Criar alerta D+3 automaticamente</span>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button onClick={() => setFollowUpModal(null)} className="text-muted-foreground text-sm hover:text-foreground cursor-pointer">Cancelar</button>
                <button onClick={() => { toast.success(`Follow-up enviado para ${followUpModal.cliente}!`); setFollowUpModal(null); }} className="btn-primary">Enviar agora</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
