import { timelineCompleta } from "@/data/clientePerfilData";
import { useState } from "react";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

const dotColors: Record<string, string> = {
  compra: "#0F766E",
  conversa: "#6366F1",
  followup: "#EAB308",
  deal: "#F97316",
  tag: "#5D6B82",
  nota: "#8B5CF6",
  cadastro: "#F97316",
};

const filtros = ["Todos", "Compras", "Conversas", "Follow-ups", "Tags", "Notas"];
const filtroMap: Record<string, string[]> = {
  "Todos": [],
  "Compras": ["compra"],
  "Conversas": ["conversa"],
  "Follow-ups": ["followup"],
  "Tags": ["tag"],
  "Notas": ["nota"],
};

function groupByMonth(events: typeof timelineCompleta) {
  const groups: { label: string; events: typeof timelineCompleta }[] = [];
  let current = "";
  for (const ev of events) {
    const [d, m, y] = ev.data.split("/");
    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const label = `${monthNames[parseInt(m)]} ${y}`;
    if (label !== current) {
      current = label;
      groups.push({ label, events: [] });
    }
    groups[groups.length - 1].events.push(ev);
  }
  return groups;
}

export default function TabHistorico() {
  const [filtro, setFiltro] = useState("Todos");

  const filtered = filtro === "Todos"
    ? timelineCompleta
    : timelineCompleta.filter(ev => filtroMap[filtro]?.includes(ev.tipo));

  const groups = groupByMonth(filtered);

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {filtros.map(f => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              filtro === f ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.label}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-secondary px-3 py-1 rounded-full">{group.label}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {group.events.map((ev, i) => (
                <div key={i} className="relative pb-5 last:pb-0 group">
                  <div
                    className="absolute left-[-19px] top-1.5 w-[10px] h-[10px] rounded-full border-2 border-card"
                    style={{ background: dotColors[ev.tipo] || "#5D6B82" }}
                  />
                  <div className="bg-card border border-border rounded-lg p-3 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground">{ev.texto}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{ev.detalhe}</div>
                      </div>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                        {ev.data.slice(0, 5)} · {ev.hora}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
