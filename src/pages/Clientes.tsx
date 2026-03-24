import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, MessageSquare, Eye, MoreHorizontal, X, LayoutGrid } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/shared/EmptyState";

function fmt(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }); }
function getAvatarColor(name: string) {
  const colors = ["#6366F1", "#0F766E", "#F97316", "#EAB308", "#EF4444"];
  return colors[name.charCodeAt(0) % 5];
}
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }

const freqBadge: Record<string, string> = { recorrente: "badge-success", alto_valor: "badge-orange", esporadico: "badge-neutral", inativo: "badge-danger", novo: "badge-info" };
const freqLabel: Record<string, string> = { recorrente: "Recorrente", alto_valor: "Alto Valor", esporadico: "Esporádico", inativo: "Inativo", novo: "Novo" };
const canalBadge: Record<string, string> = { "Meta Ads": "badge-info", WhatsApp: "badge-success", Indicação: "badge-orange", Instagram: "badge-info", Balcão: "badge-neutral" };

export default function Clientes() {
  const { contacts, conversations, deals, users, setActiveConversationId, setPipelineHighlightDealId, getConversationForContact, getDealsForContact } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = contacts.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.telefone.includes(search) ||
    c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const openConversation = (contactId: string) => {
    const conv = getConversationForContact(contactId);
    if (conv) {
      setActiveConversationId(conv.id);
      navigate('/conversas');
    }
  };

  const openPipeline = (contactId: string) => {
    const contactDeals = getDealsForContact(contactId).filter(d => !d.status.startsWith("fechado"));
    if (contactDeals.length > 0) {
      setPipelineHighlightDealId(contactDeals[0].id);
      navigate('/pipeline');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Clientes" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" style={{ padding: "24px 32px" }}>
        <div className="flex items-center gap-3 mb-6 flex-nowrap overflow-hidden">
          <span className="text-xs text-muted-foreground font-mono whitespace-nowrap shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>{contacts.length} contatos</span>
          <div className="relative flex-1 min-w-0 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="input-matflow w-full pl-9" placeholder="Buscar por nome, telefone ou tag..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn-primary text-sm shrink-0 whitespace-nowrap">+ Novo Cliente</button>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8">
            <EmptyState icon={Search} title="Nenhum cliente encontrado" subtitle="Tente buscar por telefone ou nome" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 900 }}>
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "4%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-0 px-4 text-left bg-secondary" style={{ height: 36, borderRadius: "8px 0 0 0" }}>Cliente</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Telefone</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Canal</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>LTV Total</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Última Compra</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Frequência</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-0 px-3 text-left bg-secondary" style={{ height: 36 }}>Vendedor</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-0 px-3 text-left bg-secondary" style={{ height: 36, borderRadius: "0 8px 0 0" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const vendedor = users.find(u => u.id === c.vendedor_id);
                    const hasActiveConv = conversations.some(cv => cv.contact_id === c.id && cv.status !== "fechada" && cv.nao_lidas > 0);
                    return (
                      <tr key={c.id}
                        onClick={() => navigate(`/clientes/${c.id}`)}
                        className="border-t border-border cursor-pointer group hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-colors"
                        style={{ height: 48 }}>
                        <td className="py-0 px-4 overflow-hidden">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative shrink-0">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: getAvatarColor(c.nome) }}>{getInitials(c.nome)}</div>
                              {hasActiveConv && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground flex items-center gap-1.5 overflow-hidden">
                                <span className="truncate">{c.nome}</span>
                                {c.ltv >= 100000 && <span className="badge-orange text-[9px] py-0 shrink-0">VIP</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-0 px-3 font-mono text-xs text-foreground whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontVariantNumeric: "tabular-nums" }}>{c.telefone}</td>
                        <td className="py-0 px-3 overflow-hidden"><span className={`${canalBadge[c.canal_origem] || "badge-neutral"} text-[10px]`}>{c.canal_origem}</span></td>
                        <td className="py-0 px-3 font-mono font-bold text-foreground whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(c.ltv)}</td>
                        <td className="py-0 px-3 text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis text-xs">{c.ultima_compra}</td>
                        <td className="py-0 px-3 overflow-hidden"><span className={`${freqBadge[c.plano] || "badge-neutral"} text-[10px]`}>{freqLabel[c.plano] || c.plano}</span></td>
                        <td className="py-0 px-3 text-muted-foreground truncate overflow-hidden text-xs">{vendedor?.nome.split(" ").map((w,i) => i === 0 ? w : w[0] + ".").join(" ")}</td>
                        <td className="py-0 px-3">
                          <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); openConversation(c.id); }} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                              <MessageSquare size={14} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); openPipeline(c.id); }} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                              <LayoutGrid size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
