import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import NotificacoesDropdown from "./NotificacoesDropdown";

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

  return (
    <header className="h-[60px] min-h-[60px] bg-card border-b border-border flex items-center justify-between px-8 shrink-0 overflow-hidden">
      <h1 className="page-title truncate">{title}</h1>
      <div className="flex items-center gap-4 shrink-0">
        <NotificacoesDropdown />

        {/* Theme toggle */}
        <button
          onClick={handleToggle}
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? (
            <Sun key={`sun-${animKey}`} size={18} className="text-muted-foreground animate-theme-icon" />
          ) : (
            <Moon key={`moon-${animKey}`} size={18} className="text-muted-foreground animate-theme-icon" />
          )}
        </button>

        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>CS</div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card bg-success" />
        </div>
      </div>
    </header>
  );
}
