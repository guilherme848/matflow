import { Zap, Lightbulb, Package } from "lucide-react";
import { preferenciasCliente, comportamentoCliente, insightsIA } from "@/data/clientePerfilData";

const dots = (score: number, max: number = 5) =>
  Array.from({ length: max }, (_, i) => i < score ? "●" : "○").join("");

export default function TabPreferencias() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left */}
      <div className="space-y-5">
        {/* Preferências de Compra */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Preferências de Compra</h3>

          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Marcas preferidas</div>
            <div className="flex gap-1.5 flex-wrap">
              {preferenciasCliente.marcas.map(m => (
                <span key={m} className="badge-neutral">{m} ×</span>
              ))}
              <button className="badge-neutral cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">+ adicionar</button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Categorias de interesse</div>
            <div className="space-y-1.5">
              {preferenciasCliente.categorias.map(c => (
                <label key={c.nome} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" defaultChecked={c.ativo} className="rounded border-border accent-primary" />
                  <span className={c.ativo ? "text-foreground" : "text-muted-foreground"}>{c.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Produtos recorrentes</div>
            <div className="space-y-1.5">
              {preferenciasCliente.produtosRecorrentes.map(p => (
                <div key={p.nome} className="flex items-center gap-2 text-xs">
                  <Package size={12} className="text-muted-foreground" />
                  <span className="text-foreground flex-1">{p.nome}</span>
                  <span className="text-muted-foreground">comprou {p.vezes}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preferências de Atendimento */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Preferências de Atendimento</h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1.5">Melhor horário</div>
              <div className="flex gap-1.5">
                {["Manhã", "Tarde", "Noite"].map(h => (
                  <span key={h} className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    h === preferenciasCliente.horario ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary text-muted-foreground"
                  }`}>{h}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1.5">Canal preferido</div>
              <span className="badge-success">{preferenciasCliente.canal}</span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1.5">Tom preferido</div>
              <div className="flex gap-1.5">
                {["Formal", "Informal", "Técnico"].map(t => (
                  <span key={t} className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    t === preferenciasCliente.tom ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary text-muted-foreground"
                  }`}>{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Aceita promoções</span>
              <span className="badge-success">Sim</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Aceita disparos em massa</span>
              <span className="badge-success">Sim</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Frequência de contato</span>
              <span className="text-xs text-foreground font-medium">{preferenciasCliente.frequenciaContato}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="space-y-5">
        {/* Comportamento */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Histórico de Comportamento</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Tempo médio de resposta</span>
                <span className="font-mono text-xs font-semibold text-foreground">{comportamentoCliente.tempoResposta}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Taxa de resposta a follow-ups</span>
                <span className="font-mono text-xs font-semibold text-foreground">{comportamentoCliente.taxaFollowUp}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${comportamentoCliente.taxaFollowUp}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Abertura de campanhas</span>
                <span className="font-mono text-xs font-semibold text-foreground">{comportamentoCliente.aberturaCampanhas}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${comportamentoCliente.aberturaCampanhas}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Sensibilidade a preço</span>
                <span className="font-mono text-xs tracking-widest text-primary">
                  {dots(comportamentoCliente.sensibilidadePreco)} <span className="text-muted-foreground">{comportamentoCliente.sensibilidadePreco}/5</span>
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Pediu desconto em 2 de 5 compras. Aceita 5% à vista.</p>
            </div>
          </div>
        </div>

        {/* Insights IA */}
        <div className="rounded-xl p-5" style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.15)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Insights da IA</h3>
          </div>
          <div className="space-y-3">
            {insightsIA.map((insight, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Lightbulb size={12} className="text-primary mt-0.5 shrink-0" />
                <p className="text-[13px] text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
