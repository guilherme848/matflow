import { NavLink, useLocation } from "react-router-dom";
import { MessageSquare, LayoutGrid, Users, Package, Send, BarChart2, Settings } from "lucide-react";

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
    <aside className="hidden md:flex flex-col w-[60px] lg:w-[240px] bg-card border-r border-border h-full overflow-y-auto overflow-x-hidden shrink-0">
      {/* Logo */}
      <div className="h-[60px] min-h-[60px] flex items-center px-5 border-b border-border shrink-0">
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
              style={active ? { background: "rgba(249,115,22,0.08)" } : {}}>
              {active && <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r" style={{ background: "#F97316" }} />}
              <item.icon size={20} className="shrink-0" />
              <span className="hidden lg:inline truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-border shrink-0">
        <NavLink to="/configuracoes"
          className={({ isActive }) => `flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-150 cursor-pointer overflow-hidden ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:bg-secondary"}`}
          style={({ isActive }) => isActive ? { background: "rgba(249,115,22,0.08)" } : {}}>
          <Settings size={20} className="shrink-0" />
          <span className="hidden lg:inline truncate">Configurações</span>
        </NavLink>
      </div>

      {/* Footer user */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-3 shrink-0 overflow-hidden">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>CV</div>
        <div className="hidden lg:block min-w-0">
          <div className="text-sm font-medium text-foreground truncate">Carlos Vendedor</div>
          <span className="badge-neutral text-[10px]">Vendedor</span>
        </div>
      </div>
    </aside>
  );
}
