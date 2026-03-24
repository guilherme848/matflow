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
  const colors = ["#6366F1", "#0F766E", "#F97316", "#EAB308", "#EF4444"];
  return colors[name.charCodeAt(0) % 5];
}
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }

const dotColors: Record<string, string> = {
  novoLead: "#6366F1",
  emAtendimento: "#F97316",
  propostaAberta: "#EAB308",
  aguardando: "#8892A4",
  fechadoGanho: "#0F766E",
  fechadoPerdido: "#EF4444",
};

const originBadgeClass: Record<string, string> = {
  "Meta Ads": "badge-info",
  "WhatsApp": "badge-success",
  "Indicação": "badge-attention",
  "Balcão": "badge-neutral",
  "Instagram": "badge-info",
};

function tempoColor(dias: number) {
  if (dias <= 2) return { color: "hsl(var(--muted-foreground))", urgent: false };
  if (dias <= 5) return { color: "#EAB308", urgent: false };
  return { color: "#EF4444", urgent: true };
}

export default function Pipeline() {
  const [pipeline, setPipeline] = useState(pipelineData);
  const [draggedDeal, setDraggedDeal] = useState<{ deal: Deal; fromCol: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"kanban" | "followups">("kanban");
  const [followUpFilter, setFollowUpFilter] = useState<"all" | "d1" | "d3" | "d7">("all");
  const [followUpModal, setFollowUpModal] = useState<FollowUp | null>(null);
  const [selectedScript, setSelectedScript] = useState(0);

  const handleDragStart = (deal: Deal, colKey: string) => { setDraggedDeal({ deal, fromCol: colKey }); };
  const handleDrop = (toCol: string) => {
    if (!draggedDeal || draggedDeal.fromCol === toCol) { setDraggedDeal(null); setDragOverCol(null); return; }
    setPipeline(prev => {
      const n = { ...prev };
      n[draggedDeal.fromCol] = { ...n[draggedDeal.fromCol], deals: n[draggedDeal.fromCol].deals.filter(d => d.id !== draggedDeal.deal.id) };
      n[toCol] = { ...n[toCol], deals: [...n[toCol].deals, draggedDeal.deal] };
      return n;
    });
    toast.success(`${draggedDeal.deal.cliente} movido para ${pipeline[toCol].label}`);
    setDraggedDeal(null); setDragOverCol(null);
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
      <div className="px-6 lg:px-8 pt-3 flex gap-4 shrink-0 border-b border-border">
        <button onClick={() => setActiveTab("kanban")} className={`pb-2 text-sm font-medium cursor-pointer border-b-2 ${activeTab === "kanban" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`} style={{ transition: "color 120ms ease" }}>Kanban</button>
        <button onClick={() => setActiveTab("followups")} className={`pb-2 text-sm font-medium cursor-pointer border-b-2 flex items-center gap-2 ${activeTab === "followups" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`} style={{ transition: "color 120ms ease" }}>
          Follow-ups
          <span className="badge-attention text-[10px]">{followUps.length}</span>
        </button>
      </div>

      {activeTab === "kanban" ? (
        <>
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
              {Object.entries(pipeline).map(([key, col]) => {
                const total = col.deals.reduce((s, d) => s + d.valor, 0);
                const isLost = key === "fechadoPerdido";
                const isWon = key === "fechadoGanho";
                const isDragTarget = dragOverCol === key && draggedDeal?.fromCol !== key;
                return (
                  <div key={key}
                    className="flex flex-col shrink-0 overflow-hidden"
                    style={{
                      width: 272, minWidth: 272,
                      background: "hsl(var(--secondary))",
                      borderRadius: 12,
                      ...(isDragTarget ? { outline: "2px dashed #F97316", outlineOffset: -2, background: "rgba(249,115,22,0.04)" } : {}),
                    }}
                    onDragOver={e => { e.preventDefault(); setDragOverCol(key); }}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={() => handleDrop(key)}
                  >
                    <div className="shrink-0" style={{ padding: "14px 16px 10px" }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColors[key] || "#8892A4" }} />
                        <span className="text-[13px] font-semibold text-foreground truncate">{col.label}</span>
                        <span className="text-[11px] font-semibold px-2 rounded-full shrink-0" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", height: 18, lineHeight: "18px" }}>{col.deals.length}</span>
                      </div>
                      <span className="font-mono-kpi text-[11px] text-muted-foreground whitespace-nowrap">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-2" style={{ padding: "0 8px 8px" }}>
                      {col.deals.length === 0 ? (
                        <EmptyState icon={Plus} title="Nenhum deal aqui" action={{ label: "+ Adicionar deal", onClick: () => {} }} />
                      ) : (
                        col.deals.map((deal, i) => {
                          const tc = tempoColor(deal.diasEtapa);
                          return (
                            <div key={deal.id} draggable onDragStart={() => handleDragStart(deal, key)}
                              className={`bg-card border border-border cursor-grab active:cursor-grabbing animate-card-enter group overflow-hidden ${isLost ? "opacity-50" : ""}`}
                              style={{
                                borderRadius: 10, padding: 14,
                                animationDelay: `${i * 40}ms`,
                                ...(tc.urgent ? { borderTop: "2px solid hsl(var(--destructive))" } : {}),
                                ...(isWon ? { borderLeft: "3px solid #0F766E" } : {}),
                                transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                              }}
                              onMouseEnter={e => { if (!isLost) { const el = e.currentTarget; el.style.borderColor = "rgba(249,115,22,0.30)"; el.style.boxShadow = "0 2px 8px var(--shadow-color)"; el.style.transform = "translateY(-1px)"; } }}
                              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "hsl(var(--border))"; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                            >
                              <div className="text-sm font-semibold text-foreground truncate mb-0.5">{deal.cliente}</div>
                              {deal.empresa && <div className="text-[11px] text-muted-foreground truncate">{deal.empresa}</div>}
                              <div className="font-mono-kpi text-base font-bold text-foreground mt-1 whitespace-nowrap">{formatCurrency(deal.valor)}</div>
                              <div className="text-xs text-muted-foreground mt-1 truncate">{deal.produto}</div>
                              <div className="flex items-center justify-between gap-2 mt-2 overflow-hidden">
                                <span className="text-[11px] flex items-center gap-1 shrink-0 whitespace-nowrap" style={{ color: tc.color, fontWeight: tc.urgent ? 600 : 400 }}>
                                  {tc.urgent && <AlertCircle size={11} className="shrink-0" />}{deal.tempoEtapa}
                                </span>
                                <span className={`${originBadgeClass[deal.origem] || "badge-neutral"} text-[10px] shrink-0`}>{deal.origem}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border overflow-hidden">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: getAvatarColor(deal.vendedor) }}>{getInitials(deal.vendedor)}</div>
                                <span className="text-[11px] text-muted-foreground flex-1 min-w-0 truncate">{deal.vendedor}</span>
                                <div className="hidden group-hover:flex gap-1 shrink-0" style={{ transition: "opacity 120ms ease" }}>
                                  <MessageSquare size={13} className="text-muted-foreground hover:text-primary cursor-pointer" />
                                  <ArrowRight size={13} className="text-muted-foreground hover:text-primary cursor-pointer" />
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
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ padding: "20px 32px" }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { key: "all" as const, label: "Todos", count: followUps.length },
                  { key: "d1" as const, label: "D+1", count: d1.length },
                  { key: "d3" as const, label: "D+3", count: d3.length },
                  { key: "d7" as const, label: "D+7", count: d7.length },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setFollowUpFilter(tab.key)}
                    className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer ${followUpFilter === tab.key ? "text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                    style={{ background: followUpFilter === tab.key ? "#F97316" : "hsl(var(--secondary))", transition: "background-color 120ms ease, color 120ms ease" }}>
                    {tab.label} ({tab.count})
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-auto">{followUps.length} orçamentos aguardando</span>
              </div>

              {filteredFollowUps.length === 0 ? (
                <div className="card-matflow text-center py-12">
                  <CheckCircle size={40} className="text-success mx-auto mb-3" />
                  <div className="text-foreground font-semibold text-[15px]">Nenhum orçamento aguardando</div>
                  <div className="text-muted-foreground text-sm mt-1">Todos os follow-ups estão em dia</div>
                </div>
              ) : (
                filteredFollowUps.map(fu => (
                  <div key={fu.id} className={`card-matflow animate-card-enter overflow-hidden ${fu.tipo === "d7" ? "" : ""}`} style={fu.tipo === "d7" ? { borderLeft: "3px solid hsl(var(--destructive))" } : {}}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground truncate">{fu.cliente}</span>
                          {fu.empresa && <span className="text-xs text-muted-foreground truncate">· {fu.empresa}</span>}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1 truncate">{fu.produto}</div>
                        <div className="font-mono-kpi text-lg font-bold text-foreground">{formatCurrency(fu.valor)}</div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                        fu.tipo === "d1" ? "badge-attention" : fu.tipo === "d3" ? "badge-warning" : "badge-destructive-soft"
                      }`}>
                        {fu.tipo === "d1" ? "Retornar hoje" : fu.tipo === "d3" ? "Retornar em 2 dias" : "Urgente"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: getAvatarColor(fu.vendedor) }}>{getInitials(fu.vendedor)}</div>
                      <span className="truncate">{fu.vendedor}</span>
                      <span>·</span>
                      <span className="truncate">"{fu.ultimaMensagem}"</span>
                      <span>·</span>
                      <span className="shrink-0">{fu.tempoOrcamento}</span>
                    </div>
                    {fu.tipo === "d7" && <div className="text-xs text-destructive mt-2 font-medium">Último contato antes de arquivar</div>}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <button onClick={() => { setFollowUpModal(fu); setSelectedScript(0); }} className="btn-primary text-xs" style={{ height: 30 }}><Send size={11} className="mr-1" />Follow-up</button>
                      <button className="btn-outline-primary text-xs"><Eye size={11} className="mr-1" />Ver conversa</button>
                      <button className="text-xs text-success hover:underline cursor-pointer" onClick={() => toast.success(`${fu.cliente} fechado!`)}>Fechado</button>
                      <button className="text-xs text-muted-foreground hover:underline cursor-pointer">Desistiu</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </FeatureLock>
      )}

      {/* Follow-up Modal */}
      {followUpModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overlay-backdrop" onClick={() => setFollowUpModal(null)}>
          <div className="bg-card rounded-2xl border border-border max-w-[560px] w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-enter" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }} onClick={e => e.stopPropagation()}>
            <div className="border-b border-border flex items-center justify-between" style={{ padding: "20px 24px 16px" }}>
              <div>
                <div className="text-base font-semibold text-foreground">Follow-up — {followUpModal.cliente}</div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                  followUpModal.tipo === "d1" ? "badge-attention" : followUpModal.tipo === "d3" ? "badge-warning" : "badge-destructive-soft"
                }`}>{followUpModal.tipo === "d1" ? "D+1 — primeiro retorno" : followUpModal.tipo === "d3" ? "D+3 — segundo retorno" : "D+7 — último retorno"}</span>
              </div>
              <button onClick={() => setFollowUpModal(null)} className="text-muted-foreground hover:text-foreground cursor-pointer" style={{ transition: "color 120ms ease" }}><X size={18} /></button>
            </div>
            <div style={{ padding: "20px 24px" }} className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-2">Selecione o script:</div>
                {[
                  { label: "Script D+1", text: scripts[0] },
                  { label: "Mais direto", text: scripts[1] },
                  { label: "Mensagem personalizada", text: "" },
                ].map((s, i) => (
                  <label key={i} className={`block p-3 rounded-lg border mb-2 cursor-pointer ${selectedScript === i ? "border-primary" : "border-border"}`} style={{ background: selectedScript === i ? "rgba(249,115,22,0.04)" : "transparent", transition: "background-color 120ms ease, border-color 120ms ease" }}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="script" checked={selectedScript === i} onChange={() => setSelectedScript(i)} className="accent-primary" />
                      <span className="text-sm font-medium text-foreground">{s.label}</span>
                    </div>
                    {s.text && selectedScript === i && <p className="text-sm text-muted-foreground mt-2 ml-5" style={{ lineHeight: 1.5 }}>{s.text}</p>}
                    {i === 2 && selectedScript === 2 && <textarea className="input-matflow w-full mt-2 ml-5" rows={3} style={{ height: "auto", padding: 12 }} placeholder="Digite sua mensagem..." />}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border" style={{ padding: "16px 0 0" }}>
                <button onClick={() => setFollowUpModal(null)} className="text-sm text-muted-foreground cursor-pointer" style={{ transition: "color 120ms ease" }}>Cancelar</button>
                <button className="btn-primary" onClick={() => { setFollowUpModal(null); toast.success("Follow-up enviado!"); }}>Enviar agora</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
