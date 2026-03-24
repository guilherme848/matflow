import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import { MessageSquare, Clock, GitBranch, Zap, Users, QrCode, PlusCircle, Upload, Trash2, X, Edit2, MoreHorizontal } from "lucide-react";
import { equipe } from "@/data/mockData";

const sections = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { key: "horario", label: "Horário de Funcionamento", icon: Clock },
  { key: "distribuicao", label: "Distribuição de Leads", icon: GitBranch },
  { key: "ia", label: "Agente de IA", icon: Zap },
  { key: "equipe", label: "Equipe", icon: Users },
];

const diasSemana = [
  { nome: "Segunda", abertura: "08:00", fechamento: "18:00", ativo: true },
  { nome: "Terça", abertura: "08:00", fechamento: "18:00", ativo: true },
  { nome: "Quarta", abertura: "08:00", fechamento: "18:00", ativo: true },
  { nome: "Quinta", abertura: "08:00", fechamento: "18:00", ativo: true },
  { nome: "Sexta", abertura: "08:00", fechamento: "18:00", ativo: true },
  { nome: "Sábado", abertura: "08:00", fechamento: "13:00", ativo: true },
  { nome: "Domingo", abertura: "", fechamento: "", ativo: false },
];

function getAvatarColor(name: string) {
  const colors = ["#F97316", "#6366F1", "#0F766E", "#EAB308", "#EF4444", "#8B5CF6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }

export default function Configuracoes() {
  const { secao } = useParams();
  const navigate = useNavigate();
  const activeSection = secao || "whatsapp";

  const [distribuicao, setDistribuicao] = useState("disponibilidade");
  const [sla, setSla] = useState(15);
  const [notificarSla, setNotificarSla] = useState(true);
  const [redistribuirSla, setRedistribuirSla] = useState(false);
  const [iaAtivo, setIaAtivo] = useState(true);
  const [tomVoz, setTomVoz] = useState("informal");
  const [informarPrecos, setInformarPrecos] = useState(true);
  const [qualificarLead, setQualificarLead] = useState(true);
  const [nuncaRevelarBot, setNuncaRevelarBot] = useState(true);
  const [transferirApos, setTransferirApos] = useState(5);
  const [showInvite, setShowInvite] = useState(false);
  const [mensagemFora, setMensagemFora] = useState("Olá! Nossa loja está fechada no momento. Funcionamos de segunda a sexta das 8h às 18h e sábados das 8h às 13h. Deixe sua mensagem que retornaremos assim que abrirmos! 🏗️");
  const [instrucoes, setInstrucoes] = useState("Sempre pergunte a quantidade necessária e o prazo da obra antes de passar o orçamento. Não ofereça desconto sem consultar o gestor.");
  const [respeitarHorario, setRespeitarHorario] = useState(true);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Configurações" />
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Internal sidebar */}
        <aside className="w-[220px] min-w-[220px] shrink-0 border-r border-border bg-card overflow-y-auto hidden md:block">
          <nav className="py-3">
            {sections.map(s => {
              const active = activeSection === s.key;
              return (
                <button key={s.key} onClick={() => navigate(`/configuracoes/${s.key}`)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all cursor-pointer text-left ${active ? "text-primary font-semibold" : "text-muted-foreground hover:bg-secondary"}`}
                  style={active ? { background: "rgba(249,115,22,0.08)" } : {}}>
                  <s.icon size={18} className="shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8 space-y-6">
          {activeSection === "whatsapp" && <WhatsAppSection />}
          {activeSection === "horario" && (
            <HorarioSection
              respeitarHorario={respeitarHorario} setRespeitarHorario={setRespeitarHorario}
              mensagemFora={mensagemFora} setMensagemFora={setMensagemFora}
            />
          )}
          {activeSection === "distribuicao" && (
            <DistribuicaoSection
              distribuicao={distribuicao} setDistribuicao={setDistribuicao}
              sla={sla} setSla={setSla}
              notificarSla={notificarSla} setNotificarSla={setNotificarSla}
              redistribuirSla={redistribuirSla} setRedistribuirSla={setRedistribuirSla}
            />
          )}
          {activeSection === "ia" && (
            <IASection
              iaAtivo={iaAtivo} setIaAtivo={setIaAtivo}
              tomVoz={tomVoz} setTomVoz={setTomVoz}
              informarPrecos={informarPrecos} setInformarPrecos={setInformarPrecos}
              qualificarLead={qualificarLead} setQualificarLead={setQualificarLead}
              nuncaRevelarBot={nuncaRevelarBot} setNuncaRevelarBot={setNuncaRevelarBot}
              transferirApos={transferirApos} setTransferirApos={setTransferirApos}
              instrucoes={instrucoes} setInstrucoes={setInstrucoes}
            />
          )}
          {activeSection === "equipe" && <EquipeSection showInvite={showInvite} setShowInvite={setShowInvite} />}
        </div>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <>
          <div className="fixed inset-0 z-40 overlay-backdrop animate-fade-page" style={{ backdropFilter: "blur(8px)" }} onClick={() => setShowInvite(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-[480px] animate-modal-enter" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Convidar Vendedor</h2>
                <button onClick={() => setShowInvite(false)} className="p-1 hover:bg-secondary rounded cursor-pointer"><X size={18} className="text-muted-foreground" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="label-text mb-1.5 block">Nome completo</label><input className="input-matflow w-full" /></div>
                <div><label className="label-text mb-1.5 block">E-mail corporativo</label><input className="input-matflow w-full" type="email" /></div>
                <div>
                  <label className="label-text mb-1.5 block">Perfil de acesso</label>
                  <select className="input-matflow w-full"><option>Vendedor</option><option>Gestor</option></select>
                </div>
                <p className="text-[13px] text-muted-foreground">Um link de acesso será enviado ao e-mail. O convite expira em 48 horas.</p>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3">
                <button onClick={() => setShowInvite(false)} className="h-10 px-4 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer">Cancelar</button>
                <button className="btn-primary text-sm" onClick={() => setShowInvite(false)}>Enviar convite</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${on ? "bg-primary" : "bg-border"}`} onClick={onChange}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </div>
  );
}

function WhatsAppSection() {
  return (
    <>
      <div className="card-matflow space-y-4">
        <h3 className="section-title">Conexão Atual</h3>
        <div className="flex items-center gap-3">
          <span className="badge-success flex items-center gap-1.5"><span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: "#0F766E" }} />Conectado</span>
          <span className="font-mono-kpi text-sm text-foreground">(11) 94321-9876</span>
        </div>
        <div className="w-[200px] h-[200px] border-2 border-dashed border-border rounded-lg flex items-center justify-center mx-auto">
          <QrCode size={48} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center">Escaneie com o WhatsApp para reconectar</p>
        <div className="flex gap-3 justify-center">
          <button className="btn-outline-primary">Reconectar</button>
          <button className="h-[32px] px-3 rounded-lg text-xs font-semibold border border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer">Desconectar</button>
        </div>
      </div>

      <div className="card-matflow text-center space-y-3" style={{ background: "hsl(var(--secondary))", border: "1px dashed hsl(var(--border))" }}>
        <PlusCircle size={32} className="mx-auto text-muted-foreground" />
        <div className="font-medium text-foreground">Conectar segundo número</div>
        <p className="text-sm text-muted-foreground">Use para atribuir um número fixo a um vendedor específico</p>
        <button className="btn-outline-primary">+ Conectar</button>
      </div>

      <div className="card-matflow space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="section-title">API Oficial Meta (Disparos em Massa)</h3>
          <span className="badge-neutral">Não configurado</span>
        </div>
        <div><label className="label-text mb-1.5 block">Token de acesso permanente</label><input className="input-matflow w-full" type="password" placeholder="••••••••••••" /></div>
        <div><label className="label-text mb-1.5 block">ID do número de telefone</label><input className="input-matflow w-full" placeholder="Ex: 123456789012345" /></div>
        <p className="text-[13px] text-muted-foreground">Necessário apenas para campanhas de disparo</p>
        <button className="btn-primary text-sm">Salvar e verificar conexão</button>
      </div>
    </>
  );
}

function HorarioSection({ respeitarHorario, setRespeitarHorario, mensagemFora, setMensagemFora }: { respeitarHorario: boolean; setRespeitarHorario: (v: boolean) => void; mensagemFora: string; setMensagemFora: (v: string) => void }) {
  return (
    <>
      <div className="card-matflow space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="section-title">Horário de Funcionamento</h3>
            <p className="text-sm text-muted-foreground mt-1">Fora do horário configurado, o agente responde automaticamente com a mensagem abaixo</p>
          </div>
          <ToggleSwitch on={respeitarHorario} onChange={() => setRespeitarHorario(!respeitarHorario)} />
        </div>
        <div className="space-y-2">
          {diasSemana.map(d => (
            <div key={d.nome} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <ToggleSwitch on={d.ativo} onChange={() => {}} />
              <span className="w-24 text-sm font-medium text-foreground">{d.nome}</span>
              {d.ativo ? (
                <>
                  <input className="input-matflow w-24 text-center text-sm" type="time" defaultValue={d.abertura} />
                  <span className="text-muted-foreground">—</span>
                  <input className="input-matflow w-24 text-center text-sm" type="time" defaultValue={d.fechamento} />
                </>
              ) : (
                <span className="badge-neutral">Fechado</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="card-matflow space-y-3">
        <label className="label-text block">Mensagem fora do horário</label>
        <textarea className="input-matflow w-full h-28 py-2 resize-none" value={mensagemFora} onChange={e => setMensagemFora(e.target.value)} maxLength={500} />
        <div className="text-right text-xs text-muted-foreground">{mensagemFora.length}/500</div>
        <button className="btn-primary text-sm">Salvar mensagem</button>
      </div>
    </>
  );
}

function DistribuicaoSection({ distribuicao, setDistribuicao, sla, setSla, notificarSla, setNotificarSla, redistribuirSla, setRedistribuirSla }: any) {
  const opcoes = [
    { value: "round-robin", label: "Round-Robin", desc: "Distribui em rotação igual entre todos os vendedores ativos" },
    { value: "disponibilidade", label: "Por Disponibilidade", desc: "Lead vai para o vendedor online no momento do contato" },
    { value: "manual", label: "Manual", desc: "Gestor atribui cada lead manualmente pelo painel" },
    { value: "especialidade", label: "Por Especialidade", desc: "Define qual vendedor atende cada categoria de produto" },
  ];
  return (
    <>
      <div className="card-matflow space-y-4">
        <h3 className="section-title">Regra de Distribuição</h3>
        <div className="space-y-3">
          {opcoes.map(o => (
            <label key={o.value} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${distribuicao === o.value ? "bg-secondary" : "hover:bg-secondary/50"}`}>
              <input type="radio" name="dist" checked={distribuicao === o.value} onChange={() => setDistribuicao(o.value)} className="mt-1 accent-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">{o.label}</div>
                <div className="text-[13px] text-muted-foreground">{o.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="card-matflow space-y-4">
        <h3 className="section-title">SLA de Resposta</h3>
        <div>
          <div className="text-sm text-foreground mb-2">Tempo máximo sem resposta</div>
          <input type="range" min={5} max={60} step={5} value={sla} onChange={e => setSla(Number(e.target.value))} className="w-full accent-primary" />
          <div className="text-center font-mono-kpi text-lg font-bold" style={{ color: "#F97316" }}>{sla} minutos</div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-foreground">Notificar gestor ao atingir o SLA</span>
          <ToggleSwitch on={notificarSla} onChange={() => setNotificarSla(!notificarSla)} />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-foreground">Redistribuir lead automaticamente após o SLA</span>
          <ToggleSwitch on={redistribuirSla} onChange={() => setRedistribuirSla(!redistribuirSla)} />
        </div>
      </div>
      {distribuicao === "especialidade" && (
        <div className="card-matflow space-y-3 animate-card-enter">
          <h3 className="section-title">Configuração por Especialidade</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="label-text py-2 text-left">Categoria</th><th className="label-text py-2 text-left">Vendedor Responsável</th></tr></thead>
            <tbody>
              {["Cimento", "Aço", "Piso", "Alvenaria", "Agregados", "Hidráulica", "Cobertura", "Acabamento", "Tintas"].map(cat => (
                <tr key={cat} className="border-b border-border">
                  <td className="py-2 text-foreground">{cat}</td>
                  <td className="py-2"><select className="input-matflow w-full text-sm"><option>Carlos Silva</option><option>Ana Oliveira</option><option>Ricardo Santos</option><option>Fernanda Lima</option></select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function IASection({ iaAtivo, setIaAtivo, tomVoz, setTomVoz, informarPrecos, setInformarPrecos, qualificarLead, setQualificarLead, nuncaRevelarBot, setNuncaRevelarBot, transferirApos, setTransferirApos, instrucoes, setInstrucoes }: any) {
  return (
    <>
      <div className="card-matflow space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="section-title">Status do Agente</h3>
          <ToggleSwitch on={iaAtivo} onChange={() => setIaAtivo(!iaAtivo)} />
        </div>
        <span className="badge-attention">Plano Pro — IA Incluída</span>
        <p className="text-sm text-muted-foreground">O agente responde automaticamente fora do horário e qualifica leads antes de transferir para o vendedor</p>
      </div>

      <div className="card-matflow space-y-4">
        <h3 className="section-title">Personalidade</h3>
        <div><label className="label-text mb-1.5 block">Nome do assistente</label><input className="input-matflow w-full" defaultValue="Assistente MatFlow" /></div>
        <div>
          <label className="label-text mb-2 block">Tom de voz</label>
          {[{ v: "informal", l: "Informal e próximo", rec: true }, { v: "formal", l: "Formal e profissional" }, { v: "tecnico", l: "Técnico e direto" }].map(o => (
            <label key={o.v} className="flex items-center gap-2 py-1.5 cursor-pointer">
              <input type="radio" name="tom" checked={tomVoz === o.v} onChange={() => setTomVoz(o.v)} className="accent-primary" />
              <span className="text-sm text-foreground">{o.l}</span>
              {o.rec && <span className="text-[10px] text-muted-foreground">(recomendado)</span>}
            </label>
          ))}
        </div>
        <div>
          <label className="label-text mb-1.5 block">Instruções personalizadas</label>
          <textarea className="input-matflow w-full h-24 py-2 resize-none" value={instrucoes} onChange={e => setInstrucoes(e.target.value)} />
          <div className="text-right text-xs text-muted-foreground">{instrucoes.length} caracteres</div>
        </div>
      </div>

      <div className="card-matflow space-y-3">
        <h3 className="section-title">Comportamento</h3>
        {[
          { label: "Informar preços automaticamente", on: informarPrecos, toggle: () => setInformarPrecos(!informarPrecos) },
          { label: "Qualificar lead antes de transferir", on: qualificarLead, toggle: () => setQualificarLead(!qualificarLead) },
          { label: "Nunca revelar que é um bot", on: nuncaRevelarBot, toggle: () => setNuncaRevelarBot(!nuncaRevelarBot) },
        ].map(t => (
          <div key={t.label} className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">{t.label}</span>
            <ToggleSwitch on={t.on} onChange={t.toggle} />
          </div>
        ))}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-foreground">Transferir para humano após X mensagens sem resolução</span>
          <select className="input-matflow w-20 text-sm text-center" value={transferirApos} onChange={e => setTransferirApos(Number(e.target.value))}>
            {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="card-matflow space-y-4">
        <h3 className="section-title">Base de Conhecimento</h3>
        {[
          { nome: "Catálogo Completo 2024.pdf", info: "847 chunks · atualizado há 3 dias" },
          { nome: "Política de Entrega.docx", info: "23 chunks · atualizado há 1 semana" },
          { nome: "FAQ Clientes.xlsx", info: "156 perguntas · atualizado há 2 dias" },
        ].map(f => (
          <div key={f.nome} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <div className="text-sm font-medium text-foreground">{f.nome}</div>
              <div className="text-xs text-muted-foreground">{f.info}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="badge-success text-[9px]">Processado</span>
              <Trash2 size={14} className="text-muted-foreground hover:text-destructive cursor-pointer" />
            </div>
          </div>
        ))}
        {/* Upload progress mockup */}
        <div className="rounded-lg p-3" style={{ background: "rgba(249,115,22,0.06)" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-foreground">Processando FAQ Clientes.xlsx...</span>
            <span className="font-mono-kpi text-xs" style={{ color: "#F97316" }}>67%</span>
          </div>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "67%", background: "#F97316" }} />
          </div>
        </div>
        <div className="border-2 border-dashed border-border rounded-lg p-5 text-center" style={{ background: "hsl(var(--secondary))" }}>
          <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
          <div className="text-sm text-foreground mb-1">Arraste arquivos para treinar o agente</div>
          <div className="text-xs text-muted-foreground mb-3">PDF, Word, XLSX, TXT — máx. 20MB</div>
          <button className="btn-outline-primary text-xs">Selecionar arquivo</button>
        </div>
      </div>
    </>
  );
}

function EquipeSection({ showInvite, setShowInvite }: { showInvite: boolean; setShowInvite: (v: boolean) => void }) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Equipe</h3>
        <button className="btn-primary text-sm" onClick={() => setShowInvite(true)}>+ Convidar Vendedor</button>
      </div>
      <div className="card-matflow overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr className="text-left border-b border-border">
                <th className="label-text py-3 px-4">Usuário</th>
                <th className="label-text py-3 px-3">E-mail</th>
                <th className="label-text py-3 px-3">Perfil</th>
                <th className="label-text py-3 px-3">Status</th>
                <th className="label-text py-3 px-3">Último Acesso</th>
                <th className="label-text py-3 px-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipe.map((u, i) => (
                <tr key={u.id} className="table-row-hover border-t border-border animate-card-enter" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: getAvatarColor(u.nome) }}>{getInitials(u.nome)}</div>
                      <span className="font-medium text-foreground truncate">{u.nome}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground truncate">{u.email}</td>
                  <td className="py-2 px-3"><span className={u.perfil === "Gestor" ? "badge-attention" : "badge-neutral"}>{u.perfil}</span></td>
                  <td className="py-2 px-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${u.status === "online" ? "animate-pulse-dot" : ""}`} style={{ background: u.status === "online" ? "#0F766E" : "#9CA3AF" }} />
                      <span className={`text-sm ${u.status === "online" ? "text-success" : "text-muted-foreground"}`}>{u.status === "online" ? "Online agora" : "Offline"}</span>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">{u.ultimoAcesso}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <Edit2 size={14} className="text-muted-foreground hover:text-primary cursor-pointer" />
                      <MoreHorizontal size={14} className="text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
