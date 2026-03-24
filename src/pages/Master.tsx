import { useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, DollarSign, Activity, Headphones, Zap, ChevronDown, ChevronUp, Eye, MessageSquare } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { masterMRRData, masterPlanoDistribuicao, tenants, cobrancasMes, type Tenant } from "@/data/mockData";
import { toast } from "sonner";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

const sections = [
  { label: "Visão Geral", icon: LayoutDashboard, path: "/master" },
  { label: "Tenants / Lojas", icon: Building2, path: "/master/tenants" },
  { label: "Financeiro / MRR", icon: DollarSign, path: "/master/financeiro" },
  { label: "Uso da Plataforma", icon: Activity, path: "/master/uso" },
  { label: "Suporte", icon: Headphones, path: "/master/suporte" },
];

const MasterTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 border text-sm" style={{ background: "#161B27", borderColor: "#252D3D", color: "#E8EAF0" }}>
      <div className="font-mono-kpi font-bold" style={{ color: "#F97316" }}>{formatCurrency(payload[0].value)}</div>
    </div>
  );
};

function VisaoGeral() {
  const kpis = [
    { label: "MRR Atual", value: "R$ 28.400", sub: "↑ 18% vs mês anterior", subColor: "#10B981", extra: "35 lojas ativas" },
    { label: "Novos Tenants (mês)", value: "8", sub: "↑ 3 vs mês anterior", subColor: "#10B981", extra: "3 em trial, 5 pagantes" },
    { label: "Churn do Mês", value: "1", sub: "Churn rate: 2,8%", subColor: "#F59E0B", extra: "Saudável" },
    { label: "Leads Gerados (plataforma)", value: "12.847", sub: "↑ 34% vs mês anterior", subColor: "#10B981", extra: "Todas as lojas combinadas" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border p-5 animate-card-enter" style={{ background: "#161B27", borderColor: "#252D3D", animationDelay: `${i * 60}ms` }}>
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#8892A4" }}>{k.label}</span>
            <div className="font-mono-kpi text-2xl font-extrabold mt-1" style={{ color: k.label === "MRR Atual" ? "#F97316" : "#E8EAF0", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
            <span className="text-xs mt-1 block" style={{ color: k.subColor }}>{k.sub}</span>
            <span className="text-[11px] mt-0.5 block" style={{ color: "#8892A4" }}>{k.extra}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl border p-5" style={{ background: "#161B27", borderColor: "#252D3D" }}>
          <div className="text-base font-semibold mb-4" style={{ color: "#E8EAF0" }}>Evolução do MRR — 12 meses</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={masterMRRData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#8892A4" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8892A4" }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<MasterTooltip />} />
              <Area type="monotone" dataKey="mrr" stroke="#F97316" strokeWidth={2} fill="rgba(249,115,22,0.12)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-2xl border p-5" style={{ background: "#161B27", borderColor: "#252D3D" }}>
          <div className="text-base font-semibold mb-4" style={{ color: "#E8EAF0" }}>Distribuição por Plano</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={masterPlanoDistribuicao} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                {masterPlanoDistribuicao.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend formatter={(value) => <span style={{ color: "#8892A4", fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-2">
            <span className="font-mono-kpi text-lg font-bold" style={{ color: "#E8EAF0" }}>35 lojas</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-5" style={{ background: "#161B27", borderColor: "#252D3D" }}>
        <div className="text-base font-semibold mb-4" style={{ color: "#E8EAF0" }}>Tenants Ativos</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="text-left" style={{ color: "#8892A4" }}>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider">Loja</th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider">Plano</th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider">MRR</th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider">Leads/mês</th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider">Conversão</th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider">Status</th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider">Desde</th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className={`border-t ${t.conversao >= 34 ? "border-l-[3px]" : ""}`} style={{ borderColor: "#252D3D", ...(t.conversao >= 34 ? { borderLeftColor: "#F97316" } : {}) }}>
                  <td className="py-2.5 font-medium" style={{ color: "#E8EAF0" }}>{t.loja}</td>
                  <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: t.plano === "Pro" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.08)", color: t.plano === "Pro" ? "#F97316" : "#8892A4" }}>{t.plano}</span></td>
                  <td className="py-2.5 font-mono-kpi" style={{ color: "#E8EAF0", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(t.mrr)}</td>
                  <td className="py-2.5 font-mono-kpi" style={{ fontVariantNumeric: "tabular-nums", color: "#E8EAF0" }}>{t.leadsMes.toLocaleString()}</td>
                  <td className="py-2.5 font-mono-kpi font-semibold" style={{ color: t.conversao >= 30 ? "#10B981" : "#E8EAF0" }}>{t.conversao}%</td>
                  <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: t.status === "Trial" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: t.status === "Trial" ? "#F59E0B" : "#10B981" }}>{t.status}</span></td>
                  <td className="py-2.5 text-sm" style={{ color: "#8892A4" }}>{t.desde}</td>
                  <td className="py-2.5 flex gap-2">
                    <button className="text-xs px-2 py-1 rounded" style={{ color: "#F97316" }} onClick={() => toast.info(`Visualizando ${t.loja}`)}>Ver</button>
                    <button className="text-xs px-2 py-1 rounded" style={{ color: "#8892A4" }}>Suporte</button>
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

function TenantsSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const filtered = tenants.filter(t => t.loja.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <input className="rounded-lg px-3 py-2 text-sm flex-1" style={{ background: "#1C2333", border: "1px solid #252D3D", color: "#E8EAF0" }} placeholder="Buscar loja..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {filtered.map(t => (
        <div key={t.id} className="rounded-2xl border overflow-hidden" style={{ background: "#161B27", borderColor: "#252D3D" }}>
          <button className="w-full flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
            <div className="flex items-center gap-3">
              <span className="font-medium" style={{ color: "#E8EAF0" }}>{t.loja}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: t.plano === "Pro" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.08)", color: t.plano === "Pro" ? "#F97316" : "#8892A4" }}>{t.plano}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: t.status === "Trial" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: t.status === "Trial" ? "#F59E0B" : "#10B981" }}>{t.status}</span>
            </div>
            {expanded === t.id ? <ChevronUp size={16} style={{ color: "#8892A4" }} /> : <ChevronDown size={16} style={{ color: "#8892A4" }} />}
          </button>
          {expanded === t.id && (
            <div className="px-4 pb-4 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 border-t" style={{ borderColor: "#252D3D" }}>
              <div><span className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: "#8892A4" }}>Logins (30d)</span><span className="font-mono-kpi font-bold" style={{ color: "#E8EAF0" }}>{t.logins30d}</span></div>
              <div><span className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: "#8892A4" }}>Mensagens</span><span className="font-mono-kpi font-bold" style={{ color: "#E8EAF0" }}>{t.mensagens?.toLocaleString()}</span></div>
              <div><span className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: "#8892A4" }}>Usuários ativos</span><span className="font-mono-kpi font-bold" style={{ color: "#E8EAF0" }}>{t.usuarios}</span></div>
              <div><span className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: "#8892A4" }}>WhatsApp</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: t.whatsappConectado ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: t.whatsappConectado ? "#10B981" : "#F87171" }}>{t.whatsappConectado ? "Conectado" : "Desconectado"}</span></div>
              <div className="col-span-2 md:col-span-4"><span className="text-[11px] uppercase tracking-wider" style={{ color: "#8892A4" }}>Último acesso: </span><span className="text-sm" style={{ color: "#E8EAF0" }}>{t.ultimoAcesso}</span></div>
              <div className="col-span-2 md:col-span-4 flex gap-2 pt-2">
                <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "#F97316", color: "#fff" }} onClick={() => toast.success(`Impersonando ${t.loja}`)}>Acessar como Gestor</button>
                <button className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: "#252D3D", color: "#8892A4" }}>Enviar mensagem</button>
                <button className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "#F87171" }} onClick={() => toast.error(`Plano de ${t.loja} cancelado`)}>Cancelar plano</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FinanceiroSection() {
  const metricas = [
    { label: "MRR", value: "R$ 28.400" },
    { label: "ARR projetado", value: "R$ 340.800" },
    { label: "Setup fees (mês)", value: "R$ 15.000" },
    { label: "Receita total mês", value: "R$ 43.400" },
    { label: "LTV médio / loja", value: "R$ 18.240" },
    { label: "CAC estimado", value: "R$ 800" },
    { label: "Payback period", value: "1,6 meses" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {metricas.map((m, i) => (
          <div key={i} className="rounded-2xl border p-4" style={{ background: "#161B27", borderColor: "#252D3D" }}>
            <span className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: "#8892A4" }}>{m.label}</span>
            <span className="font-mono-kpi text-lg font-bold" style={{ color: m.label === "MRR" ? "#F97316" : "#E8EAF0", fontVariantNumeric: "tabular-nums" }}>{m.value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5" style={{ background: "#161B27", borderColor: "#252D3D" }}>
        <div className="text-base font-semibold mb-4" style={{ color: "#E8EAF0" }}>Cobranças do Mês</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 500 }}>
            <thead>
              <tr style={{ color: "#8892A4" }}>
                <th className="text-left pb-3 text-[11px] uppercase tracking-wider">Loja</th>
                <th className="text-left pb-3 text-[11px] uppercase tracking-wider">Plano</th>
                <th className="text-left pb-3 text-[11px] uppercase tracking-wider">Valor</th>
                <th className="text-left pb-3 text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left pb-3 text-[11px] uppercase tracking-wider">Vencimento</th>
              </tr>
            </thead>
            <tbody>
              {cobrancasMes.map((c, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "#252D3D" }}>
                  <td className="py-2.5" style={{ color: "#E8EAF0" }}>{c.loja}</td>
                  <td className="py-2.5" style={{ color: "#8892A4" }}>{c.plano}</td>
                  <td className="py-2.5 font-mono-kpi" style={{ color: "#E8EAF0", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(c.valor)}</td>
                  <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: c.status === "Pago" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: c.status === "Pago" ? "#10B981" : "#F59E0B" }}>{c.status}</span></td>
                  <td className="py-2.5" style={{ color: "#8892A4" }}>{c.vencimento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Master() {
  const { secao } = useParams();
  const activeSection = secao || "";

  const renderContent = () => {
    switch (activeSection) {
      case "tenants": return <TenantsSection />;
      case "financeiro": return <FinanceiroSection />;
      case "uso": return <div className="rounded-2xl border p-8 text-center" style={{ background: "#161B27", borderColor: "#252D3D" }}><Activity size={48} style={{ color: "#8892A4" }} className="mx-auto mb-3" /><div style={{ color: "#E8EAF0" }} className="font-semibold">Dados de uso em breve</div><div className="text-sm" style={{ color: "#8892A4" }}>Métricas de uso da plataforma em desenvolvimento</div></div>;
      case "suporte": return <div className="rounded-2xl border p-8 text-center" style={{ background: "#161B27", borderColor: "#252D3D" }}><Headphones size={48} style={{ color: "#8892A4" }} className="mx-auto mb-3" /><div style={{ color: "#E8EAF0" }} className="font-semibold">Central de Suporte</div><div className="text-sm" style={{ color: "#8892A4" }}>Tickets de suporte em desenvolvimento</div></div>;
      default: return <VisaoGeral />;
    }
  };

  return (
    <div className="flex w-full h-full overflow-hidden" style={{ background: "#0D1117" }}>
      {/* Master Sidebar - always dark */}
      <aside className="hidden md:flex flex-col w-[240px] min-w-[240px] max-w-[240px] h-full overflow-y-auto overflow-x-hidden shrink-0 border-r" style={{ background: "#0D1117", borderColor: "#1F2937" }}>
        <div className="h-[60px] min-h-[60px] flex items-center px-5 border-b gap-2" style={{ borderColor: "#1F2937" }}>
          <span className="text-xl font-bold" style={{ color: "#E8EAF0" }}>Mat</span>
          <span className="text-xl font-normal" style={{ color: "#F97316" }}>Flow</span>
          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ml-1" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}>Master</span>
        </div>
        <nav className="flex-1 py-3 flex flex-col gap-0.5">
          {sections.map(s => {
            const active = s.path === "/master" ? activeSection === "" : s.path === `/master/${activeSection}`;
            return (
              <NavLink key={s.path} to={s.path} className="flex items-center gap-3 px-5 py-2.5 text-sm relative cursor-pointer" style={active ? { background: "rgba(249,115,22,0.12)", color: "#F97316", fontWeight: 600 } : { color: "#8892A4" }}>
                {active && <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r" style={{ background: "#F97316" }} />}
                <s.icon size={20} className="shrink-0" />
                <span className="truncate">{s.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t px-4 py-3 flex items-center gap-3" style={{ borderColor: "#1F2937" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>GF</div>
          <div>
            <div className="text-sm font-medium" style={{ color: "#E8EAF0" }}>Guilherme & Fernando</div>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded" style={{ background: "#F97316", color: "#fff" }}>Admin</span>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        <header className="h-[60px] min-h-[60px] flex items-center px-8 border-b shrink-0" style={{ background: "#161B27", borderColor: "#252D3D" }}>
          <h1 className="text-lg font-bold" style={{ color: "#E8EAF0" }}>
            {activeSection === "tenants" ? "Tenants / Lojas" : activeSection === "financeiro" ? "Financeiro / MRR" : activeSection === "uso" ? "Uso da Plataforma" : activeSection === "suporte" ? "Suporte" : "Visão Geral"}
          </h1>
        </header>
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}