import { useState } from "react";
import { X } from "lucide-react";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

function getAvatarColor(name: string) {
  const colors = ["#F97316", "#6366F1", "#0F766E", "#EAB308", "#EF4444", "#8B5CF6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }

const vendedoresMeta = [
  { nome: "Carlos Silva", realizado: 54000, meta: 70000 },
  { nome: "Ana Oliveira", realizado: 38000, meta: 50000 },
  { nome: "Ricardo Santos", realizado: 31000, meta: 50000 },
  { nome: "Fernanda Lima", realizado: 19000, meta: 30000 },
];

const metaGeral = 200000;
const realizado = 142000;
const pct = Math.round((realizado / metaGeral) * 100);
const projecao = 178000;
const diasRestantes = 8;

export default function MetasCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card-matflow animate-card-enter min-w-0 overflow-hidden" style={{ animationDelay: "180ms" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="section-title">Metas do Mês</div>
          <button onClick={() => setShowModal(true)} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Editar meta</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Overall */}
          <div>
            <div className="text-sm text-muted-foreground mb-1">Meta de Novembro</div>
            <div className="text-sm text-muted-foreground mb-2">{formatCurrency(metaGeral)}</div>
            <div className="font-mono-kpi text-[32px] font-extrabold text-primary leading-none mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(realizado)}</div>
            <div className="text-sm text-muted-foreground mb-3">{pct}% concluído</div>
            <div className="relative h-3 bg-secondary rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 90 ? "hsl(var(--success))" : pct > 70 ? "#EAB308" : "#F97316" }} />
              <div className="absolute top-0 bottom-0 w-px" style={{ left: "100%", borderLeft: "2px dashed hsl(var(--muted-foreground))" }} />
            </div>
            <div className="text-xs text-muted-foreground mb-1">{diasRestantes} dias úteis restantes</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Projeção: {formatCurrency(projecao)}</span>
              {projecao < metaGeral ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.10)", color: "hsl(var(--destructive))" }}>Abaixo da meta</span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(15,118,110,0.10)", color: "hsl(var(--success))" }}>No caminho certo</span>
              )}
            </div>
            {projecao < metaGeral && (
              <div className="text-xs text-destructive mt-1">Precisa de {formatCurrency(Math.ceil((metaGeral - realizado) / diasRestantes))}/dia para bater</div>
            )}
          </div>

          {/* Right - Per vendor */}
          <div>
            <div className="text-sm text-muted-foreground mb-3">Meta por Vendedor</div>
            <div className="space-y-3">
              {vendedoresMeta.map((v, i) => {
                const vPct = Math.round((v.realizado / v.meta) * 100);
                const isBest = i === 0;
                return (
                  <div key={v.nome} className={`flex items-center gap-3 ${isBest ? "border-l-2 pl-2" : ""}`} style={isBest ? { borderLeftColor: "#F97316" } : {}}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-foreground shrink-0" style={{ background: getAvatarColor(v.nome) }}>{getInitials(v.nome)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground truncate">{v.nome}</div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1" style={{ width: 150 }}>
                        <div className="h-full rounded-full" style={{ width: `${vPct}%`, background: "#F97316" }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono-kpi text-xs text-muted-foreground whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(v.realizado)} / {formatCurrency(v.meta)}</div>
                      <div className={`font-mono-kpi text-sm font-bold ${vPct < 65 ? "text-destructive" : "text-foreground"}`} style={{ fontVariantNumeric: "tabular-nums" }}>{vPct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowModal(true)} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer mt-3">Configurar metas</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--overlay)" }} onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl border border-border max-w-[480px] w-full mx-4 animate-modal-enter" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <span className="font-semibold text-foreground">Metas de Novembro</span>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label-text block mb-1">Meta geral da loja</label>
                <input className="input-matflow w-full font-mono-kpi" defaultValue="200000" type="number" />
              </div>
              <div className="border-t border-border pt-4">
                <div className="text-sm font-medium text-foreground mb-3">Metas individuais</div>
                {vendedoresMeta.map(v => (
                  <div key={v.nome} className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-foreground shrink-0" style={{ background: getAvatarColor(v.nome) }}>{getInitials(v.nome)}</div>
                    <span className="text-sm text-foreground flex-1 min-w-0 truncate">{v.nome}</span>
                    <input className="input-matflow w-28 font-mono-kpi text-sm" defaultValue={v.meta} type="number" />
                  </div>
                ))}
                <div className="text-xs text-muted-foreground mt-2">Total individual: {formatCurrency(vendedoresMeta.reduce((a, v) => a + v.meta, 0))}</div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button onClick={() => setShowModal(false)} className="text-muted-foreground text-sm cursor-pointer">Cancelar</button>
                <button onClick={() => setShowModal(false)} className="btn-primary">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
