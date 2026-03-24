import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Users, TrendingUp, TrendingDown, MessageSquare, DollarSign, Check, CheckSquare } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { vendedoresPerformance, produtosMaisOrcados, leadsPerDay, aguardandoResposta, ltvPorCanal, ltvCanalTabela } from "@/data/mockData";
import { toast } from "sonner";
import { FeatureLock } from "@/components/FeatureLock";
import MetasCard from "@/components/dashboard/MetasCard";
import ExportModal from "@/components/dashboard/ExportModal";
import { useApp, atividadeTipoConfig, type AtividadeTipo } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { RefreshCw, MessageCircle, Phone, FileText, MapPin } from "lucide-react";
import MetasCard from "@/components/dashboard/MetasCard";
import ExportModal from "@/components/dashboard/ExportModal";

const periodos = ["Hoje", "7 dias", "30 dias", "Este mês"];

const today = new Date();
const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const chartData = leadsPerDay.map((v, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (leadsPerDay.length - 1 - i));
  return {
    dia: i % 2 === 0 ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}` : "",
    diaFull: `${dayNames[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")} ${["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"][d.getMonth()]}`,
    leads: v,
    isToday: i === leadsPerDay.length - 1,
  };
});

const funnelData = [
  { etapa: "Novo Lead", valor: 148, pct: 100, color: "#6366F1" },
  { etapa: "Em Atendimento", valor: 89, pct: 60, color: "#F97316" },
  { etapa: "Proposta Enviada", valor: 47, pct: 32, color: "#EAB308" },
  { etapa: "Fechado Ganho", valor: 31, pct: 21, color: "#0F766E" },
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

function getAvatarColor(name: string) {
  const colors = ["#6366F1", "#0F766E", "#F97316", "#EAB308", "#EF4444"];
  return colors[name.charCodeAt(0) % 5];
}
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }

