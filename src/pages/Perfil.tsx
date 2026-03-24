import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { mockUser } from "@/data/mockData";
import { toast } from "sonner";

export default function Perfil() {
  const [nome, setNome] = useState(mockUser.nome);
  const [senha, setSenha] = useState("");
  const strengthLabel = senha.length === 0 ? "" : senha.length < 6 ? "Fraca" : senha.length < 10 ? "Média" : "Forte";
  const strengthColor = senha.length < 6 ? "hsl(var(--destructive))" : senha.length < 10 ? "#EAB308" : "hsl(var(--success))";
  const strengthPct = senha.length === 0 ? 0 : senha.length < 6 ? 33 : senha.length < 10 ? 66 : 100;

  const notifs = [
    { label: "Novo lead atribuído", on: true },
    { label: "Lead aguardando >15min", on: true },
    { label: "Deal fechado pela equipe", on: true },
    { label: "Resumo diário às 08h", on: false },
    { label: "Relatório semanal", on: false },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Meu Perfil" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
        <div className="max-w-[640px] mx-auto space-y-6">
          {/* Info */}
          <div className="card-matflow">
            <h3 className="section-title mb-4">Informações Pessoais</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shrink-0" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>CS</div>
              <button className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Alterar foto</button>
            </div>
            <div className="space-y-3">
              <div><label className="label-text block mb-1">Nome completo</label><input className="input-matflow w-full" value={nome} onChange={e => setNome(e.target.value)} /></div>
              <div><label className="label-text block mb-1">E-mail</label><input className="input-matflow w-full" defaultValue="carlos@materiaissilva.com.br" /></div>
              <div><label className="label-text block mb-1">WhatsApp pessoal</label><input className="input-matflow w-full" defaultValue="(11) 99234-5678" /></div>
              <div><label className="label-text block mb-1">Cargo</label><input className="input-matflow w-full" defaultValue="Vendedor Sênior" /></div>
            </div>
            <button className="btn-primary mt-4" onClick={() => toast.success("Perfil salvo!")}>Salvar alterações</button>
          </div>

          {/* Security */}
          <div className="card-matflow">
            <h3 className="section-title mb-4">Segurança</h3>
            <div className="space-y-3">
              <div><label className="label-text block mb-1">Senha atual</label><input type="password" className="input-matflow w-full" /></div>
              <div>
                <label className="label-text block mb-1">Nova senha</label>
                <input type="password" className="input-matflow w-full" value={senha} onChange={e => setSenha(e.target.value)} />
                {senha && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${strengthPct}%`, background: strengthColor }} />
                    </div>
                    <span className="text-xs mt-1 block" style={{ color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
              </div>
              <div><label className="label-text block mb-1">Confirmar nova senha</label><input type="password" className="input-matflow w-full" /></div>
            </div>
            <button className="btn-primary mt-4" onClick={() => toast.success("Senha alterada!")}>Alterar senha</button>
          </div>

          {/* Notifications */}
          <div className="card-matflow">
            <h3 className="section-title mb-4">Preferências de Notificação</h3>
            <div className="space-y-3">
              {notifs.map(n => (
                <div key={n.label} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{n.label}</span>
                  <button className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${n.on ? "bg-primary" : "bg-secondary"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${n.on ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions */}
          <div className="card-matflow">
            <h3 className="section-title mb-4">Sessões Ativas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-foreground">Chrome · MacBook Pro · São Paulo · Agora</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(15,118,110,0.10)", color: "hsl(var(--success))" }}>Este dispositivo</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div className="text-sm text-foreground">Safari · iPhone 14 · São Paulo · há 2 horas</div>
              </div>
            </div>
            <button className="text-sm text-destructive hover:underline cursor-pointer mt-3">Encerrar outras sessões</button>
          </div>
        </div>
      </div>
    </div>
  );
}
