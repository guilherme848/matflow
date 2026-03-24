import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-card-enter">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Icon size={32} className="text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground max-w-[240px]">{subtitle}</p>}
      {action && (
        <button className="btn-outline-primary mt-4" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
