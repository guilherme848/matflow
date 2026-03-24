import { useState } from "react";
import { Lock, Zap, Check, X } from "lucide-react";
import { mockUser } from "@/data/mockData";

interface FeatureLockProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
}

export function FeatureLock({ children, feature, description }: FeatureLockProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (mockUser.plano === "pro") return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{ filter: "blur(2px)", opacity: 0.4 }}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: "var(--overlay)" }}>
        <div className="card-matflow text-center p-6 max-w-[320px] pointer-events-auto">
          <Lock size={24} className="text-primary mx-auto mb-2" />
          <div className="text-foreground font-semibold mb-1">Disponível no Plano Pro</div>
          <div className="text-muted-foreground text-[13px] mb-4">{description || feature}</div>
          <button onClick={() => setShowUpgrade(true)} className="btn-primary w-full mb-2">Fazer upgrade</button>
          <button className="text-muted-foreground text-sm hover:text-foreground cursor-pointer">Saiba mais</button>
        </div>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export function UpgradeModal({ onClose }: { onClose: () => void }) {
  const baseFeat = ["Até 1.000 leads/mês", "Pipeline visual", "Tabela de clientes", "2 vendedores", "Suporte por e-mail"];
  const proFeat = ["Leads ilimitados", "Pipeline visual", "Tabela de clientes", "Vendedores ilimitados", "Suporte prioritário", "Agente IA 24h no WhatsApp", "Copiloto de vendas em tempo real", "Follow-up automático D+1, D+3, D+7", "Base de conhecimento treinável", "LTV por canal de origem", "Disparos em massa inclusos"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--overlay)" }} onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border max-w-[600px] w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-enter" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Desbloqueie o poder da IA</h2>
            <p className="text-muted-foreground text-sm mt-1">Tudo do Plano Base + inteligência artificial no coração da sua operação</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-border p-4">
              <span className="badge-neutral text-[10px] mb-2 inline-block">Seu plano atual</span>
              <div className="text-xl font-bold text-foreground">Plano Base</div>
              <div className="font-mono-kpi text-lg font-bold text-muted-foreground mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>R$ 490<span className="text-xs font-normal">/mês</span></div>
              <div className="mt-3 space-y-1.5">
                {baseFeat.map(f => <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground"><Check size={12} className="shrink-0" />{f}</div>)}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ border: "2px solid #F97316" }}>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}>Recomendado</span>
              <div className="text-xl font-bold text-foreground">Plano Pro</div>
              <div className="font-mono-kpi text-lg font-bold text-primary mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>R$ 980<span className="text-xs font-normal text-muted-foreground">/mês</span></div>
              <div className="mt-3 space-y-1.5">
                {proFeat.map((f, i) => (
                  <div key={f} className="flex items-center gap-2 text-xs" style={{ color: i >= 5 ? "#F97316" : "hsl(var(--foreground))" }}>
                    <Check size={12} className="shrink-0" style={{ color: i >= 5 ? "#F97316" : "hsl(var(--muted-foreground))" }} />
                    {f}
                    {i >= 5 && <span className="text-[9px] px-1 py-0 rounded" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}>Novo</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(249,115,22,0.06)" }}>
            <div className="text-sm font-semibold text-foreground">Se fechar apenas 1 venda a mais por mês...</div>
            <div className="text-sm text-muted-foreground mt-1">O Plano Pro se paga em uma única venda acima de R$ 980</div>
          </div>

          <button className="btn-primary w-full py-3 text-base mb-2">Quero fazer upgrade</button>
          <button onClick={onClose} className="text-muted-foreground text-sm w-full text-center block hover:text-foreground cursor-pointer">Continuar no Plano Base</button>
          <div className="text-center text-xs text-muted-foreground mt-2">Sem fidelidade. Cancele quando quiser.</div>
        </div>
      </div>
    </div>
  );
}