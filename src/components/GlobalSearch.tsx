import { useState, useEffect, useRef, useCallback } from "react";
import { Search, User, MessageSquare, Package, LayoutGrid, X, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { produtos } from "@/data/mockData";

interface SearchResult {
  type: "cliente" | "conversa" | "produto" | "deal";
  id: string;
  title: string;
  subtitle: string;
  extra?: string;
}

function fmt(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }); }

const sectionIcons = { cliente: User, conversa: MessageSquare, produto: Package, deal: LayoutGrid };
const sectionLabels = { cliente: "Clientes", conversa: "Conversas", produto: "Produtos", deal: "Deals" };
const quickSuggestions = ["João Silva", "Cimento CP-II", "Orçamentos abertos", "Leads hoje"];

export default function GlobalSearch() {
  const { contacts, conversations, deals, getContact, setActiveConversationId, setPipelineHighlightDealId } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const searchAll = useCallback((q: string): SearchResult[] => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    const results: SearchResult[] = [];
    contacts.filter(c => c.nome.toLowerCase().includes(lower) || c.telefone.includes(lower))
      .slice(0, 3).forEach(c => results.push({ type: "cliente", id: c.id, title: c.nome, subtitle: c.telefone, extra: fmt(c.ltv) }));
    conversations.filter(c => { const ct = getContact(c.contact_id); return ct?.nome.toLowerCase().includes(lower) || c.ultima_mensagem.toLowerCase().includes(lower); })
      .slice(0, 3).forEach(c => { const ct = getContact(c.contact_id); results.push({ type: "conversa", id: c.id, title: ct?.nome || "", subtitle: c.ultima_mensagem, extra: c.ultima_mensagem_hora }); });
    produtos.filter(p => p.nome.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower) || p.sinonimos.some(s => s.toLowerCase().includes(lower)))
      .slice(0, 3).forEach(p => results.push({ type: "produto", id: String(p.id), title: p.nome, subtitle: p.sku, extra: fmt(p.preco) }));
    deals.filter(d => { const ct = getContact(d.contact_id); return ct?.nome.toLowerCase().includes(lower) || d.produto_principal.toLowerCase().includes(lower); })
      .slice(0, 2).forEach(d => { const ct = getContact(d.contact_id); results.push({ type: "deal", id: d.id, title: ct?.nome || "", subtitle: d.produto_principal, extra: fmt(d.valor) }); });
    return results;
  }, [contacts, conversations, deals, getContact]);

  const results = searchAll(query);
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => { (acc[r.type] = acc[r.type] || []).push(r); return acc; }, {});

  const handleOpen = useCallback(() => { setOpen(true); setQuery(""); setFocusIndex(-1); }, []);
  const handleClose = useCallback(() => { setOpen(false); setQuery(""); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); handleOpen(); }
      if (e.key === "Escape" && open) handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleOpen, handleClose]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const handleSelect = (result: SearchResult) => {
    handleClose();
    switch (result.type) {
      case "cliente": navigate(`/clientes/${result.id}`); break;
      case "conversa": setActiveConversationId(result.id); navigate('/conversas'); break;
      case "deal": setPipelineHighlightDealId(result.id); navigate('/pipeline'); break;
      case "produto": navigate('/catalogo'); break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setFocusIndex(i => Math.max(i - 1, -1)); }
    if (e.key === "Enter" && focusIndex >= 0 && results[focusIndex]) handleSelect(results[focusIndex]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" style={{ background: "var(--overlay)", backdropFilter: "blur(4px)" }} onClick={handleClose}>
      <div className="bg-card rounded-2xl border border-border w-full max-w-[600px] mx-4 overflow-hidden animate-modal-enter" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 h-[52px] border-b border-border">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setFocusIndex(-1); }} onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground text-base placeholder:text-muted-foreground outline-none" placeholder="Buscar clientes, conversas, produtos..." />
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={16} /></button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="p-5">
              <div className="text-xs text-muted-foreground mb-3">Sugestões rápidas</div>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="px-3 py-1.5 text-sm rounded-lg bg-secondary text-foreground hover:bg-primary/10 cursor-pointer transition-colors">{s}</button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <SearchX size={32} className="text-muted-foreground mx-auto mb-2" />
              <div className="text-sm text-foreground font-medium">Nenhum resultado para "{query}"</div>
              <div className="text-xs text-muted-foreground mt-1">Tente buscar por telefone, SKU ou nome</div>
            </div>
          ) : (
            Object.entries(grouped).map(([type, items]) => {
              const Icon = sectionIcons[type as keyof typeof sectionIcons];
              return (
                <div key={type}>
                  <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Icon size={14} /> {sectionLabels[type as keyof typeof sectionLabels]}
                  </div>
                  {items.map(item => {
                    const idx = results.indexOf(item);
                    return (
                      <button key={`${type}-${item.id}`} onClick={() => handleSelect(item)}
                        className={`w-full text-left px-5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${idx === focusIndex ? "bg-secondary border-l-2 border-primary" : "hover:bg-secondary border-l-2 border-transparent"}`}>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground truncate">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                        </div>
                        {item.extra && <span className="font-mono text-sm font-bold text-primary shrink-0 whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>{item.extra}</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
        <div className="px-5 py-2.5 border-t border-border">
          <span className="text-[11px] text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono text-[10px]">↑↓</kbd> navegar ·{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono text-[10px]">Enter</kbd> selecionar ·{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono text-[10px]">Esc</kbd> fechar
          </span>
        </div>
      </div>
    </div>
  );
}
