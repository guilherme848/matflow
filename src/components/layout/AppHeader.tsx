import { Bell } from "lucide-react";

interface Props {
  title: string;
}

export default function AppHeader({ title }: Props) {
  return (
    <header className="h-[60px] bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-20">
      <h1 className="page-title">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground" style={{ background: "#F97316" }}>
            3
          </span>
        </button>
        <div className="relative">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>
            CS
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card" style={{ background: "#0F766E" }} />
        </div>
      </div>
    </header>
  );
}
