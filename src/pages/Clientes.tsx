import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, MessageSquare, Eye, MoreHorizontal, X } from "lucide-react";
import { clientes, type Cliente } from "@/data/mockData";

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
    <div className="flex flex-col h-screen">
      <AppHeader title="Clientes" />
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-8">
          {/* Top bar */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">248 contatos</span>
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                className="input-matflow w-full pl-9"
                placeholder="Buscar por nome, telefone ou empresa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="input-matflow w-40 text-sm"><option>Canal de origem</option></select>
            <select className="input-matflow w-40 text-sm"><option>Ordenar por: LTV ↓</option></select>
            <button className="btn-primary text-sm ml-auto">+ Novo Cliente</button>
          </div>

          {/* Table */}
          <div className="card-matflow overflow-hidden p-0">
            <table className="w-full text-sm">
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
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0" style={{ background: getAvatarColor(c.nome) }}>
                          {getInitials(c.nome)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-1.5">
                            {c.nome}
                            {c.ltv >= 100000 && <span className="badge-strong text-[9px] py-0">VIP</span>}
                          </div>
                          {c.empresa && <span className="text-[11px] text-muted-foreground">{c.empresa}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-foreground">{c.telefone}</td>
                    <td className="py-2 px-3"><span className={canalBadge[c.canal] || "badge-neutral"}>{c.canal}</span></td>
                    <td className="py-2 px-3 font-mono-kpi font-bold text-foreground">{formatCurrency(c.ltv)}</td>
                    <td className="py-2 px-3 text-muted-foreground">{c.ultimaCompra}</td>
                    <td className="py-2 px-3"><span className={freqBadge[c.frequencia] || "badge-neutral"}>{c.frequencia}</span></td>
                    <td className="py-2 px-3 text-muted-foreground">{c.vendedor}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={15} className="text-muted-foreground hover:text-primary cursor-pointer" />
                        <Eye size={15} className="text-muted-foreground hover:text-primary cursor-pointer" />
                        <MoreHorizontal size={15} className="text-muted-foreground hover:text-foreground cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drawer */}
        {selected && (
          <div className="w-[300px] bg-card border-l border-border shrink-0 overflow-y-auto animate-card-enter">
            <div className="p-5 flex justify-between items-start border-b border-border">
              <div className="text-center flex-1">
                <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-primary-foreground mb-2" style={{ background: getAvatarColor(selected.nome) }}>
                  {getInitials(selected.nome)}
                </div>
                <div className="font-bold text-foreground">{selected.nome}</div>
                {selected.empresa && <div className="text-xs text-muted-foreground">{selected.empresa}</div>}
                <div className="text-sm text-muted-foreground">{selected.telefone}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-secondary rounded">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 border-b border-border">
              <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(249,115,22,0.06)" }}>
                <div className="font-mono-kpi text-[28px] font-extrabold" style={{ color: "#F97316" }}>{formatCurrency(selected.ltv)}</div>
                <div className="text-xs text-muted-foreground mt-1">Valor total em compras</div>
              </div>
            </div>
            <div className="p-5 space-y-3 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Canal</span>
                <span className={canalBadge[selected.canal]}>{selected.canal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vendedor</span>
                <span className="font-medium text-foreground">{selected.vendedor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Última compra</span>
                <span className="font-medium text-foreground">{selected.ultimaCompra}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frequência</span>
                <span className={freqBadge[selected.frequencia]}>{selected.frequencia}</span>
              </div>
            </div>
            <div className="p-5 border-b border-border">
              <div className="label-text mb-2">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map(t => <span key={t} className="badge-neutral">{t}</span>)}
              </div>
            </div>
            <div className="p-5 space-y-2">
              <button className="btn-primary w-full text-sm">Abrir conversa</button>
              <button className="w-full h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Ver pipeline</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
