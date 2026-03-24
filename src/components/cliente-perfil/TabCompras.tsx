import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { comprasDetalhadas, categoriasPie } from "@/data/clientePerfilData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export default function TabCompras() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const total = comprasDetalhadas.reduce((a, c) => a + c.valor, 0);

  return (
    <div>
      {/* Stats */}
      <div className="flex gap-4 mb-5 flex-wrap">
        {[
          [`${comprasDetalhadas.length} compras`, "Total de pedidos"],
          [fmt(total), "Valor total"],
          [fmt(Math.round(total / comprasDetalhadas.length)), "Ticket médio"],
        ].map(([val, label]) => (
          <div key={label as string} className="bg-card border border-border rounded-xl px-4 py-3">
            <div className="font-mono text-sm font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{val}</div>
            <div className="text-[11px] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-left px-4 py-2.5 w-[10%]">Data</th>
              <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-left px-4 py-2.5 w-[30%]">Produtos</th>
              <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-left px-4 py-2.5 w-[8%]">Itens</th>
              <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-left px-4 py-2.5 w-[15%]">Valor</th>
              <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-left px-4 py-2.5 w-[12%]">Pagamento</th>
              <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-left px-4 py-2.5 w-[12%]">Vendedor</th>
              <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-left px-4 py-2.5 w-[13%]"></th>
            </tr>
          </thead>
          <tbody>
            {comprasDetalhadas.map((c, i) => (
              <>
                <tr
                  key={i}
                  className="border-t border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">{c.data}</td>
                  <td className="px-4 py-3 text-foreground font-medium text-sm truncate">{c.produtos}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{c.qtdItens}</td>
                  <td className="px-4 py-3 font-mono font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(c.valor)}</td>
                  <td className="px-4 py-3"><span className="badge-neutral text-[10px]">{c.pagamento}</span></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{c.vendedor}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {expanded === i ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                    </div>
                  </td>
                </tr>
                {expanded === i && (
                  <tr key={`exp-${i}`}>
                    <td colSpan={7} className="bg-secondary/30 px-6 py-4 border-t border-border">
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            <th className="text-left text-muted-foreground font-semibold pb-1.5">Produto</th>
                            <th className="text-left text-muted-foreground font-semibold pb-1.5">SKU</th>
                            <th className="text-left text-muted-foreground font-semibold pb-1.5">Qtd</th>
                            <th className="text-left text-muted-foreground font-semibold pb-1.5">Preço unit.</th>
                            <th className="text-left text-muted-foreground font-semibold pb-1.5">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.itens.map((item, j) => (
                            <tr key={j} className="border-t border-border/50">
                              <td className="py-1.5 text-foreground">{item.nome}</td>
                              <td className="py-1.5 font-mono text-muted-foreground">{item.sku}</td>
                              <td className="py-1.5 text-foreground">{item.qtd} {item.unidade}</td>
                              <td className="py-1.5 font-mono text-muted-foreground">{fmt(item.precoUnit)}</td>
                              <td className="py-1.5 font-mono font-semibold text-foreground">{fmt(item.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {c.desconto && <span>Desconto: {c.desconto}</span>}
                        <span>Frete: {c.frete}</span>
                      </div>
                      <button className="btn-outline text-xs mt-3 h-7 px-2.5"><RotateCcw size={11} /> Repetir pedido</button>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t-2 border-border text-sm font-semibold text-foreground">
          Total: {fmt(total)} em {comprasDetalhadas.length} compras · 12 produtos diferentes
        </div>
      </div>

      {/* Category Donut */}
      <div className="mt-5 bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Categorias Mais Compradas</h3>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={categoriasPie} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" stroke="none">
                {categoriasPie.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {categoriasPie.map(c => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.fill }} />
                <span className="text-foreground font-medium">{c.name}</span>
                <span className="text-muted-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
