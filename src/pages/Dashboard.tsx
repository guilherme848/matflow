import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Users, TrendingUp, TrendingDown, AlertCircle, Zap, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { vendedoresPerformance, produtosMaisOrcados, leadsPerDay, aguardandoResposta } from "@/data/mockData";
import { toast } from "sonner";

const periodos = ["Hoje", "7 dias", "30 dias", "Este mês"];

// Generate date labels like "18/03"
const today = new Date();
const diasLabels = leadsPerDay.map((_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (leadsPerDay.length - 1 - i));
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
});
const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const chartData = leadsPerDay.map((v, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (leadsPerDay.length - 1 - i));
  return {
    dia: diasLabels[i],
    diaFull: `${dayNames[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")} ${["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"][d.getMonth()]}`,
    leads: v,
    isToday: i === leadsPerDay.length - 1,
  };
});

const funnelData = [
  { etapa: "Novo Lead", valor: 148, pct: 100 },
  { etapa: "Em Atendimento", valor: 89, pct: 60 },
  { etapa: "Proposta Enviada", valor: 47, pct: 32 },
  { etapa: "Fechado Ganho", valor: 31, pct: 21 },
];

// Interpolate funnel bar colors from #0A0F1E to #F97316
function interpolateColor(i: number, total: number) {
  const r1 = 10, g1 = 15, b1 = 30;
  const r2 = 249, g2 = 115, b2 = 22;
  const t = total <= 1 ? 1 : i / (total - 1);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

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

function parseResponseTime(tm: string): number {
  return parseInt(tm.replace("min", ""));
}

function responseTimeColor(tm: string) {
  const mins = parseResponseTime(tm);
  if (mins < 5) return "#0F766E";
  if (mins <= 15) return "#EAB308";
  return "#EF4444";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <div className="text-xs text-muted-foreground mb-0.5">{item.diaFull}</div>
      <div className="font-mono-kpi text-sm font-bold text-foreground">{item.leads} leads</div>
    </div>
  );
};

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("Hoje");

  const kpis = [
    { label: "Leads Hoje", value: "34", sub: "↑12% vs ontem", subColor: "#0F766E", Icon: Users, TrendIcon: TrendingUp, iconBg: "rgba(249,115,22,0.10)" },
    { label: "Em Atendimento", value: "8", sub: "conversas abertas agora", subColor: undefined, Icon: Zap, TrendIcon: null, iconBg: "rgba(249,115,22,0.10)", pulse: true },
    { label: "Conversão do Mês", value: "31%", sub: "↑4% vs mês anterior", subColor: "#0F766E", Icon: TrendingUp, TrendIcon: TrendingUp, iconBg: "rgba(15,118,110,0.10)" },
    { label: "Pipeline Aberto", value: "R$ 284.500", sub: "↓3% — 23 orçamentos", subColor: "#EAB308", Icon: BarChart2, TrendIcon: TrendingDown, iconBg: "rgba(234,179,8,0.10)" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <AppHeader title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Period filter */}
        <div className="flex gap-1 bg-card rounded-lg p-1 w-fit border border-border">
          {periodos.map(p => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150 cursor-pointer ${periodo === p ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              style={periodo === p ? { background: "#F97316" } : {}}
            >
              {p}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="card-matflow animate-card-enter relative overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
              {/* Decorative icon circle */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: kpi.iconBg }}>
                <kpi.Icon size={18} className="text-primary" />
              </div>
              <div className="mb-2">
                <span className="label-text">{kpi.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono-kpi text-[32px] font-extrabold text-foreground leading-none">{kpi.value}</span>
                {kpi.pulse && <span className="w-2.5 h-2.5 rounded-full animate-pulse-dot" style={{ background: "#F97316" }} />}
              </div>
              {kpi.sub && (
                <span className="text-xs mt-1 flex items-center gap-1" style={{ color: kpi.subColor || "hsl(215,17%,44%)" }}>
                  {kpi.TrendIcon && <kpi.TrendIcon size={14} />}
                  {kpi.sub}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 card-matflow animate-card-enter" style={{ animationDelay: "200ms" }}>
            <div className="section-title mb-4">Leads por dia — 14 dias</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216,24%,90%)" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "hsl(215,17%,44%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215,17%,44%)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(249,115,22,0.05)" }} />
                <Bar
                  dataKey="leads"
                  radius={[4, 4, 0, 0]}
                  fill="#F97316"
                  fillOpacity={0.65}
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    return (
                      <g>
                        <rect x={x} y={y} width={width} height={height} rx={4} fill="#F97316" fillOpacity={payload.isToday ? 1 : 0.65} />
                        {payload.isToday && (
                          <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="JetBrains Mono" fill="#F97316">
                            {payload.leads}
                          </text>
                        )}
                      </g>
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 card-matflow animate-card-enter" style={{ animationDelay: "260ms" }}>
            <div className="section-title mb-4">Conversão por Etapa</div>
            <div className="space-y-3">
              {funnelData.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{f.etapa}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-kpi font-bold text-foreground">{f.valor}</span>
                      {i > 0 && (
                        <span className="badge-neutral text-[9px] py-0 px-1.5">
                          {Math.round((f.valor / funnelData[i - 1].valor) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-8 bg-secondary rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md transition-all duration-500"
                      style={{
                        width: `${f.pct}%`,
                        background: interpolateColor(i, funnelData.length),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card-matflow animate-card-enter" style={{ animationDelay: "320ms" }}>
            <div className="section-title mb-4">Performance por Vendedor</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="label-text pb-3">Vendedor</th>
                  <th className="label-text pb-3">Leads</th>
                  <th className="label-text pb-3">Fechados</th>
                  <th className="label-text pb-3">TM Resp.</th>
                  <th className="label-text pb-3">Ticket Médio</th>
                </tr>
              </thead>
              <tbody>
                {vendedoresPerformance.map((v, i) => (
                  <tr
                    key={i}
                    className={`table-row-hover border-t border-border ${v.melhor ? "border-l-[3px]" : ""}`}
                    style={v.melhor ? { borderLeftColor: "#F97316", background: "rgba(249,115,22,0.04)" } : {}}
                  >
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-foreground" style={{ background: getAvatarColor(v.nome) }}>
                          {getInitials(v.nome)}
                        </div>
                        <span className="font-medium text-foreground">{v.nome}</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-mono-kpi">{v.leads}</td>
                    <td className="py-2.5 font-mono-kpi">{v.fechados}</td>
                    <td className="py-2.5 font-semibold" style={{ color: responseTimeColor(v.tmResposta) }}>{v.tmResposta}</td>
                    <td className="py-2.5 font-mono-kpi font-bold">{formatCurrency(v.ticketMedio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-matflow animate-card-enter" style={{ animationDelay: "380ms" }}>
            <div className="section-title mb-4">Produtos Mais Orçados</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="label-text pb-3">Produto</th>
                  <th className="label-text pb-3">Orçamentos</th>
                  <th className="label-text pb-3">Valor Médio</th>
                </tr>
              </thead>
              <tbody>
                {produtosMaisOrcados.map((p, i) => (
                  <tr key={i} className="table-row-hover border-t border-border">
                    <td className="py-2 font-medium text-foreground">{p.produto}</td>
                    <td className="py-2 font-mono-kpi">{p.orcamentos}</td>
                    <td className="py-2 font-mono-kpi">{p.valorMedio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Awaiting response */}
        <div className="card-matflow animate-card-enter" style={{ animationDelay: "440ms" }}>
          <div className="section-title mb-4">Aguardando Resposta</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="label-text pb-3">Nome</th>
                <th className="label-text pb-3">Canal</th>
                <th className="label-text pb-3">Tempo esperando</th>
                <th className="label-text pb-3">Vendedor</th>
                <th className="label-text pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {aguardandoResposta.map((a, i) => (
                <tr key={i} className="table-row-hover border-t border-border">
                  <td className="py-2.5 font-medium text-foreground">{a.nome}</td>
                  <td className="py-2.5"><span className="badge-success">{a.canal}</span></td>
                  <td className="py-2.5">
                    <span className={a.urgente ? "text-destructive font-semibold" : "text-foreground"}>
                      {a.tempo}
                    </span>
                    {a.urgente && <span className="badge-destructive-soft ml-2 text-[9px] animate-pulse-badge">Urgente</span>}
                  </td>
                  <td className="py-2.5">
                    {a.vendedor === "Sem vendedor" ? (
                      <span className="badge-destructive-soft text-[9px]">Sem responsável</span>
                    ) : (
                      <span className="text-muted-foreground">{a.vendedor}</span>
                    )}
                  </td>
                  <td className="py-2.5">
                    <button className="btn-outline-primary" onClick={() => toast.success(`Conversa com ${a.nome} assumida!`)}>Assumir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
