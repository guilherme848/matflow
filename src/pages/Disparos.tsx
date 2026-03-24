import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Send, CheckCheck, Eye, Reply, Info, Calendar } from "lucide-react";
import { campanhas, templates, aberturasCumulativas, horasAbertura, type Campanha, type TemplateMensagem } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const tabs = ["Campanhas", "Templates", "Relatórios"] as const;

function pct(a: number, b: number) { return b > 0 ? Math.round((a / b) * 100) : 0; }

const statusBadge: Record<string, string> = {
  enviado: "badge-success",
  agendado: "badge-info",
  rascunho: "badge-neutral",
};

export default function Disparos() {
  const [tab, setTab] = useState<typeof tabs[number]>("Campanhas");
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(2);
  const [audiencia, setAudiencia] = useState("inativos");
  const [quando, setQuando] = useState("agora");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Disparos" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
          {tab === "Campanhas" && <button className="btn-primary text-sm" onClick={() => { setShowWizard(true); setWizardStep(1); }}>+ Nova Campanha</button>}
          {tab === "Templates" && <button className="btn-primary text-sm">+ Novo Template</button>}
        </div>

        {tab === "Campanhas" && <CampanhasTab />}
        {tab === "Templates" && <TemplatesTab />}
        {tab === "Relatórios" && <RelatoriosTab />}
      </div>

      {/* Wizard modal */}
      {showWizard && (
        <>
          <div className="fixed inset-0 z-40 overlay-backdrop animate-fade-page" style={{ backdropFilter: "blur(8px)" }} onClick={() => setShowWizard(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowWizard(false)}>
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-[640px] animate-modal-enter max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Stepper */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-center gap-4">
                  {[1, 2, 3].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${wizardStep >= s ? "text-white" : "border border-border text-muted-foreground"}`}
                        style={wizardStep >= s ? { background: "#F97316" } : {}}>
                        {s}
                      </div>
                      <span className={`text-sm ${wizardStep >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {s === 1 ? "Audiência" : s === 2 ? "Template" : "Revisar"}
                      </span>
                      {s < 3 && <div className="w-8 h-px bg-border" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wizardStep === 1 && (
                  <>
                    <div><label className="label-text mb-1.5 block">Nome da campanha</label><input className="input-matflow w-full" defaultValue="Follow-up Clientes Inativos" /></div>
                    <div className="label-text mb-2">Quem vai receber?</div>
                    {[
                      { v: "todos", l: "Todos os clientes", d: "1.847 contatos" },
                      { v: "inativos", l: "Clientes inativos há mais de 90 dias", d: "234 contatos" },
                      { v: "produto", l: "Por produto comprado", d: "" },
                      { v: "tag", l: "Por tag", d: "" },
                      { v: "canal", l: "Por canal de origem", d: "" },
                    ].map(o => (
                      <label key={o.v} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${audiencia === o.v ? "bg-secondary" : "hover:bg-secondary/50"}`}>
                        <input type="radio" name="aud" checked={audiencia === o.v} onChange={() => setAudiencia(o.v)} className="mt-1 accent-primary" />
                        <div>
                          <span className="text-sm font-medium text-foreground">{o.l}</span>
                          {o.d && <span className="text-xs text-muted-foreground ml-2">{o.d}</span>}
                        </div>
                      </label>
                    ))}
                    <div className="rounded-xl p-4 text-center" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.20)" }}>
                      <div className="text-sm font-medium" style={{ color: "#F97316" }}>✓ 234 contatos selecionados</div>
                      <div className="text-xs text-muted-foreground mt-1">Estimativa de custo: R$ 4,68 (R$ 0,02/msg)</div>
                    </div>
                  </>
                )}
                {wizardStep === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {templates.map(t => (
                      <label key={t.id} className={`card-matflow cursor-pointer transition-all ${selectedTemplate === t.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}>
                        <input type="radio" name="tpl" checked={selectedTemplate === t.id} onChange={() => setSelectedTemplate(t.id)} className="sr-only" />
                        <div className="text-sm font-bold text-foreground mb-2">{t.nome}</div>
                        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                          {t.corpo.split(/(\{\{.*?\}\})/).map((part, i) =>
                            part.startsWith("{{") ? <span key={i} className="badge-attention text-[10px] py-0 mx-0.5">{part}</span> : part
                          )}
                        </p>
                        <span className={t.status === "aprovado" ? "badge-success" : "badge-attention"}>{t.status === "aprovado" ? "Aprovado" : "Pendente"}</span>
                      </label>
                    ))}
                  </div>
                )}
                {wizardStep === 3 && (
                  <>
                    <div className="card-matflow space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Campanha</span><span className="font-medium text-foreground">Follow-up Clientes Inativos</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Audiência</span><span className="font-medium text-foreground">234 contatos inativos +90 dias</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Template</span><span className="font-medium text-foreground">Follow-up de Orçamento</span></div>
                    </div>
                    <div className="card-matflow">
                      <div className="label-text mb-2">Preview da mensagem</div>
                      <div className="bg-secondary rounded-lg p-4 text-sm text-foreground">
                        Oi João Silva, seu orçamento de Cimento CP-II ainda está disponível. Posso te ajudar a fechar? 😊
                      </div>
                    </div>
                    <div>
                      <div className="label-text mb-2">Quando enviar?</div>
                      <label className="flex items-center gap-2 py-1.5 cursor-pointer"><input type="radio" name="quando" checked={quando === "agora"} onChange={() => setQuando("agora")} className="accent-primary" /><span className="text-sm text-foreground">Enviar agora</span></label>
                      <label className="flex items-center gap-2 py-1.5 cursor-pointer"><input type="radio" name="quando" checked={quando === "agendar"} onChange={() => setQuando("agendar")} className="accent-primary" /><span className="text-sm text-foreground">Agendar para depois</span></label>
                      {quando === "agendar" && (
                        <div className="flex gap-3 mt-2">
                          <input className="input-matflow" type="date" />
                          <input className="input-matflow" type="time" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary">
                      <Info size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-[13px] text-muted-foreground">Disparos usam a API oficial do WhatsApp. Certifique-se de ter templates aprovados e saldo disponível na sua conta Meta.</p>
                    </div>
                  </>
                )}
              </div>
              <div className="p-6 border-t border-border flex justify-between">
                {wizardStep > 1 ? (
                  <button onClick={() => setWizardStep(wizardStep - 1)} className="h-10 px-4 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer">← Voltar</button>
                ) : <div />}
                {wizardStep < 3 ? (
                  <button onClick={() => setWizardStep(wizardStep + 1)} className="btn-primary text-sm">Próximo →</button>
                ) : (
                  <button onClick={() => setShowWizard(false)} className="btn-primary text-sm">Confirmar e enviar</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CampanhasTab() {
  return (
    <div className="space-y-4">
      {campanhas.map((c, i) => (
        <div key={c.id} className="card-matflow animate-card-enter" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-semibold text-foreground">{c.nome}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {c.status === "enviado" && `Enviado em ${c.dataEnvio}`}
                {c.status === "agendado" && `Agendado para ${c.dataAgendamento}`}
                {c.status === "rascunho" && `${c.contatos} contatos selecionados`}
              </div>
            </div>
            <span className={statusBadge[c.status]}>{c.status === "enviado" ? "Enviado" : c.status === "agendado" ? "Agendado" : "Rascunho"}</span>
          </div>
          {c.status === "enviado" && c.enviados && (
            <div className="flex flex-wrap gap-3 mb-3">
              <Pill icon={Send} label="Enviados" value={c.enviados} />
              <Pill icon={CheckCheck} label="Entregues" value={c.entregues!} pct={pct(c.entregues!, c.enviados)} />
              <Pill icon={Eye} label="Lidos" value={c.lidos!} pct={pct(c.lidos!, c.enviados)} />
              <Pill icon={Reply} label="Respondidos" value={c.respondidos!} pct={pct(c.respondidos!, c.enviados)} />
            </div>
          )}
          {c.status === "agendado" && (
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span className="font-mono-kpi">{c.contatos?.toLocaleString("pt-BR")} contatos</span>
            </div>
          )}
          <div className="flex gap-2">
            {c.status === "enviado" && <><button className="btn-outline-primary text-[11px]">Ver relatório</button><button className="btn-outline-primary text-[11px]">Duplicar</button></>}
            {c.status === "agendado" && <><button className="btn-outline-primary text-[11px]">Editar</button><button className="h-[28px] px-3 rounded-lg text-[11px] font-semibold border border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer">Cancelar agendamento</button></>}
            {c.status === "rascunho" && <><button className="btn-outline-primary text-[11px]">Continuar editando</button><button className="h-[28px] px-3 rounded-lg text-[11px] font-semibold border border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer">Excluir</button></>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Pill({ icon: Icon, label, value, pct: p }: { icon: any; label: string; value: number; pct?: number }) {
  return (
    <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
      <Icon size={14} className="text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono-kpi text-sm font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{value.toLocaleString("pt-BR")}</span>
      {p !== undefined && <span className="text-xs text-muted-foreground">({p}%)</span>}
    </div>
  );
}

function TemplatesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((t, i) => (
        <div key={t.id} className="card-matflow animate-card-enter" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="text-sm text-foreground mb-3 leading-relaxed">
            {t.corpo.split(/(\{\{.*?\}\})/).map((part, j) =>
              part.startsWith("{{") ? <span key={j} className="badge-attention text-[10px] py-0 mx-0.5">{part}</span> : part
            )}
          </div>
          <div className="font-semibold text-foreground text-sm mb-2">{t.nome}</div>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-neutral">{t.categoria}</span>
            <span className={t.status === "aprovado" ? "badge-success" : "badge-attention"}>{t.status === "aprovado" ? "Aprovado" : "Pendente"}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-3">Criado em {t.criadoEm}</div>
          <div className="flex gap-2">
            <button className="btn-outline-primary text-[11px]">Editar</button>
            <button className="btn-outline-primary text-[11px]">Duplicar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RelatoriosTab() {
  const data = horasAbertura.map((h, i) => ({ hora: h, abertura: aberturasCumulativas[i] }));
  return (
    <div className="space-y-6">
      <div>
        <select className="input-matflow w-72 text-sm mb-4"><option>Promoção Cimento CP-II — Outubro</option></select>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enviados", value: 847, pctVal: 100, color: "#0A0F1E" },
          { label: "Entregues", value: 831, pctVal: 98, color: "#0F766E" },
          { label: "Lidos", value: 412, pctVal: 49, color: "#F97316" },
          { label: "Respondidos", value: 67, pctVal: 8, color: "#6366F1" },
        ].map(k => (
          <div key={k.label} className="card-matflow">
            <div className="label-text mb-1">{k.label}</div>
            <div className="font-mono-kpi text-2xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{k.value.toLocaleString("pt-BR")}</div>
            <div className="text-xs text-muted-foreground mb-2">{k.pctVal}%</div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${k.pctVal}%`, background: k.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="card-matflow">
        <h3 className="section-title mb-4">Aberturas acumuladas após o envio</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hora" tick={{ fontSize: 12 }} stroke="hsl(var(--muted))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted))" unit="%" />
            <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="abertura" stroke="#F97316" strokeWidth={2} dot={{ fill: "#F97316", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
