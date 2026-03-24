import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, MessageSquare, ArrowRight, X } from "lucide-react";
import { pipelineData, type Deal } from "@/data/mockData";
import { toast } from "sonner";

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

export default function Pipeline() {
  const [pipeline, setPipeline] = useState(pipelineData);
  const [draggedDeal, setDraggedDeal] = useState<{ deal: Deal; fromCol: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col h-screen">
      <AppHeader title="Pipeline" />
      <div className="p-5 pb-0 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input-matflow pl-9 w-64" placeholder="Buscar deal ou cliente..." />
        </div>
        <select className="input-matflow w-48 text-sm">
          <option>Todos os vendedores</option>
        </select>
        <select className="input-matflow w-40 text-sm">
          <option>Todos os canais</option>
        </select>
        <button className="btn-primary ml-auto text-sm">+ Novo Deal</button>
      </div>

      <div className="flex-1 overflow-x-auto p-5">
        <div className="flex gap-4 h-full min-w-max">
          {Object.entries(pipeline).map(([key, col]) => {
            const total = col.deals.reduce((s, d) => s + d.valor, 0);
            const isLost = key === "fechadoPerdido";
            const isWon = key === "fechadoGanho";
            return (
              <div
                key={key}
                className={`w-[280px] rounded-2xl flex flex-col transition-colors ${dragOverCol === key ? "ring-2 ring-primary/30" : ""}`}
                style={{ background: colorMap[col.color] || "transparent" }}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(key); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(key)}
              >
                <div className="p-3 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground text-sm">{col.label}</span>
                    <span className="badge-neutral">{col.deals.length}</span>
                  </div>
                  <span className="font-mono-kpi text-xs text-muted-foreground">{formatCurrency(total)}</span>
                </div>
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
                  {col.deals.map((deal, i) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal, key)}
                      className={`card-matflow cursor-grab active:cursor-grabbing animate-card-enter group ${isLost ? "opacity-50" : ""}`}
                      style={{ animationDelay: `${i * 40}ms`, padding: "14px 16px" }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="font-semibold text-sm text-foreground">{deal.cliente}</div>
                          {deal.empresa && <div className="text-[11px] text-muted-foreground">{deal.empresa}</div>}
                        </div>
                        {isWon && <span className="text-success">✓</span>}
                      </div>
                      <div className="font-mono-kpi text-base font-bold text-foreground mb-1">{formatCurrency(deal.valor)}</div>
                      <div className="text-[12px] text-muted-foreground mb-2">{deal.produto}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] ${deal.diasEtapa > 5 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                          {deal.tempoEtapa}
                        </span>
                        <span className={originBadgeClass[deal.origem] || "badge-neutral"}>{deal.origem}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-foreground" style={{ background: getAvatarColor(deal.vendedor) }}>
                          {getInitials(deal.vendedor)}
                        </div>
                        <span className="text-[11px] text-muted-foreground flex-1">{deal.vendedor}</span>
                        <div className="hidden group-hover:flex gap-1">
                          <MessageSquare size={14} className="text-muted-foreground hover:text-primary cursor-pointer" />
                          <ArrowRight size={14} className="text-muted-foreground hover:text-primary cursor-pointer" />
                          <X size={14} className="text-muted-foreground hover:text-destructive cursor-pointer" />
                        </div>
                      </div>
                      {deal.motivo && (
                        <div className="mt-2 text-[11px] text-destructive">Motivo: {deal.motivo}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
