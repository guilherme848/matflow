import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Users, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { vendedoresPerformance, produtosMaisOrcados, leadsPerDay, aguardandoResposta } from "@/data/mockData";
import { toast } from "sonner";

const periodos = ["Hoje", "7 dias", "30 dias", "Este mês"];
const diasLabels = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14"];
const chartData = leadsPerDay.map((v, i) => ({ dia: diasLabels[i], leads: v, isToday: i === leadsPerDay.length - 1 }));

const funnelData = [
  { etapa: "Novo Lead", valor: 148, pct: 100 },
  { etapa: "Em Atendimento", valor: 89, pct: 60 },
  { etapa: "Proposta Enviada", valor: 47, pct: 32 },
  { etapa: "Fechado Ganho", valor: 31, pct: 21 },
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("Hoje");

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
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${periodo === p ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              style={periodo === p ? { background: "#F97316" } : {}}
            >
              {p}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Leads Hoje", value: "34", sub: "↑12% vs ontem", subColor: "#0F766E", icon: Users },
            { label: "Em Atendimento", value: "8", sub: "conversas abertas agora", subColor: undefined, icon: null, pulse: true },
            { label: "Conversão do Mês", value: "31%", sub: "↑4% vs mês anterior", subColor: "#0F766E", icon: TrendingUp },
            { label: "Pipeline Aberto", value: "R$ 284.500", sub: "↓3% — 23 orçamentos", subColor: "#EAB308", icon: null },
          ].map((kpi, i) => (
            <div key={i} className="card-matflow animate-card-enter" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="label-text">{kpi.label}</span>
                {kpi.icon && <kpi.icon size={18} className="text-primary" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono-kpi text-[32px] font-extrabold text-foreground leading-none">{kpi.value}</span>
                {kpi.pulse && <span className="w-2.5 h-2.5 rounded-full animate-pulse-dot" style={{ background: "#F97316" }} />}
              </div>
              {kpi.sub && (
                <span className="text-xs mt-1 block" style={{ color: kpi.subColor || "hsl(var(--muted))" }}>{kpi.sub}</span>
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
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid hsl(216,24%,90%)", borderRadius: 8, fontSize: 13 }}
                  cursor={{ fill: "rgba(249,115,22,0.05)" }}
                />
                <Bar dataKey="leads" radius={[4, 4, 0, 0]} fill="#F97316" fillOpacity={0.65}
                  // highlight today
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    return <rect x={x} y={y} width={width} height={height} rx={4} fill="#F97316" fillOpacity={payload.isToday ? 1 : 0.65} />;
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
                    <span className="font-mono-kpi font-bold text-foreground">{f.valor}</span>
                  </div>
                  <div className="h-8 bg-secondary rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md transition-all duration-500"
                      style={{
                        width: `${f.pct}%`,
                        background: `linear-gradient(90deg, #0A0F1E, #F97316)`,
                        opacity: 0.15 + (i / funnelData.length) * 0.85,
                      }}
                    />
                  </div>
                  {i > 0 && (
                    <span className="text-[10px] text-muted-foreground">{Math.round((f.valor / funnelData[i - 1].valor) * 100)}% da etapa anterior</span>
                  )}
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
                  <tr key={i} className={`table-row-hover border-t border-border ${v.melhor ? "border-l-2" : ""}`} style={v.melhor ? { borderLeftColor: "#F97316" } : {}}>
                    <td className="py-2.5 font-medium text-foreground">{v.nome}</td>
                    <td className="py-2.5 font-mono-kpi">{v.leads}</td>
                    <td className="py-2.5 font-mono-kpi">{v.fechados}</td>
                    <td className="py-2.5">{v.tmResposta}</td>
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
                    <td className="py-2">{p.valorMedio}</td>
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
                    {a.urgente && <span className="badge-strong ml-2 text-[9px]">Urgente</span>}
                  </td>
                  <td className="py-2.5 text-muted-foreground">{a.vendedor}</td>
                  <td className="py-2.5">
                    <button className="btn-primary text-xs h-7 px-3" onClick={() => toast.success(`Conversa com ${a.nome} assumida!`)}>Assumir</button>
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
