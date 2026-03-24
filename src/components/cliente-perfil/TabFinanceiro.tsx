import { perfilFinanceiro, evolucaoGasto, comparativoBase } from "@/data/clientePerfilData";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}
const dots = (score: number) => Array.from({ length: 5 }, (_, i) => i < score ? "●" : "○").join("");

export default function TabFinanceiro() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left */}
      <div className="space-y-5">
        {/* Perfil Financeiro */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Perfil Financeiro</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Limite de crédito informal</span>
              <span className="font-mono text-sm font-semibold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(perfilFinanceiro.limiteCredito)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Forma de pagamento preferida</span>
              <span className="badge-info">{perfilFinanceiro.formaPagamento}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Histórico de pagamento</span>
              <span className="badge-success">{perfilFinanceiro.historicoCredito}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Média dias para pagar</span>
              <span className="font-mono text-sm font-semibold text-foreground">{perfilFinanceiro.mediaDiasPagar} dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Desconto máximo já dado</span>
              <span className="font-mono text-sm font-semibold text-foreground">{perfilFinanceiro.descontoMaximo}%</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-xs text-muted-foreground">Última negociação</span>
              <span className="text-xs text-foreground text-right max-w-[200px]">{perfilFinanceiro.ultimaNegociacao}</span>
            </div>
          </div>
        </div>

        {/* Análise de Crédito */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Análise de Crédito Informal</h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-2xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{perfilFinanceiro.scorePagamento}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <span className="badge-success">Excelente pagador</span>
          </div>
          <div className="h-2 bg-secondary rounded-full mb-4">
            <div className="h-full rounded-full bg-green-500" style={{ width: `${perfilFinanceiro.scorePagamento}%` }} />
          </div>
          <div className="space-y-2">
            {perfilFinanceiro.criterios.map(c => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{c.label}</span>
                <span className="font-mono text-xs tracking-widest" style={{ color: c.score >= 4 ? "hsl(var(--success))" : c.score >= 3 ? "hsl(var(--warning))" : "hsl(var(--destructive))" }}>
                  {dots(c.score)} <span className="text-muted-foreground">{c.score}/5</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg p-3" style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <p className="text-xs text-muted-foreground">💡 Pode oferecer prazo de 30 dias sem necessidade de aprovação especial.</p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="space-y-5">
        {/* Evolução do Gasto */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Evolução do Gasto</h3>
          <p className="text-xs text-muted-foreground mb-4">Jan–Out 2024</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={evolucaoGasto}>
              <defs>
                <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => fmt(v)}
              />
              <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorGasto)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Média mensal: R$ 4.720/mês nos meses ativos</p>
        </div>

        {/* Comparativo */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Comparativo com a Base</h3>
          <div className="space-y-4">
            {comparativoBase.map(c => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{c.label}</span>
                  <span className="badge-success text-[10px]">{c.ratio}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground w-16" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {c.clienteValor ? fmt(c.clienteValor) : c.clienteLabel}
                  </span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${c.percentual}%` }} />
                  </div>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Média da base: {c.mediaValor ? fmt(c.mediaValor) : c.mediaLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
