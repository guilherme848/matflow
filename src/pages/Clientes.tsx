import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, MessageSquare, Eye, MoreHorizontal, X } from "lucide-react";
import { clientes, type Cliente } from "@/data/mockData";
import EmptyState from "@/components/shared/EmptyState";

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

const freqBadge: Record<string, string> = {
  Recorrente: "badge-success",
  "Alto Valor": "badge-attention",
  Esporádico: "badge-neutral",
  Inativo: "badge-destructive-soft",
};

const canalBadge: Record<string, string> = {
  "Meta Ads": "badge-info",
  WhatsApp: "badge-success",
  Indicação: "badge-attention",
  Instagram: "badge-info",
  Balcão: "badge-neutral",
};

export default function Clientes() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Cliente | null>(null);

  const filtered = clientes.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.telefone.includes(search) ||
    (c.empresa?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Clientes" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6 flex-nowrap overflow-hidden">
          <span className="text-sm text-muted-foreground font-mono-kpi whitespace-nowrap shrink-0">248 contatos</span>
          <div className="relative flex-1 min-w-0 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="input-matflow w-full pl-9"
              placeholder="Buscar por nome, telefone ou empresa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input-matflow w-40 text-sm shrink-0 hidden md:block"><option>Canal de origem</option></select>
          <select className="input-matflow w-40 text-sm shrink-0 hidden md:block"><option>Ordenar por: LTV ↓</option></select>
          <button className="btn-primary text-sm shrink-0 whitespace-nowrap">+ Novo Cliente</button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="card-matflow">
            <EmptyState
              icon={Search}
              title="Nenhum cliente encontrado"
              subtitle="Tente buscar por telefone ou empresa"
            />
          </div>
        ) : (
          <div className="card-matflow overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 900 }}>
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "4%" }} />
                </colgroup>
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="label-text py-3 px-4">Cliente</th>
                    <th className="label-text py-3 px-3">Telefone</th>
                    <th className="label-text py-3 px-3">Canal</th>
                    <th className="label-text py-3 px-3">LTV Total</th>
                    <th className="label-text py-3 px-3">Última Compra</th>
                    <th className="label-text py-3 px-3">Frequência</th>
                    <th className="label-text py-3 px-3">Vendedor</th>
                    <th className="label-text py-3 px-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="table-row-hover border-t border-border cursor-pointer animate-card-enter"
                      style={{ animationDelay: `${i * 30}ms`, height: 48 }}
                    >
                      <td className="py-2 px-4 overflow-hidden">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0" style={{ background: getAvatarColor(c.nome) }}>
                            {getInitials(c.nome)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-foreground flex items-center gap-1.5 overflow-hidden">
                              <span className="truncate">{c.nome}</span>
                              {c.ltv >= 100000 && <span className="badge-strong text-[9px] py-0 shrink-0">VIP</span>}
                            </div>
                            {c.empresa && <span className="text-[11px] text-muted-foreground truncate block">{c.empresa}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-foreground font-mono-kpi text-xs whitespace-nowrap overflow-hidden text-ellipsis">{c.telefone}</td>
                      <td className="py-2 px-3 overflow-hidden"><span className={`${canalBadge[c.canal] || "badge-neutral"} whitespace-nowrap`}>{c.canal}</span></td>
                      <td className="py-2 px-3 font-mono-kpi font-bold text-foreground whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(c.ltv)}</td>
                      <td className="py-2 px-3 text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">{c.ultimaCompra}</td>
                      <td className="py-2 px-3 overflow-hidden"><span className={`${freqBadge[c.frequencia] || "badge-neutral"} whitespace-nowrap`}>{c.frequencia}</span></td>
                      <td className="py-2 px-3 text-muted-foreground truncate overflow-hidden">{c.vendedor}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <MessageSquare size={15} className="text-muted-foreground hover:text-primary cursor-pointer shrink-0" />
                          <Eye size={15} className="text-muted-foreground hover:text-primary cursor-pointer shrink-0" />
                          <MoreHorizontal size={15} className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Drawer overlay + panel */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 overlay-backdrop animate-fade-page"
            onClick={() => setSelected(null)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-[360px] max-w-[90vw] bg-card border-l border-border z-50 overflow-y-auto overflow-x-hidden animate-slide-in-right" style={{ boxShadow: "-4px 0 24px rgba(0,0,0,0.12)" }}>
            <div className="p-5 flex justify-between items-start border-b border-border">
              <div className="text-center flex-1 min-w-0">
                <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-primary-foreground mb-2" style={{ background: getAvatarColor(selected.nome) }}>
                  {getInitials(selected.nome)}
                </div>
                <div className="font-bold text-foreground truncate">{selected.nome}</div>
                {selected.empresa && <div className="text-xs text-muted-foreground truncate">{selected.empresa}</div>}
                <div className="text-sm text-muted-foreground truncate">{selected.telefone}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-secondary rounded cursor-pointer shrink-0">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 border-b border-border">
              <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.20)" }}>
                <div className="font-mono-kpi text-[28px] font-extrabold whitespace-nowrap" style={{ color: "#F97316", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(selected.ltv)}</div>
                <div className="text-xs text-muted-foreground mt-1">Valor total em compras</div>
              </div>
            </div>
            <div className="p-5 space-y-3 border-b border-border">
              <div className="flex justify-between text-sm overflow-hidden gap-2">
                <span className="text-muted-foreground shrink-0">Canal</span>
                <span className={`${canalBadge[selected.canal]} shrink-0`}>{selected.canal}</span>
              </div>
              <div className="flex justify-between text-sm overflow-hidden gap-2">
                <span className="text-muted-foreground shrink-0">Vendedor</span>
                <span className="font-medium text-foreground truncate">{selected.vendedor}</span>
              </div>
              <div className="flex justify-between text-sm overflow-hidden gap-2">
                <span className="text-muted-foreground shrink-0">Última compra</span>
                <span className="font-medium text-foreground whitespace-nowrap">{selected.ultimaCompra}</span>
              </div>
              <div className="flex justify-between text-sm overflow-hidden gap-2">
                <span className="text-muted-foreground shrink-0">Frequência</span>
                <span className={`${freqBadge[selected.frequencia]} shrink-0`}>{selected.frequencia}</span>
              </div>
            </div>
            <div className="p-5 border-b border-border">
              <div className="label-text mb-2">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map(t => <span key={t} className="badge-neutral cursor-pointer hover:opacity-80 transition-opacity">{t}</span>)}
              </div>
            </div>
            <div className="p-5 space-y-2">
              <button className="btn-primary w-full text-sm">Abrir conversa</button>
              <button className="w-full h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer">Ver pipeline</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
