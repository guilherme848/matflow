import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, MessageSquare, Eye, MoreHorizontal, X } from "lucide-react";
import { clientes, type Cliente } from "@/data/mockData";
import EmptyState from "@/components/shared/EmptyState";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}
function getAvatarColor(name: string) {
  const colors = ["#6366F1", "#0F766E", "#F97316", "#EAB308", "#EF4444"];
  return colors[name.charCodeAt(0) % 5];
}
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }

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
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" style={{ padding: "24px 32px" }}>
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6 flex-nowrap overflow-hidden">
          <span className="text-xs text-muted-foreground font-mono-kpi whitespace-nowrap shrink-0">248 contatos</span>
          <div className="relative flex-1 min-w-0 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="input-matflow w-full pl-9" placeholder="Buscar por nome, telefone ou empresa..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-matflow w-40 text-sm shrink-0 hidden md:block"><option>Canal de origem</option></select>
          <select className="input-matflow w-40 text-sm shrink-0 hidden md:block"><option>Ordenar por: LTV ↓</option></select>
          <button className="btn-primary text-sm shrink-0 whitespace-nowrap">+ Novo Cliente</button>
        </div>

        {filtered.length === 0 ? (
          <div className="card-matflow">
            <EmptyState icon={Search} title="Nenhum cliente encontrado" subtitle="Tente buscar por telefone ou empresa" />
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
                  <tr>
                    <th className="label-text py-0 px-4 text-left bg-secondary" style={{ height: 36, borderRadius: "8px 0 0 0" }}>Cliente</th>
                    <th className="label-text py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Telefone</th>
                    <th className="label-text py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Canal</th>
                    <th className="label-text py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>LTV Total</th>
                    <th className="label-text py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Última Compra</th>
                    <th className="label-text py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Frequência</th>
                    <th className="label-text py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Vendedor</th>
                    <th className="label-text py-0 px-3 text-left bg-secondary" style={{ height: 36, borderRadius: "0 8px 0 0" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} onClick={() => setSelected(c)}
                      className="table-row-hover border-t border-border cursor-pointer animate-card-enter group"
                      style={{ animationDelay: `${i * 25}ms`, height: 48 }}>
                      <td className="py-0 px-4 overflow-hidden">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: getAvatarColor(c.nome) }}>{getInitials(c.nome)}</div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground flex items-center gap-1.5 overflow-hidden">
                              <span className="truncate">{c.nome}</span>
                              {c.ltv >= 100000 && <span className="badge-strong text-[9px] py-0 shrink-0">VIP</span>}
                            </div>
                            {c.empresa && <span className="text-[11px] text-muted-foreground truncate block">{c.empresa}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-0 px-3 font-mono-kpi text-xs text-foreground whitespace-nowrap overflow-hidden text-ellipsis">{c.telefone}</td>
                      <td className="py-0 px-3 overflow-hidden"><span className={`${canalBadge[c.canal] || "badge-neutral"} text-[10px]`}>{c.canal}</span></td>
                      <td className="py-0 px-3 font-mono-kpi font-bold text-foreground whitespace-nowrap">{formatCurrency(c.ltv)}</td>
                      <td className="py-0 px-3 text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis text-xs">{c.ultimaCompra}</td>
                      <td className="py-0 px-3 overflow-hidden"><span className={`${freqBadge[c.frequencia] || "badge-neutral"} text-[10px]`}>{c.frequencia}</span></td>
                      <td className="py-0 px-3 text-muted-foreground truncate overflow-hidden text-xs">{c.vendedor}</td>
                      <td className="py-0 px-3">
                        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 120ms ease" }}>
                          <MessageSquare size={14} className="text-muted-foreground hover:text-primary cursor-pointer" />
                          <Eye size={14} className="text-muted-foreground hover:text-primary cursor-pointer" />
                          <MoreHorizontal size={14} className="text-muted-foreground hover:text-foreground cursor-pointer" />
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

      {/* Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 overlay-backdrop animate-fade-page" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 bottom-0 bg-card border-l border-border z-50 overflow-y-auto overflow-x-hidden animate-slide-in-right" style={{ width: 360, maxWidth: "90vw", boxShadow: "-4px 0 24px rgba(0,0,0,0.12)" }}>
            <div className="p-5 flex justify-between items-start border-b border-border">
              <div className="text-center flex-1 min-w-0">
                <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-white mb-2" style={{ background: getAvatarColor(selected.nome) }}>{getInitials(selected.nome)}</div>
                <div className="font-semibold text-foreground truncate">{selected.nome}</div>
                {selected.empresa && <div className="text-xs text-muted-foreground truncate">{selected.empresa}</div>}
                <div className="text-sm text-muted-foreground truncate">{selected.telefone}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-secondary rounded cursor-pointer shrink-0" style={{ transition: "background-color 120ms ease" }}>
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 border-b border-border">
              <div className="rounded-xl p-4 text-center" style={{ background: "rgba(249,115,22,0.06)" }}>
                <div className="font-mono-kpi text-[28px] font-bold whitespace-nowrap" style={{ color: "#F97316", letterSpacing: "-0.5px" }}>{formatCurrency(selected.ltv)}</div>
                <div className="text-xs text-muted-foreground mt-1">Valor total em compras</div>
              </div>
            </div>
            <div className="p-5 space-y-3 border-b border-border">
              {[
                { label: "Canal", val: <span className={`${canalBadge[selected.canal]} text-[10px]`}>{selected.canal}</span> },
                { label: "Vendedor", val: <span className="font-medium text-foreground truncate">{selected.vendedor}</span> },
                { label: "Última compra", val: <span className="text-foreground">{selected.ultimaCompra}</span> },
                { label: "Frequência", val: <span className={`${freqBadge[selected.frequencia]} text-[10px]`}>{selected.frequencia}</span> },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center text-sm gap-2">
                  <span className="text-muted-foreground shrink-0">{r.label}</span>
                  {r.val}
                </div>
              ))}
            </div>
            <div className="p-5 border-b border-border">
              <div className="label-text mb-2">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map(t => <span key={t} className="badge-neutral cursor-pointer">{t}</span>)}
              </div>
            </div>
            <div className="p-5 space-y-2">
              <button className="btn-primary w-full text-sm">Abrir conversa</button>
              <button className="w-full rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary cursor-pointer" style={{ height: 36, transition: "background-color 120ms ease" }}>Ver pipeline</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
