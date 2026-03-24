import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Package, Clock, Users, Upload, Check, QrCode, Rocket, X, Plus } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { label: "Conectar WhatsApp", icon: MessageSquare },
  { label: "Importar Catálogo", icon: Package },
  { label: "Configurar Horários", icon: Clock },
  { label: "Convidar Equipe", icon: Users },
];

const diasSemana = [
  { nome: "Segunda", ativo: true, abertura: "08:00", fechamento: "18:00" },
  { nome: "Terça", ativo: true, abertura: "08:00", fechamento: "18:00" },
  { nome: "Quarta", ativo: true, abertura: "08:00", fechamento: "18:00" },
  { nome: "Quinta", ativo: true, abertura: "08:00", fechamento: "18:00" },
  { nome: "Sexta", ativo: true, abertura: "08:00", fechamento: "18:00" },
  { nome: "Sábado", ativo: true, abertura: "08:00", fechamento: "13:00" },
  { nome: "Domingo", ativo: false, abertura: "", fechamento: "" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [catalogUploaded, setCatalogUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [horarios, setHorarios] = useState(diasSemana);
  const [membros, setMembros] = useState([{ nome: "", email: "", perfil: "Vendedor" }]);
  const [completed, setCompleted] = useState(false);

  const simulateConnect = () => {
    setWhatsappConnected(true);
    toast.success("WhatsApp conectado com sucesso!");
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCatalogUploaded(true);
          toast.success("847 produtos importados!");
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  const addMember = () => {
    if (membros.length < 5) setMembros([...membros, { nome: "", email: "", perfil: "Vendedor" }]);
  };

  const removeMember = (i: number) => {
    setMembros(membros.filter((_, idx) => idx !== i));
  };

  const finish = () => {
    setCompleted(true);
    toast.success("Configuração concluída!");
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background overflow-y-auto">
        <div className="max-w-[600px] w-full px-6 py-12 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce" style={{ background: "rgba(249,115,22,0.12)" }}>
            <Rocket size={40} className="text-primary" />
          </div>
          <h1 className="text-[28px] font-bold text-foreground mb-2">Sua loja está pronta!</h1>
          <p className="text-muted-foreground mb-8">O MatFlow está configurado e pronto para receber seus primeiros leads</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: MessageSquare, title: "Teste o WhatsApp", desc: "Envie uma mensagem para o número conectado" },
              { icon: Package, title: "Veja o Dashboard", desc: "Acompanhe seus leads em tempo real" },
              { icon: Upload, title: "Treine a IA", desc: "Adicione arquivos de conhecimento" },
            ].map((c, i) => (
              <div key={i} className="card-matflow text-center p-4">
                <c.icon size={24} className="text-primary mx-auto mb-2" />
                <div className="text-sm font-semibold text-foreground">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/conversas")} className="btn-primary text-base px-8 py-3">Ir para o painel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-background overflow-y-auto">
      <div className="max-w-[720px] w-full px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-2xl font-bold text-foreground">Mat</span>
            <span className="text-2xl font-normal text-primary">Flow</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao MatFlow, Materiais Silva!</h1>
          <p className="text-muted-foreground mt-2">Configure sua loja em 4 passos simples. Leva menos de 10 minutos.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < currentStep ? "bg-success text-success-foreground" : i === currentStep ? "bg-primary text-primary-foreground" : "border-2 border-border text-muted-foreground"
                }`}>
                  {i < currentStep ? <Check size={18} /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 whitespace-nowrap ${i === currentStep ? "text-primary font-semibold" : "text-muted-foreground"}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-12 sm:w-20 h-0.5 mx-1 mt-[-12px]" style={{ background: i < currentStep ? "hsl(var(--primary))" : "hsl(var(--border))" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card-matflow animate-card-enter">
          {currentStep === 0 && (
            <div className="text-center">
              <MessageSquare size={48} className="text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-1">Conecte o WhatsApp da sua loja</h2>
              <p className="text-muted-foreground text-sm mb-6">Todas as conversas chegam em um só lugar</p>
              {!whatsappConnected ? (
                <>
                  <div className="w-[200px] h-[200px] mx-auto mb-4 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    <QrCode size={64} className="text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Aguardando leitura...
                  </div>
                  <div className="text-left max-w-xs mx-auto mb-6 space-y-2 text-sm text-muted-foreground">
                    <div>1. Abra o WhatsApp no celular</div>
                    <div>2. Toque em Menu → Dispositivos conectados</div>
                    <div>3. Escaneie o código acima</div>
                  </div>
                  <button onClick={simulateConnect} className="btn-outline-primary">Simular conexão</button>
                </>
              ) : (
                <div className="animate-card-enter">
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(15,118,110,0.12)" }}>
                    <Check size={32} className="text-success" />
                  </div>
                  <div className="text-success font-semibold mb-1">WhatsApp conectado com sucesso!</div>
                  <div className="font-mono-kpi text-sm text-muted-foreground">(11) 94321-9876</div>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="text-center">
              <Package size={48} className="text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-1">Importe seu catálogo de produtos</h2>
              <p className="text-muted-foreground text-sm mb-6">A IA vai usar seus produtos para responder orçamentos</p>
              {!catalogUploaded ? (
                <>
                  {uploadProgress > 0 && uploadProgress < 100 ? (
                    <div className="mb-4">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(uploadProgress, 100)}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground">Processando produtos... {Math.min(uploadProgress, 100)}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="border-2 border-dashed border-border rounded-xl p-10 mb-4 cursor-pointer hover:border-primary transition-colors" onClick={simulateUpload}>
                        <Upload size={40} className="text-muted-foreground mx-auto mb-3" />
                        <div className="text-sm text-foreground font-medium">Arraste sua planilha aqui</div>
                        <div className="text-xs text-muted-foreground mt-1">CSV ou XLSX — máximo 10MB</div>
                        <button className="btn-outline-primary mt-3 text-sm" onClick={e => { e.stopPropagation(); simulateUpload(); }}>Selecionar arquivo</button>
                      </div>
                      <a href="#" className="text-primary text-sm hover:underline">Baixar template padrão</a>
                    </>
                  )}
                </>
              ) : (
                <div className="animate-card-enter">
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(15,118,110,0.12)" }}>
                    <Check size={32} className="text-success" />
                  </div>
                  <div className="text-success font-semibold mb-2">✓ 847 produtos importados</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {["Cimento (89)", "Aço (67)", "Piso (54)", "Alvenaria (43)", "Agregados (38)"].map(c => (
                      <div key={c}>{c} produtos</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="text-center mb-6">
                <Clock size={48} className="text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-1">Quando sua loja está aberta?</h2>
                <p className="text-muted-foreground text-sm">Fora do horário, a IA responde automaticamente</p>
              </div>
              <div className="space-y-2">
                {horarios.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button onClick={() => { const h = [...horarios]; h[i] = { ...h[i], ativo: !h[i].ativo }; setHorarios(h); }}
                      className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${d.ativo ? "bg-primary" : "bg-secondary"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${d.ativo ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                    <span className="text-sm text-foreground w-20">{d.nome}</span>
                    {d.ativo ? (
                      <>
                        <input type="time" defaultValue={d.abertura} className="input-matflow text-sm w-28" />
                        <span className="text-muted-foreground">—</span>
                        <input type="time" defaultValue={d.fechamento} className="input-matflow text-sm w-28" />
                      </>
                    ) : (
                      <span className="badge-neutral text-xs">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="text-center mb-6">
                <Users size={48} className="text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-1">Adicione sua equipe de vendas</h2>
                <p className="text-muted-foreground text-sm">Eles vão receber e responder os leads</p>
              </div>
              <div className="space-y-3">
                {membros.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input placeholder="Nome" className="input-matflow flex-1 text-sm" value={m.nome} onChange={e => { const n = [...membros]; n[i] = { ...n[i], nome: e.target.value }; setMembros(n); }} />
                    <input placeholder="E-mail" className="input-matflow flex-1 text-sm" value={m.email} onChange={e => { const n = [...membros]; n[i] = { ...n[i], email: e.target.value }; setMembros(n); }} />
                    <select className="input-matflow w-28 text-sm" value={m.perfil} onChange={e => { const n = [...membros]; n[i] = { ...n[i], perfil: e.target.value }; setMembros(n); }}>
                      <option>Vendedor</option>
                      <option>Gestor</option>
                    </select>
                    {membros.length > 1 && <button onClick={() => removeMember(i)} className="text-muted-foreground hover:text-destructive cursor-pointer"><X size={16} /></button>}
                  </div>
                ))}
              </div>
              {membros.length < 5 && (
                <button onClick={addMember} className="text-muted-foreground text-sm mt-3 flex items-center gap-1 hover:text-foreground cursor-pointer">
                  <Plus size={14} /> Adicionar outro vendedor
                </button>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <div>
              {currentStep > 0 && <button onClick={() => setCurrentStep(s => s - 1)} className="text-muted-foreground text-sm hover:text-foreground cursor-pointer">← Voltar</button>}
              {(currentStep === 1 || currentStep === 3) && (
                <button onClick={() => currentStep === 3 ? finish() : setCurrentStep(s => s + 1)} className="text-muted-foreground text-sm ml-3 hover:text-foreground cursor-pointer">Pular por enquanto</button>
              )}
            </div>
            {currentStep < 3 ? (
              <button onClick={() => setCurrentStep(s => s + 1)} className={`btn-primary ${currentStep === 0 && !whatsappConnected ? "opacity-50" : ""}`} disabled={currentStep === 0 && !whatsappConnected}>
                Próximo →
              </button>
            ) : (
              <button onClick={finish} className="btn-primary">Finalizar configuração</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}