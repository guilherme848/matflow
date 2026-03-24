import { Lightbulb, ExternalLink, RefreshCw, MessageCircle, Phone, FileText, MapPin, Check, Plus, Calendar } from "lucide-react";
import { Cliente } from "@/data/mockData";
import { comprasPorMesJoao, anotacoesJoao } from "@/data/mockData";
import { obrasMock, notasEquipe, redeIndicacoes, timelineCompleta } from "@/data/clientePerfilData";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useApp, atividadeTipoConfig, type AtividadeTipo } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const tipoIcons: Record<AtividadeTipo, typeof RefreshCw> = { follow_up: RefreshCw, whatsapp: MessageCircle, ligacao: Phone, orcamento: FileText, visita: MapPin };

function AtividadesCard({ contactId }: { contactId: string }) {
  const { getAtividadesByContact, concluirAtividade, getContact } = useApp();
  const navigate = useNavigate();
  const atividades = getAtividadesByContact(contactId).filter(a => a.status === "pendente" || a.status === "atrasada").slice(0, 3);
  const totalPendente = getAtividadesByContact(contactId).filter(a => a.status === "pendente" || a.status === "atrasada").length;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Atividades</h3>
          {totalPendente > 0 && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.10)", color: "#F97316" }}>{totalPendente}</span>}
        </div>
        <button onClick={() => navigate(`/atividades?cliente=${contactId}`)} className="text-xs text-primary hover:underline cursor-pointer">+ Nova</button>
      </div>
      {atividades.length === 0 ? (
        <div className="text-center py-4">
          <Calendar size={24} className="text-muted-foreground mx-auto mb-1.5" />
          <p className="text-xs text-muted-foreground">Nenhuma atividade agendada</p>
          <button onClick={() => navigate(`/atividades?cliente=${contactId}`)} className="text-xs text-primary hover:underline cursor-pointer mt-1">+ Agendar atividade</button>
        </div>
      ) : (
        <div className="space-y-1">
          {atividades.map(a => {
            const cfg = atividadeTipoConfig[a.tipo];
            const TipoIcon = tipoIcons[a.tipo];
            const hora = a.data_agendada.split("T")[1]?.slice(0, 5) || "";
            const isAtrasada = a.status === "atrasada" || a.data_agendada < new Date().toISOString();
            return (
              <div key={a.id} className="flex items-center gap-2.5 py-1.5 group" style={{ height: 40 }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                  <TipoIcon size={10} style={{ color: cfg.color }} />
                </div>
                <span className="text-[13px] text-foreground truncate flex-1">{a.titulo}</span>
                <span className="font-mono text-[11px] shrink-0 whitespace-nowrap" style={{ color: isAtrasada ? "#EF4444" : "hsl(var(--muted-foreground))", fontVariantNumeric: "tabular-nums" }}>{hora}</span>
                <button onClick={() => { concluirAtividade(a.id); toast.success("Concluída!"); }}
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-500/10">
                  <Check size={11} className="text-green-600" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {totalPendente > 3 && (
        <button onClick={() => navigate(`/atividades?cliente=${contactId}`)} className="text-xs text-primary hover:underline cursor-pointer mt-2">
          Ver todas as atividades →
        </button>
      )}
    </div>
  );
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}
function getAvatarColor(name: string) {
  const colors = ["#6366F1", "#0F766E", "#F97316", "#EAB308", "#EF4444"];
  return colors[name.charCodeAt(0) % 5];
}

const timelineDotColors: Record<string, string> = {
  compra: "#0F766E",
  conversa: "#6366F1",
  followup: "#EAB308",
  deal: "#F97316",
  tag: "#5D6B82",
  nota: "#8B5CF6",
  cadastro: "#F97316",
};

const scoreData = [
  { label: "Recorrência de compra", score: 8 },
  { label: "Ticket médio", score: 6 },
  { label: "Velocidade de resposta", score: 10 },
  { label: "LTV acumulado", score: 7 },
  { label: "Indicações realizadas", score: 2 },
];

export default function TabVisaoGeral({ cliente }: { cliente: Cliente }) {
  const [novaNota, setNovaNota] = useState("");
  const obraAtiva = obrasMock.find(o => o.ativa);
  const recentTimeline = timelineCompleta.slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Left 60% */}
      <div className="lg:col-span-3 space-y-5">
        {/* Dados Pessoais */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Dados Pessoais</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Editar</button>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              ["Nome completo", cliente.nome],
              ["Apelido", cliente.id === 1 ? "Seu João" : "—"],
              ["CPF", "***.456.***-**"],
              ["Data de nascimento", "12/03/1978"],
              ["Bairro", "Vila Nova"],
              ["Cidade / Estado", "São Paulo / SP"],
              ["Como chegou", cliente.canal],
              ["Data do cadastro", cliente.clienteDesde || "—"],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
                {label === "Como chegou" ? (
                  <span className="badge-info">{value}</span>
                ) : (
                  <div className="text-sm font-medium text-foreground">{value}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Obra Atual */}
        {obraAtiva && (
          <div className="rounded-xl p-5" style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">OBRA ATUAL</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-orange">{obraAtiva.tipo}</span>
              <span className="text-sm font-semibold text-foreground">{obraAtiva.nome}</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">{obraAtiva.endereco}</div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">Estágio:</span>
              <span className="badge-warning">{obraAtiva.estagio}</span>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
              <span>{obraAtiva.area} m²</span>
              <span>Prazo: {obraAtiva.prazo}</span>
              <span>Orçamento: {fmt(obraAtiva.orcamentoTotal)}</span>
            </div>
            <button className="text-xs text-primary hover:underline mt-3 cursor-pointer">Ver todas as obras →</button>
          </div>
        )}

        {/* Resumo de Compras */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Resumo de Compras</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              ["Total gasto", fmt(cliente.ltv)],
              ["Nº de pedidos", "5 pedidos"],
              ["Maior compra", fmt(26050)],
              ["Produtos únicos", "12 itens"],
            ].map(([label, value]) => (
              <div key={label as string} className="text-center">
                <div className="font-mono text-sm font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={comprasPorMesJoao}>
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => fmt(v)}
              />
              <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Score do Cliente</h3>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>78</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
          </div>
          <Progress value={78} className="h-2 mb-2" />
          <span className="badge-success">Recorrente Valioso</span>
          <div className="space-y-2.5 mt-4">
            {scoreData.map(c => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-[160px] shrink-0">{c.label}</span>
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${c.score * 10}%` }} />
                </div>
                <span className="font-mono text-xs font-semibold text-muted-foreground w-8 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{c.score}/10</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg p-3 flex gap-2.5 items-start" style={{ background: "rgba(249,115,22,0.05)" }}>
            <Lightbulb size={14} className="text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Este cliente tem alta recorrência mas ticket médio abaixo do esperado para o perfil. Sugira produtos de maior margem na próxima conversa.
            </p>
          </div>
        </div>
      </div>

      {/* Right 40% */}
      <div className="lg:col-span-2 space-y-5">
        {/* Próximas Atividades */}
        <AtividadesCard contactId={cliente.id.toString().startsWith("c") ? cliente.id.toString() : `c${cliente.id}`} />

        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Últimas Atividades</h3>
          <div className="relative pl-5">
            <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-border" />
            {recentTimeline.map((ev, i) => (
              <div key={i} className="relative pb-4 last:pb-0">
                <div
                  className="absolute left-[-17px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                  style={{ background: timelineDotColors[ev.tipo] || "#5D6B82" }}
                />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">{ev.texto}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{ev.detalhe}</div>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">{ev.data.slice(0, 5)}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="text-xs text-primary hover:underline mt-3 cursor-pointer">Ver histórico completo →</button>
        </div>

        {/* Tags */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Tags</h3>
            <button className="text-xs text-primary hover:underline cursor-pointer">+ Tag</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Construtor", "Alto Valor", "Recorrente", "Paga à vista", "Prefere manhã", "Obra grande"].map(t => (
              <span key={t} className="badge-neutral group cursor-pointer">
                {t} <span className="text-muted-foreground group-hover:text-destructive ml-1">×</span>
              </span>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Notas da Equipe</h3>
          <div className="space-y-3">
            {notasEquipe.map(n => (
              <div key={n.id} className="group">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: getAvatarColor(n.autor) }}>{n.avatar}</div>
                  <span className="text-xs font-medium text-foreground">{n.autor}</span>
                  <span className="text-[11px] text-muted-foreground">· {n.data}</span>
                </div>
                <p className="text-[13px] text-foreground leading-relaxed pl-7">{n.texto}</p>
              </div>
            ))}
          </div>
          <textarea
            className="w-full mt-3 px-3 py-2 text-sm rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground resize-none h-16 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
            placeholder="Adicionar nota..."
            value={novaNota}
            onChange={e => setNovaNota(e.target.value)}
          />
          <button className="btn-primary text-xs mt-2 h-8 px-3">Salvar nota</button>
        </div>

        {/* Rede de Indicações */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Rede de Indicações</h3>
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Indicado por:</div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: getAvatarColor(redeIndicacoes.indicadoPor.nome) }}>
                PM
              </div>
              <span className="text-sm font-medium text-foreground">{redeIndicacoes.indicadoPor.nome}</span>
              <span className="text-xs text-muted-foreground">· há 10 meses</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Indicou {redeIndicacoes.indicou.length} clientes:</div>
            <div className="flex items-center gap-1 mb-1">
              {redeIndicacoes.indicou.map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white -ml-1 first:ml-0 border border-card" style={{ background: getAvatarColor(c.nome) }}>
                  {c.nome.split(" ").map(w => w[0]).join("")}
                </div>
              ))}
            </div>
            <div className="font-mono text-xs font-semibold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmt(redeIndicacoes.totalGerado)} em compras geradas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
