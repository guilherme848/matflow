import { NavLink, useLocation } from "react-router-dom";
import { MessageSquare, LayoutGrid, Users, BarChart2 } from "lucide-react";

const items = [
  { label: "Conversas", icon: MessageSquare, path: "/conversas" },
  { label: "Pipeline", icon: LayoutGrid, path: "/pipeline" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Dashboard", icon: BarChart2, path: "/dashboard" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around h-14 shrink-0">
      {items.map(item => {
        const active = location.pathname.startsWith(item.path);
        return (
          <NavLink key={item.path} to={item.path}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full cursor-pointer transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
            <item.icon size={20} className="shrink-0" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
