import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Zap, Search, Bell, CheckSquare, RefreshCw, MessageCircle, Phone, FileText, MapPin, Check } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import NotificacoesDropdown from "./NotificacoesDropdown";
import UserDropdown from "@/components/UserDropdown";
import { mockUser } from "@/data/mockData";
import { useApp, atividadeTipoConfig, type AtividadeTipo } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const tipoIconsHeader: Record<AtividadeTipo, typeof RefreshCw> = { follow_up: RefreshCw, whatsapp: MessageCircle, ligacao: Phone, orcamento: FileText, visita: MapPin };

interface Props {
  title: string;
}

export default function AppHeader({ title }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [animKey, setAnimKey] = useState(0);
  const [atividadesOpen, setAtividadesOpen] = useState(false);
  const atividadesRef = useRef<HTMLDivElement>(null);
  const { atividadesHoje, atividadesAtrasadas, atividadesPendentes, concluirAtividade, getContact } = useApp();
  const navigate = useNavigate();
  const badgeCount = atividadesAtrasadas.length + atividadesHoje.length;
  const badgeColor = atividadesAtrasadas.length > 0 ? "#EF4444" : "#F97316";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (atividadesRef.current && !atividadesRef.current.contains(e.target as Node)) setAtividadesOpen(false);
    };
    if (atividadesOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [atividadesOpen]);

  const handleToggle = () => {
    setAnimKey(k => k + 1);
    toggleTheme();
  };

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <header className="bg-card border-b border-border flex items-center justify-between shrink-0 overflow-hidden" style={{ height: 56, minHeight: 56, padding: "0 32px" }}>
      <h1 className="page-title truncate">{title}</h1>
      <div className="flex items-center gap-2 shrink-0">
        {/* Search trigger — looks like a small input */}
        <button onClick={openSearch} className="hidden md:flex items-center gap-2 rounded-lg cursor-pointer" style={{
          width: 180, height: 32, padding: "0 10px",
          background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))",
          transition: "border-color 150ms ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "hsl(var(--muted-foreground))"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "hsl(var(--border))"; }}
        >
          <Search size={14} className="text-muted-foreground shrink-0" />
          <span className="text-[13px] text-muted-foreground flex-1 text-left">Buscar...</span>
          <kbd className="px-1 py-px rounded text-[11px] font-mono text-muted-foreground shrink-0" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <button
          onClick={handleToggle}
          className="flex items-center justify-center rounded-lg cursor-pointer"
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          style={{ width: 32, height: 32, background: "transparent", transition: "background-color 150ms ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = "hsl(var(--secondary))"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          {theme === "dark" ? (
            <Sun key={`sun-${animKey}`} size={15} className="text-muted-foreground animate-theme-icon" />
          ) : (
            <Moon key={`moon-${animKey}`} size={15} className="text-muted-foreground animate-theme-icon" />
          )}
        </button>

        {/* Activities popover */}
        <div className="relative" ref={atividadesRef}>
          <button onClick={() => setAtividadesOpen(!atividadesOpen)}
            className="relative flex items-center justify-center rounded-lg cursor-pointer"
            title={`${badgeCount} atividades`}
            style={{ width: 32, height: 32, background: "transparent", transition: "background-color 150ms ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = "hsl(var(--secondary))"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <CheckSquare size={15} className="text-muted-foreground" />
            {badgeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: badgeColor }}>{badgeCount}</span>
            )}
          </button>
          {atividadesOpen && (
            <div className="absolute right-0 top-full mt-2 w-[320px] bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden" style={{ animation: "slideDown 150ms ease" }}>
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Suas atividades de hoje</span>
                <button onClick={() => { navigate("/atividades"); setAtividadesOpen(false); }} className="text-xs text-primary hover:underline cursor-pointer">Ver todas →</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {[...atividadesAtrasadas, ...atividadesHoje].slice(0, 5).map(a => {
                  const contact = getContact(a.contact_id);
                  const cfg = atividadeTipoConfig[a.tipo];
                  const TipoIcon = tipoIconsHeader[a.tipo];
                  const hora = a.data_agendada.split("T")[1]?.slice(0, 5) || "";
                  const isAtrasada = a.status === "atrasada" || a.data_agendada < new Date().toISOString();
                  return (
                    <div key={a.id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-secondary transition-colors group">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                        <TipoIcon size={10} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-foreground truncate">{a.titulo}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{contact?.nome}</div>
                      </div>
                      <span className="font-mono text-[11px] shrink-0" style={{ color: isAtrasada ? "#EF4444" : "hsl(var(--muted-foreground))", fontVariantNumeric: "tabular-nums" }}>{hora}</span>
                      <button onClick={e => { e.stopPropagation(); concluirAtividade(a.id); toast.success("✓ Concluída!"); }}
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-500/10">
                        <Check size={11} className="text-green-600" />
                      </button>
                    </div>
                  );
                })}
                {badgeCount === 0 && (
                  <div className="py-6 text-center">
                    <CheckSquare size={24} className="text-green-500 mx-auto mb-1" />
                    <span className="text-sm text-muted-foreground">Tudo em dia!</span>
                  </div>
                )}
                {badgeCount > 5 && (
                  <button onClick={() => { navigate("/atividades"); setAtividadesOpen(false); }} className="w-full py-2 text-xs text-primary hover:underline cursor-pointer text-center border-t border-border">
                    + {badgeCount - 5} outras atividades →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <NotificacoesDropdown />

        {/* Plan badge */}
        {mockUser.plano === "pro" ? (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.10)", color: "#F97316" }}>
            <Zap size={11} /> Pro
          </span>
        ) : (
          <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border border-border text-muted-foreground">Base</span>
        )}

        <UserDropdown />
      </div>
    </header>
  );
}
