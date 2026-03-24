import { useParams, useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import { ArrowLeft, MessageSquare, Edit2, Plus } from "lucide-react";
import { clientes, historicoConversasJoao, historicoComprasJoao, anotacoesJoao, dealsAtivosJoao, comprasPorMesJoao } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

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

const statusBadge: Record<string, string> = {
  "Fechada": "badge-success",
  "Transferida": "badge-attention",
  "Bot": "badge-info",
  "Proposta Aberta": "badge-attention",
  "Em Atendimento": "badge-strong",
};

const dots = (score: number) => Array.from({ length: 5 }, (_, i) => i < score ? "●" : "○").join("");

export default function ClientePerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cliente = clientes.find(c => c.id === Number(id)) || clientes[0];
  const [novaNota, setNovaNota] = useState("");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Perfil do Cliente" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
        {/* Back + Header */}
        <button onClick={() => navigate("/clientes")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 cursor-pointer">
          <ArrowLeft size={16} /> Voltar para Clientes
        </button>
        <div className="flex items-start gap-4 mb-6 flex-wrap">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ background: getAvatarColor(cliente.nome) }}>
            {getInitials(cliente.nome)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-foreground truncate">{cliente.nome}</h2>
            {cliente.empresa && <div className="text-base text-muted-foreground">{cliente.empresa}</div>}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {cliente.tags.map(t => <span key={t} className="badge-neutral">{t}</span>)}
              <button className="badge-neutral cursor-pointer hover:bg-secondary"><Plus size={10} /></button>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="btn-primary text-sm"><MessageSquare size={14} /> Iniciar conversa</button>
            <button className="h-[42px] px-4 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-secondary transition-colors cursor-pointer"><Edit2 size={14} className="inline mr-1" />Editar cliente</button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left 60% */}
          <div className="lg:col-span-3 space-y-6">
            {/* Info */}
            <div className="card-matflow">
              <h3 className="section-title mb-4">Informações do Cliente</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Telefone", cliente.telefone],
                  ["E-mail", cliente.email || "—"],
                  ["Empresa", cliente.empresa || "—"],
                  ["CNPJ", cliente.cnpj || "—"],
                  ["Endereço de obra", cliente.endereco || "—"],
                  ["Vendedor responsável", cliente.vendedor],
                  ["Cliente desde", cliente.clienteDesde || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2 overflow-hidden">
                    <span className="text-muted-foreground shrink-0">{label}</span>
                    <span className="font-medium text-foreground truncate text-right">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Canal de origem</span>
                  <span className="badge-info">{cliente.canal}</span>
                </div>
              </div>
            </div>

            {/* Conversas */}
            <div className="card-matflow">
              <h3 className="section-title mb-4">Histórico de Conversas</h3>
              <div className="space-y-0">
                {historicoConversasJoao.map((c, i) => (
                  <div key={c.id} className={`py-3 flex items-start justify-between gap-3 ${i > 0 ? "border-t border-border" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{c.data}</span>
                        <span className="text-xs text-muted-foreground">{c.duracao}</span>
                        <span className={statusBadge[c.status] || "badge-neutral"}>{c.status}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5 truncate">{c.preview}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Atendido por {c.vendedor}</div>
                    </div>
                    <button className="text-xs text-primary hover:underline shrink-0 cursor-pointer">Ver conversa</button>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <a href="#" className="text-sm font-medium hover:underline" style={{ color: "#F97316" }}>Ver todas as 23 conversas →</a>
              </div>
            </div>

            {/* Compras */}
            <div className="card-matflow">
              <h3 className="section-title mb-4">Histórico de Compras</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 500 }}>
                  <thead>
                    <tr className="border-b border-border">
                      <th className="label-text py-2 text-left" style={{ width: "15%" }}>Data</th>
                      <th className="label-text py-2 text-left" style={{ width: "40%" }}>Produtos</th>
                      <th className="label-text py-2 text-left" style={{ width: "25%" }}>Valor</th>
                      <th className="label-text py-2 text-left" style={{ width: "20%" }}>Vendedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoComprasJoao.map((c, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-2 text-muted-foreground">{c.data}</td>
                        <td className="py-2 text-foreground truncate">{c.produtos}</td>
                        <td className="py-2 font-mono-kpi font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(c.valor)}</td>
                        <td className="py-2 text-muted-foreground truncate">{c.vendedor}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border">
                      <td colSpan={2} className="py-2 font-bold text-foreground">Total: {formatCurrency(historicoComprasJoao.reduce((a, c) => a + c.valor, 0))} em {historicoComprasJoao.length} compras</td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Right 40% */}
          <div className="lg:col-span-2 space-y-6">
            {/* LTV */}
            <div className="card-matflow text-center">
              <div className="rounded-2xl p-5" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.20)" }}>
                <div className="font-mono-kpi text-[32px] font-extrabold" style={{ color: "#F97316", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(cliente.ltv)}</div>
                <div className="text-xs text-muted-foreground mt-1">LTV Total</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div><div className="font-mono-kpi text-xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(Math.round(cliente.ltv / 5))}</div><div className="text-xs text-muted-foreground">Ticket Médio</div></div>
                <div><div className="font-mono-kpi text-xl font-bold text-foreground">5</div><div className="text-xs text-muted-foreground">Total de pedidos</div></div>
                <div><div className="text-sm font-medium text-foreground">a cada 38 dias</div><div className="text-xs text-muted-foreground">Frequência média</div></div>
                <div><div className="text-sm font-medium text-foreground">{cliente.ultimaCompra}</div><div className="text-xs text-muted-foreground">Última compra</div></div>
              </div>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={comprasPorMesJoao}>
                    <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="hsl(var(--muted))" />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="valor" fill="#F97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score */}
            <div className="card-matflow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="section-title">Score MatFlow</h3>
                <span className="font-mono-kpi text-2xl font-bold text-foreground">78<span className="text-sm text-muted-foreground font-normal">/100</span></span>
              </div>
              <Progress value={78} className="h-2 mb-3" />
              <span className="badge-success mb-4 inline-block">Cliente Recorrente</span>
              <div className="space-y-2 text-sm mt-3">
                {[
                  { label: "Recorrência", score: 4 },
                  { label: "Ticket médio", score: 3 },
                  { label: "Velocidade de resposta", score: 5 },
                  { label: "Indicações", score: 1 },
                ].map(c => (
                  <div key={c.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-mono-kpi text-xs" style={{ color: "#F97316", letterSpacing: 2 }}>{dots(c.score)} <span className="text-muted-foreground">{c.score}/5</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deals */}
            <div className="card-matflow">
              <h3 className="section-title mb-3">Deals Ativos</h3>
              {dealsAtivosJoao.map((d, i) => (
                <div key={i} className={`py-3 ${i > 0 ? "border-t border-border" : ""}`}>
                  <div className="font-medium text-foreground text-sm">{d.titulo}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={statusBadge[d.status] || "badge-neutral"}>{d.status}</span>
                    <span className="font-mono-kpi text-sm font-bold" style={{ color: "#F97316", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(d.valor)}</span>
                    <span className="text-xs text-muted-foreground">{d.tempo}</span>
                  </div>
                </div>
              ))}
              <button className="text-sm font-medium mt-3 hover:underline cursor-pointer" style={{ color: "#F97316" }}>Ver no Pipeline →</button>
            </div>

            {/* Notas */}
            <div className="card-matflow">
              <h3 className="section-title mb-3">Anotações</h3>
              {anotacoesJoao.map((n, i) => (
                <div key={i} className={`py-2 text-sm ${i > 0 ? "border-t border-border" : ""}`}>
                  <span className="text-muted-foreground">{n.data} — {n.autor}:</span> <span className="text-foreground">{n.texto}</span>
                </div>
              ))}
              <textarea className="input-matflow w-full h-20 py-2 resize-none mt-3" placeholder="Adicionar anotação..." value={novaNota} onChange={e => setNovaNota(e.target.value)} />
              <button className="btn-primary text-sm mt-2">Salvar nota</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
