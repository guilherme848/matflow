import { MapPin, Maximize, HardHat, Package, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { obrasMock, estagiosObra } from "@/data/clientePerfilData";
import { useState } from "react";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

const tipoColors: Record<string, string> = {
  "Construção": "badge-orange",
  "Reforma": "badge-info",
  "Ampliação": "badge-success",
  "Acabamento": "badge-neutral",
};

export default function TabObras() {
  const [expanded, setExpanded] = useState<number | null>(1);

  if (obrasMock.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <HardHat size={48} className="text-muted-foreground mb-4" />
        <p className="text-[15px] font-medium text-foreground mb-1">Nenhuma obra cadastrada</p>
        <p className="text-[13px] text-muted-foreground mb-4">Adicione a obra para acompanhar o potencial de compras</p>
        <button className="btn-primary text-sm"><Plus size={14} /> Cadastrar primeira obra</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div />
        <button className="btn-primary text-sm"><Plus size={14} /> Nova Obra</button>
      </div>
      <div className="space-y-4">
        {obrasMock.map(obra => {
          const estagioIndex = estagiosObra.indexOf(obra.estagio as any);
          const progress = ((estagioIndex + 1) / estagiosObra.length) * 100;
          const isExpanded = expanded === obra.id;
          const potencial = obra.materiaisPendentes.reduce((a, m) => a + m.valorEstimado, 0);
          const gastoPercent = Math.round((obra.gastoLoja / obra.orcamentoTotal) * 100);

          return (
            <div key={obra.id} className={`bg-card border border-border rounded-xl overflow-hidden ${!obra.ativa ? "opacity-60" : ""}`}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={tipoColors[obra.tipo] || "badge-neutral"}>{obra.tipo}</span>
                  <span className="text-base font-semibold text-foreground">{obra.nome}</span>
                  {!obra.ativa && <span className="badge-success">Concluída</span>}
                  {obra.ativa && potencial > 0 && (
                    <span className="badge-orange animate-pulse">Oportunidade</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground">{obra.estagio}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full max-w-[200px]">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><MapPin size={12} /> {obra.endereco.split("—")[0]}</div>
                  <div className="flex items-center gap-1.5"><Maximize size={12} /> {obra.area} m²</div>
                  {obra.comodos && <div>{obra.comodos}</div>}
                  <div>Prazo: {obra.prazo}</div>
                  <div>Orçamento: {fmt(obra.orcamentoTotal)}</div>
                  <div>Gasto na loja: {fmt(obra.gastoLoja)} ({gastoPercent}%)</div>
                </div>

                <div className="mt-3">
                  <div className="h-1.5 bg-secondary rounded-full">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${gastoPercent}%` }} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">{gastoPercent}% do orçamento da obra foi comprado aqui</div>
                </div>

                <button
                  className="text-xs text-primary hover:underline mt-3 flex items-center gap-1 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : obra.id)}
                >
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {isExpanded ? "Recolher detalhes" : "Ver detalhes"}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-border p-5 bg-secondary/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Materiais comprados</div>
                      <div className="space-y-1.5">
                        {obra.materiaisComprados.map((m, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <Package size={12} className="text-muted-foreground shrink-0" />
                            <span className="text-foreground flex-1">{m.nome}</span>
                            <span className="text-muted-foreground">{m.qtd}</span>
                            <span className="font-mono font-semibold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(m.valor)}</span>
                          </div>
                        ))}
                        <div className="text-xs font-semibold text-foreground pt-1 border-t border-border">
                          Total: {fmt(obra.materiaisComprados.reduce((a, m) => a + m.valor, 0))}
                        </div>
                      </div>
                    </div>
                    {obra.materiaisPendentes.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Materiais pendentes (estimado)</div>
                        <div className="space-y-1.5">
                          {obra.materiaisPendentes.map((m, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <Package size={12} className="text-warning shrink-0" />
                              <span className="text-foreground flex-1">{m.nome}</span>
                              <span className="text-muted-foreground">{m.qtd}</span>
                              <span className="font-mono text-muted-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>~{fmt(m.valorEstimado)}</span>
                            </div>
                          ))}
                          <div className="text-xs font-semibold text-primary pt-1 border-t border-border">
                            Potencial: ~{fmt(potencial)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {obra.notas && (
                    <div className="mt-3 text-xs text-muted-foreground italic">📝 {obra.notas}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
