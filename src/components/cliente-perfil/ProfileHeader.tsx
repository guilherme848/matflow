import { MessageSquare, Edit2, MoreHorizontal, Phone, Copy, Tag, UserPlus, Star, Archive, Download } from "lucide-react";
import { Cliente } from "@/data/mockData";
import { useState } from "react";

function getAvatarColor(name: string) {
  const colors = ["#6366F1", "#0F766E", "#F97316", "#EAB308", "#EF4444"];
  return colors[name.charCodeAt(0) % 5];
}
function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}
function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

interface Props {
  cliente: Cliente;
}

export default function ProfileHeader({ cliente }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const avatarColor = getAvatarColor(cliente.nome);
  const ticketMedio = Math.round(cliente.ltv / 5);
  const apelido = cliente.id === 1 ? "Seu João" : null;

  const freqColor = cliente.frequencia === "Recorrente" ? "badge-success" :
    cliente.frequencia === "Alto Valor" ? "badge-strong" :
    cliente.frequencia === "Inativo" ? "badge-danger" : "badge-neutral";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-7">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Identity */}
        <div className="flex gap-5 items-start flex-1 min-w-0">
          <div className="relative shrink-0">
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: avatarColor, border: `3px solid ${avatarColor}` }}
            >
              {getInitials(cliente.nome)}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="text-[22px] font-semibold text-foreground tracking-[-0.3px]">{cliente.nome}</h1>
              {apelido && <span className="text-base text-muted-foreground italic">({apelido})</span>}
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
              <Phone size={14} />
              <span>{cliente.telefone}</span>
              <button className="hover:text-foreground transition-colors" onClick={() => navigator.clipboard.writeText(cliente.telefone)}>
                <Copy size={12} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {cliente.tags.map(t => (
                <span key={t} className={
                  t === "Alto Valor" ? "badge-strong" :
                  t === "VIP" ? "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                  "badge-info"
                }>{t}</span>
              ))}
              <span className={freqColor}>{cliente.frequencia}</span>
              {cliente.ltv > 100000 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Star size={10} /> VIP
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center - Quick Metrics */}
        <div className="flex flex-wrap gap-4 lg:gap-6 items-center justify-center">
          <div className="text-center min-w-[90px]">
            <div className="font-mono text-xl font-bold text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(cliente.ltv)}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">LTV Total</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="font-mono text-lg font-semibold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(ticketMedio)}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">Ticket Médio</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-sm font-semibold text-foreground">a cada 38 dias</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">Intervalo médio</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-sm font-semibold text-green-600 dark:text-green-400">{cliente.ultimaCompra}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">Último contato</div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex flex-col gap-2 shrink-0 lg:items-end">
          <button className="btn-primary text-sm w-[180px] justify-center">
            <MessageSquare size={14} /> Iniciar conversa
          </button>
          <button className="btn-outline text-sm w-[180px] justify-center">
            <Edit2 size={14} /> Editar perfil
          </button>
          <div className="relative">
            <button
              className="btn-ghost text-sm w-[180px] justify-center"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              <MoreHorizontal size={14} /> Mais ações
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-[200px] bg-card border border-border rounded-xl shadow-lg z-50 py-1">
                  {[
                    { icon: Tag, label: "Adicionar tag" },
                    { icon: UserPlus, label: "Transferir vendedor" },
                    { icon: Star, label: "Marcar como VIP" },
                    { icon: Archive, label: "Arquivar cliente" },
                    { icon: Download, label: "Exportar histórico" },
                  ].map(item => (
                    <button key={item.label} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors cursor-pointer" onClick={() => setMoreOpen(false)}>
                      <item.icon size={14} className="text-muted-foreground" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-muted-foreground">Vendedor:</span>
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
              {cliente.vendedor.split(" ").map(w => w[0]).join("")}
            </div>
            <span className="text-xs font-medium text-foreground">{cliente.vendedor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
