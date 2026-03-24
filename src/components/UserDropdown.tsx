import { useState, useRef, useEffect } from "react";
import { User, Settings, Sparkles, HelpCircle, LogOut, X, PlayCircle, MessageCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockUser } from "@/data/mockData";

function ChangelogModal({ onClose }: { onClose: () => void }) {
  const items = [
    { icon: "⚡", title: "Copiloto com sugestões de cross-sell", desc: "A IA agora sugere produtos complementares com base no histórico de compras do cliente", date: "15 nov 2024", isNew: true },
    { icon: "📈", title: "LTV por canal de origem no Dashboard", desc: "Veja qual canal traz os clientes mais valiosos para sua loja", date: "15 nov 2024", isNew: true },
    { icon: "🌙", title: "Modo escuro disponível", desc: "Alterne o tema pelo ícone no header", date: "08 nov 2024", isNew: false },
    { icon: "📨", title: "Módulo de disparos em massa", desc: "Envie campanhas para toda sua base via WhatsApp", date: "01 nov 2024", isNew: false },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--overlay)" }} onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border max-w-[560px] w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-enter" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">Novidades do MatFlow</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">v1.2</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{item.title}</span>
                    {item.isNew && <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}>Novo</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{item.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-border text-center">
          <button className="text-sm font-medium cursor-pointer hover:underline" style={{ color: "#F97316" }}>Ver histórico completo de atualizações →</button>
        </div>
      </div>
    </div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"inicio" | "tutoriais" | "contato">("inicio");
  const topics = ["Como conectar o WhatsApp", "Importar catálogo de produtos", "Configurar o Agente de IA", "Entender o Dashboard"];
  const tutorials = [
    { title: "Primeiros passos com o MatFlow", duration: "5min" },
    { title: "Configurando o Agente de IA", duration: "4min" },
    { title: "Como usar o Pipeline de Vendas", duration: "3min" },
    { title: "Importando seu catálogo", duration: "2min" },
    { title: "Entendendo o Dashboard", duration: "3min" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--overlay)" }} onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border max-w-[560px] w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-enter" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">Central de Ajuda</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
        </div>
        <div className="border-b border-border px-5 flex gap-4">
          {(["inicio", "tutoriais", "contato"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`py-2.5 text-sm font-medium border-b-2 cursor-pointer transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
              {t === "inicio" ? "Início" : t === "tutoriais" ? "Tutoriais" : "Contato"}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === "inicio" && (
            <>
              <input className="input-matflow w-full mb-4" placeholder="Buscar ajuda..." />
              <div className="grid grid-cols-2 gap-3">
                {topics.map(t => (
                  <div key={t} className="rounded-xl border border-border p-4 hover:bg-secondary transition-colors cursor-pointer">
                    <HelpCircle size={20} className="text-primary mb-2" />
                    <div className="text-sm font-medium text-foreground">{t}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === "tutoriais" && (
            <div className="space-y-2">
              {tutorials.map(t => (
                <div key={t.title} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                  <PlayCircle size={20} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium text-foreground truncate">{t.title}</div></div>
                  <span className="text-xs text-muted-foreground shrink-0">{t.duration}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "contato" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border p-4">
                <div className="text-sm font-medium text-foreground mb-1">Falar com suporte</div>
                <div className="text-xs text-muted-foreground mb-3">Respondemos em até 2 horas via WhatsApp</div>
                <button className="text-sm font-medium px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer" style={{ background: "#25D366" }}><MessageCircle size={16} /> Abrir WhatsApp</button>
              </div>
              <div className="rounded-xl border border-border p-4">
                <div className="text-sm font-medium text-foreground mb-1">Agendar demonstração</div>
                <div className="text-xs text-muted-foreground mb-3">Mostre o MatFlow para sua equipe com um especialista ao vivo</div>
                <button className="btn-outline-primary text-sm">Agendar</button>
              </div>
              <div className="rounded-xl border border-border p-4 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shrink-0" />
                <div className="flex-1"><div className="text-sm font-medium text-foreground">Todos os sistemas operacionais</div></div>
                <button className="text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1">Status <ExternalLink size={10} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    { label: "Meu Perfil", icon: User, action: () => { navigate("/perfil"); setOpen(false); } },
    { label: "Configurações da Loja", icon: Settings, action: () => { navigate("/configuracoes"); setOpen(false); } },
    "divider" as const,
    { label: "Novidades do MatFlow", icon: Sparkles, action: () => { setShowChangelog(true); setOpen(false); }, badge: "2 novas" },
    { label: "Central de Ajuda", icon: HelpCircle, action: () => { setShowHelp(true); setOpen(false); } },
    "divider" as const,
    { label: "Sair", icon: LogOut, action: () => setOpen(false), destructive: true },
  ];

  return (
    <>
      <div ref={ref} className="relative shrink-0">
        <button onClick={() => setOpen(!open)} className="relative cursor-pointer">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>CS</div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card bg-success" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-[280px] bg-card rounded-xl border border-border shadow-xl z-50 animate-slide-up overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>CS</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{mockUser.nome}</div>
                <div className="text-xs text-muted-foreground truncate">carlos@materiaissilva.com.br</div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block" style={{ background: mockUser.plano === "pro" ? "rgba(249,115,22,0.15)" : "rgba(0,0,0,0.06)", color: mockUser.plano === "pro" ? "#F97316" : "hsl(var(--muted-foreground))" }}>
                  {mockUser.plano === "pro" ? "Pro" : "Base"}
                </span>
              </div>
            </div>
            <div className="py-1">
              {menuItems.map((item, i) => {
                if (item === "divider") return <div key={i} className="my-1 border-t border-border" />;
                const it = item as Exclude<typeof item, "divider">;
                return (
                  <button key={i} onClick={it.action} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-secondary ${it.destructive ? "text-destructive" : "text-foreground"}`}>
                    <it.icon size={16} className="shrink-0" />
                    <span className="flex-1 text-left">{it.label}</span>
                    {it.badge && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}>{it.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
