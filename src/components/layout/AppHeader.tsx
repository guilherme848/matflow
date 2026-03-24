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