function responseTimeColor(tm: string) {
  const mins = parseInt(tm.replace("min", ""));
  if (mins < 5) return "#0F766E";
  if (mins <= 15) return "#EAB308";
  return "#EF4444";
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden" style={{ padding: "8px 12px", boxShadow: "0 4px 12px var(--shadow-color)" }}>
      <div className="text-[11px] text-muted-foreground mb-0.5">{item.diaFull}</div>
      <div className="flex items-baseline gap-1">
        <span className="font-mono-kpi text-base font-bold" style={{ color: "#F97316" }}>{item.leads}</span>
        <span className="text-xs text-muted-foreground">leads</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("Hoje");

  const kpis = [
    { label: "Leads Hoje", value: "34", sub: "12% vs ontem", subPositive: true, Icon: Users, iconBg: "rgba(99,102,241,0.10)", iconColor: "#6366F1" },
    { label: "Em Atendimento", value: "8", sub: "conversas abertas agora", subPositive: undefined, Icon: MessageSquare, iconBg: "rgba(249,115,22,0.10)", iconColor: "#F97316", pulse: true },
    { label: "Conversão do Mês", value: "31%", sub: "4% vs mês anterior", subPositive: true, Icon: TrendingUp, iconBg: "rgba(15,118,110,0.10)", iconColor: "#0F766E" },
    { label: "Pipeline Aberto", value: "R$ 284.500", sub: "3% — 23 orçamentos", subPositive: false, Icon: DollarSign, iconBg: "rgba(234,179,8,0.10)", iconColor: "#EAB308" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Dashboard" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" style={{ padding: "24px 32px" }}>
        <div className="space-y-6">
          {/* Period filter + Export */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-1 bg-card rounded-lg p-1 w-fit border border-border shrink-0">
              {periodos.map(p => (
                <button key={p} onClick={() => setPeriodo(p)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer whitespace-nowrap ${periodo === p ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  style={{ background: periodo === p ? "#F97316" : "transparent", transition: "background-color 120ms ease, color 120ms ease" }}
                >{p}</button>
              ))}
            </div>
            <ExportModal />
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <div key={i} className="card-matflow animate-card-enter relative overflow-hidden min-w-0 group" style={{ animationDelay: `${i * 60}ms`, transition: "border-color 150ms ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.40)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))"; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="label-text">{kpi.label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: kpi.iconBg }}>
                    <kpi.Icon size={15} style={{ color: kpi.iconColor }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-kpi text-[28px] font-bold text-foreground leading-none whitespace-nowrap" style={{ letterSpacing: "-0.5px" }}>{kpi.value}</span>
                  {kpi.pulse && <span className="w-2 h-2 rounded-full animate-pulse-dot shrink-0" style={{ background: "#F97316" }} />}
                </div>
                {kpi.sub && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {kpi.subPositive !== undefined && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-px rounded-full" style={{
                        background: kpi.subPositive ? "rgba(15,118,110,0.10)" : "rgba(239,68,68,0.10)",
                        color: kpi.subPositive ? "#0F766E" : "#DC2626",
                      }}>
                        {kpi.subPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {kpi.subPositive ? "↑" : "↓"}{kpi.sub.split(" ")[0]}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground truncate">{kpi.subPositive !== undefined ? kpi.sub.split(" ").slice(1).join(" ") : kpi.sub}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Metas */}
          <MetasCard />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Bar chart */}
            <div className="lg:col-span-3 card-matflow animate-card-enter min-w-0 overflow-hidden" style={{ animationDelay: "200ms" }}>
              <div className="mb-5">
                <div className="section-title">Leads por dia</div>
                <div className="text-xs text-muted-foreground mt-0.5">Últimos 14 dias</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#F97316", strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Bar dataKey="leads" radius={[4, 4, 0, 0]} barSize={18}
                    shape={(props: any) => {
                      const { x, y, width, height, payload } = props;
                      return (
                        <g>
                          <rect x={x} y={y} width={width} height={height} rx={4} fill="#F97316" fillOpacity={payload.isToday ? 1 : 0.35} />
                          {payload.isToday && (
                            <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="JetBrains Mono" fill="#F97316">
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

            {/* Funnel */}
            <div className="lg:col-span-2 card-matflow animate-card-enter min-w-0 overflow-hidden" style={{ animationDelay: "260ms" }}>
              <div className="section-title mb-5">Conversão por Etapa</div>
              <div className="space-y-4">
                {funnelData.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[13px] font-medium text-foreground truncate" style={{ width: "30%" }}>{f.etapa}</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.color, transition: "width 500ms ease" }} />
                    </div>
                    <span className="font-mono-kpi text-sm font-semibold text-foreground whitespace-nowrap" style={{ width: 32 }}>{f.valor}</span>
                    {i > 0 && <span className="text-xs text-muted-foreground whitespace-nowrap">({Math.round((f.valor / funnelData[i - 1].valor) * 100)}%)</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card-matflow animate-card-enter min-w-0 overflow-hidden" style={{ animationDelay: "320ms" }}>
              <div className="section-title mb-4">Performance por Vendedor</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 420 }}>
                  <thead>
                    <tr>
                      <th className="label-text pb-3 text-left bg-secondary rounded-tl-lg px-4" style={{ width: "35%", height: 36 }}>Vendedor</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "15%" }}>Leads</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "15%" }}>Fechados</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "15%" }}>TM Resp.</th>
                      <th className="label-text pb-3 text-left bg-secondary rounded-tr-lg px-3" style={{ width: "20%" }}>Ticket Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendedoresPerformance.map((v, i) => (
                      <tr key={i} className="table-row-hover border-t border-border group" style={v.melhor ? { background: "rgba(249,115,22,0.03)" } : {}}>
                        <td className="py-3 px-4 overflow-hidden" style={{ height: 48 }}>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: getAvatarColor(v.nome) }}>{getInitials(v.nome)}</div>
                            <span className="text-sm font-medium text-foreground truncate">{v.nome}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono-kpi text-sm whitespace-nowrap">{v.leads}</td>
                        <td className="py-3 px-3 font-mono-kpi text-sm whitespace-nowrap">{v.fechados}</td>
                        <td className="py-3 px-3 font-semibold text-sm whitespace-nowrap" style={{ color: responseTimeColor(v.tmResposta) }}>{v.tmResposta}</td>
                        <td className="py-3 px-3 font-mono-kpi font-bold text-sm whitespace-nowrap">{formatCurrency(v.ticketMedio)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-matflow animate-card-enter min-w-0 overflow-hidden" style={{ animationDelay: "380ms" }}>
              <div className="section-title mb-4">Produtos Mais Orçados</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 320 }}>
                  <thead>
                    <tr>
                      <th className="label-text pb-3 text-left bg-secondary rounded-tl-lg px-4" style={{ width: "50%", height: 36 }}>Produto</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "25%" }}>Orçamentos</th>
                      <th className="label-text pb-3 text-left bg-secondary rounded-tr-lg px-3" style={{ width: "25%" }}>Valor Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosMaisOrcados.map((p, i) => (
                      <tr key={i} className="table-row-hover border-t border-border">
                        <td className="py-3 px-4 font-medium text-foreground truncate overflow-hidden" style={{ height: 48 }}>{p.produto}</td>
                        <td className="py-3 px-3 font-mono-kpi text-sm whitespace-nowrap">{p.orcamentos}</td>
                        <td className="py-3 px-3 font-mono-kpi text-sm whitespace-nowrap">{p.valorMedio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Awaiting response */}
          <div className="card-matflow animate-card-enter min-w-0 overflow-hidden" style={{ animationDelay: "440ms" }}>
            <div className="section-title mb-4">Aguardando Resposta</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 600 }}>
                <thead>
                  <tr>
                    <th className="label-text pb-3 text-left bg-secondary rounded-tl-lg px-4" style={{ width: "25%", height: 36 }}>Nome</th>
                    <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "15%" }}>Canal</th>
                    <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "25%" }}>Tempo esperando</th>
                    <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "20%" }}>Vendedor</th>
                    <th className="label-text pb-3 text-left bg-secondary rounded-tr-lg px-3" style={{ width: "15%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {aguardandoResposta.map((a, i) => (
                    <tr key={i} className="table-row-hover border-t border-border">
                      <td className="py-3 px-4 font-medium text-foreground truncate overflow-hidden" style={{ height: 48 }}>{a.nome}</td>
                      <td className="py-3 px-3"><span className="badge-success whitespace-nowrap">{a.canal}</span></td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={a.urgente ? "text-destructive font-semibold" : "text-foreground"}>{a.tempo}</span>
                        {a.urgente && <span className="badge-destructive-soft ml-2 text-[9px] animate-pulse-badge">Urgente</span>}
                      </td>
                      <td className="py-3 px-3 overflow-hidden">
                        {a.vendedor === "Sem vendedor" ? (
                          <span className="badge-destructive-soft text-[9px] whitespace-nowrap">Sem responsável</span>
                        ) : (
                          <span className="text-muted-foreground truncate block">{a.vendedor}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <button className="btn-outline-primary whitespace-nowrap" onClick={() => toast.success(`Conversa com ${a.nome} assumida!`)}>Assumir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LTV */}
          <FeatureLock feature="LTV por Canal de Origem" description="Analise qual canal traz os clientes com maior valor ao longo do tempo">
            <div className="card-matflow animate-card-enter min-w-0 overflow-hidden" style={{ animationDelay: "500ms" }}>
              <div className="section-title mb-5">LTV por Canal de Origem</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {ltvPorCanal.map((c, i) => {
                  const maxLtv = Math.max(...ltvPorCanal.map(x => x.ltv));
                  return (
                    <div key={i} className="card-matflow p-4" style={c.melhor ? { border: "1px solid #F97316" } : {}}>
                      {c.melhor && <span className="badge-success text-[9px] mb-2 inline-block">Melhor ROI</span>}
                      <div className="label-text mb-1">{c.canal}</div>
                      <div className="font-mono-kpi text-xl font-bold text-foreground">{formatCurrency(c.ltv)}</div>
                      <div className="h-1.5 bg-secondary rounded-full mt-2 mb-2 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(c.ltv / maxLtv) * 100}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground">{c.clientes} clientes · {c.conversao}%</div>
                    </div>
                  );
                })}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th className="label-text pb-3 text-left bg-secondary rounded-tl-lg px-4" style={{ width: "18%", height: 36 }}>Canal</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "12%" }}>Clientes</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "14%" }}>LTV Médio</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "14%" }}>Ticket Médio</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "16%" }}>Frequência</th>
                      <th className="label-text pb-3 text-left bg-secondary px-3" style={{ width: "12%" }}>Conversão</th>
                      <th className="label-text pb-3 text-left bg-secondary rounded-tr-lg px-3" style={{ width: "14%" }}>Custo/Lead</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ltvCanalTabela.map((c, i) => (
                      <tr key={i} className="table-row-hover border-t border-border">
                        <td className="py-3 px-4 font-medium text-foreground truncate" style={{ height: 48 }}>{c.canal}</td>
                        <td className="py-3 px-3 font-mono-kpi text-sm whitespace-nowrap">{c.clientes}</td>
                        <td className="py-3 px-3 font-mono-kpi font-bold text-sm whitespace-nowrap" style={{ color: "#F97316" }}>{formatCurrency(c.ltv)}</td>
                        <td className="py-3 px-3 font-mono-kpi text-sm whitespace-nowrap">{formatCurrency(c.ticketMedio)}</td>
                        <td className="py-3 px-3 text-muted-foreground text-sm truncate">{c.frequencia}</td>
                        <td className="py-3 px-3 font-mono-kpi text-sm whitespace-nowrap">{c.conversao}</td>
                        <td className="py-3 px-3 font-mono-kpi text-sm whitespace-nowrap">{c.custoLead}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FeatureLock>
        </div>
      </div>
    </div>
  );
}
