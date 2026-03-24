import { NavLink, useLocation } from "react-router-dom";
import { MessageSquare, LayoutGrid, Users, Package, Send, BarChart2, Settings, Zap, CheckSquare } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { mockUser } from "@/data/mockData";

const navItems = [
  { label: "Dashboard", icon: BarChart2, path: "/dashboard" },
  { label: "Conversas", icon: MessageSquare, path: "/conversas" },
  { label: "Pipeline", icon: LayoutGrid, path: "/pipeline" },
  { label: "Atividades", icon: CheckSquare, path: "/atividades", badgeKey: "atividades" as const },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Catálogo", icon: Package, path: "/catalogo" },
  { label: "Disparos", icon: Send, path: "/disparos" },
];

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function AppSidebar() {
  const location = useLocation();
  const { atividadesAtrasadas, atividadesHoje } = useApp();
  const atividadesBadgeCount = atividadesAtrasadas.length + atividadesHoje.length;
  const atividadesBadgeColor = atividadesAtrasadas.length > 0 ? "#EF4444" : "#F97316";

  return (
    <aside className="hidden md:flex flex-col bg-card border-r border-border h-full overflow-y-auto overflow-x-hidden shrink-0" style={{ width: 232, minWidth: 232, maxWidth: 232 }}>
      {/* Logo */}
      <div className="shrink-0" style={{ padding: "16px 16px 24px 16px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 600, color: "hsl(var(--foreground))" }}>Mat</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 400, color: "#F97316" }}>Flow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ padding: "0 12px" }}>
        <div className="label-text mb-1" style={{ fontSize: 10, letterSpacing: "0.10em", padding: "0 10px" }}>Menu</div>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            const showBadge = item.badgeKey === "atividades" && atividadesBadgeCount > 0;
            return (
              <NavLink key={item.path} to={item.path}
                className="flex items-center gap-2.5 rounded-lg cursor-pointer overflow-hidden"
                style={{
                  height: 36,
                  padding: "0 10px",
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#F97316" : "hsl(var(--muted-foreground))",
                  background: active ? "rgba(249,115,22,0.10)" : "transparent",
                  transition: "background-color 120ms ease, color 120ms ease",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "hsl(var(--secondary))"; e.currentTarget.style.color = "hsl(var(--foreground))"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(var(--muted-foreground))"; } }}
              >
                <item.icon size={16} className="shrink-0" style={{ color: active ? "#F97316" : "hsl(var(--muted-foreground))" }} />
                <span className="truncate flex-1">{item.label}</span>
                {showBadge && (
                  <span className="text-[9px] font-bold text-white rounded-full flex items-center justify-center shrink-0"
                    style={{ width: 16, height: 16, background: atividadesBadgeColor }}>
                    {atividadesBadgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Plan indicator */}
      <div className="shrink-0" style={{ padding: "0 12px 8px" }}>
        {mockUser.plano === "pro" ? (
          <div className="rounded-xl p-3" style={{ background: "rgba(249,115,22,0.06)" }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm font-semibold text-foreground">Plano Pro</span>
              <Zap size={13} style={{ color: "#F97316" }} />
            </div>
            <div className="text-xs text-muted-foreground">Leads ilimitados</div>
          </div>
        ) : (
          <div className="rounded-xl border border-border p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm font-semibold text-foreground">Plano Base</span>
            </div>
            <div className="text-xs text-muted-foreground mb-1.5">847 / 1.000 leads</div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full" style={{ width: "84.7%", background: "#F97316" }} />
            </div>
            <NavLink to="/configuracoes" className="text-xs font-medium cursor-pointer hover:underline" style={{ color: "#F97316" }}>Upgrade para Pro</NavLink>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="shrink-0" style={{ padding: "0 12px", borderTop: "1px solid hsl(var(--border))", margin: "0 12px" }}>
        <NavLink to="/configuracoes"
          className="flex items-center gap-2.5 rounded-lg cursor-pointer overflow-hidden my-1"
          style={({ isActive }) => ({
            height: 36,
            padding: "0 10px",
            fontSize: 14,
            fontWeight: isActive ? 600 : 500,
            color: isActive ? "#F97316" : "hsl(var(--muted-foreground))",
            background: isActive ? "rgba(249,115,22,0.10)" : "transparent",
            transition: "background-color 120ms ease, color 120ms ease",
          })}
        >
          <Settings size={16} className="shrink-0" />
          <span className="truncate">Configurações</span>
        </NavLink>
      </div>

      {/* Footer user */}
      <div className="shrink-0" style={{ padding: "8px 12px 12px" }}>
        <div className="flex items-center gap-2.5 rounded-xl overflow-hidden" style={{ padding: 12, background: "hsl(var(--secondary))" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(249,115,22,0.12)", color: "#F97316" }}>{getInitials(mockUser.nome)}</div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-foreground truncate">{mockUser.nome}</div>
            <div className="text-[11px] text-muted-foreground truncate">Vendedor</div>
          </div>
          {mockUser.plano === "pro" && (
            <span className="badge-attention text-[9px] shrink-0">Pro</span>
          )}
        </div>
      </div>
    </aside>
  );
}
