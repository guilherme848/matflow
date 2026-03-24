import { NavLink, useLocation } from "react-router-dom";
import { MessageSquare, LayoutGrid, Users, Package, Send, BarChart2, Settings, Zap } from "lucide-react";
import { mockUser } from "@/data/mockData";

const navItems = [
  { label: "Conversas", icon: MessageSquare, path: "/conversas" },
  { label: "Pipeline", icon: LayoutGrid, path: "/pipeline" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Catálogo", icon: Package, path: "/catalogo" },
  { label: "Disparos", icon: Send, path: "/disparos" },
  { label: "Dashboard", icon: BarChart2, path: "/dashboard" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-[60px] lg:w-[240px] bg-sidebar-background border-r border-sidebar-border h-full overflow-y-auto overflow-x-hidden shrink-0">
      {/* Logo */}
      <div className="h-[60px] min-h-[60px] flex items-center px-5 border-b border-sidebar-border shrink-0">
        <span className="text-xl font-bold text-foreground hidden lg:inline" style={{ fontFamily: 'Inter, sans-serif' }}>Mat</span>
        <span className="text-xl font-normal hidden lg:inline" style={{ color: "#F97316", fontFamily: 'Inter, sans-serif' }}>Flow</span>
        <span className="text-xl font-bold text-foreground lg:hidden" style={{ fontFamily: 'Inter, sans-serif' }}>M</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 min-h-0 overflow-hidden">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-150 relative cursor-pointer shrink-0 overflow-hidden
                ${active ? "text-primary font-semibold" : "text-muted-foreground hover:bg-secondary"}`}
              style={active ? { background: "rgba(249,115,22,0.12)" } : {}}>
              {active && <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r" style={{ background: "#F97316" }} />}
              <item.icon size={20} className="shrink-0" />
              <span className="hidden lg:inline truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Plan indicator */}
      <div className="hidden lg:block px-3 pb-2 shrink-0">
        {mockUser.plano === "pro" ? (
          <div className="rounded-xl p-3" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm font-semibold text-foreground">Plano Pro</span>
              <Zap size={14} className="text-primary" />
            </div>
            <div className="text-xs text-muted-foreground">Leads ilimitados este mês</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">IA ativa · 24h</div>
          </div>
        ) : (
          <div className="rounded-xl border border-border p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm font-semibold text-foreground">Plano Base</span>
              <span className="badge-neutral text-[9px]">Base</span>
            </div>
            <div className="text-xs text-muted-foreground mb-1.5">847 / 1.000 leads este mês</div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full" style={{ width: "84.7%", background: 84.7 > 90 ? "hsl(var(--destructive))" : "#F97316" }} />
            </div>
            <NavLink to="/configuracoes" className="text-xs text-primary hover:underline cursor-pointer">Upgrade para Pro</NavLink>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="border-t border-sidebar-border shrink-0">
        <NavLink to="/configuracoes"
          className={({ isActive }) => `flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-150 cursor-pointer overflow-hidden ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:bg-secondary"}`}
          style={({ isActive }) => isActive ? { background: "rgba(249,115,22,0.12)" } : {}}>
          <Settings size={20} className="shrink-0" />
          <span className="hidden lg:inline truncate">Configurações</span>
        </NavLink>
      </div>

      {/* Footer user */}
      <div className="border-t border-sidebar-border px-4 py-3 flex items-center gap-3 shrink-0 overflow-hidden">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>CV</div>
        <div className="hidden lg:block min-w-0">
          <div className="text-sm font-medium text-foreground truncate">Carlos Vendedor</div>
          <span className="badge-neutral text-[10px]">Vendedor</span>
        </div>
      </div>
    </aside>
  );
}
