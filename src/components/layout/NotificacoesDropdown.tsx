import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { notificacoes } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const tipoColor: Record<string, string> = {
  urgente: "#EF4444",
  transferencia: "#F97316",
  sucesso: "#0F766E",
  relatorio: "transparent",
  meta: "transparent",
};

const tipoEmoji: Record<string, string> = {
  urgente: "🔴",
  transferencia: "⚡",
  sucesso: "✅",
  relatorio: "📊",
  meta: "🎯",
};

export default function NotificacoesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
        <Bell size={20} className="text-muted-foreground" />
        {naoLidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: "#F97316" }}>
            {naoLidas}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[340px] bg-card rounded-xl border border-border shadow-xl z-50 animate-slide-up overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm">Notificações</span>
              {naoLidas > 0 && <span className="badge-strong text-[10px] py-0">{naoLidas}</span>}
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Marcar todas como lidas</button>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {notificacoes.map(n => (
              <div key={n.id}
                className="px-4 py-3 transition-colors hover:bg-secondary cursor-pointer"
                style={{
                  background: !n.lida ? "rgba(249,115,22,0.04)" : undefined,
                  borderLeft: !n.lida ? `3px solid ${tipoColor[n.tipo]}` : "3px solid transparent",
                }}>
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">{tipoEmoji[n.tipo]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{n.titulo}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{n.subtitulo}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-muted-foreground">{n.tempo}</span>
                      {n.acaoLabel && (
                        <button onClick={(e) => { e.stopPropagation(); navigate(n.acao!); setOpen(false); }}
                          className={`text-[11px] font-semibold cursor-pointer ${n.tipo === "urgente" ? "btn-outline-primary py-0.5 px-2 h-auto" : "text-muted-foreground hover:text-foreground"}`}>
                          {n.acaoLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border text-center">
            <button className="text-sm font-medium cursor-pointer hover:underline" style={{ color: "#F97316" }}>Ver todas as notificações →</button>
          </div>
        </div>
      )}
    </div>
  );
}
