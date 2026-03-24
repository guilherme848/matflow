import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Search, Upload, FileSpreadsheet, X, Edit2, MoreHorizontal } from "lucide-react";
import { produtos as produtosInit, type Produto } from "@/data/mockData";
import EmptyState from "@/components/shared/EmptyState";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

const categorias = [...new Set(produtosInit.map(p => p.categoria))];

export default function Catalogo() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [apenasAtivos, setApenasAtivos] = useState(false);
  const [showImport, setShowImport] = useState(true);
  const [produtosState, setProdutosState] = useState(produtosInit);
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [editForm, setEditForm] = useState<Partial<Produto>>({});
  const [novoSinonimo, setNovoSinonimo] = useState("");

  const filtered = produtosState.filter(p => {
    const matchSearch = search === "" ||
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.sinonimos.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = catFilter === "" || p.categoria === catFilter;
    const matchAtivo = !apenasAtivos || p.ativo;
    return matchSearch && matchCat && matchAtivo;
  });

  const openEdit = (p: Produto) => {
    setEditProduto(p);
    setEditForm({ ...p, sinonimos: [...p.sinonimos] });
    setNovoSinonimo("");
  };

  const saveEdit = () => {
    if (!editProduto || !editForm) return;
    setProdutosState(prev => prev.map(p => p.id === editProduto.id ? { ...p, ...editForm } as Produto : p));
    setEditProduto(null);
  };

  const toggleAtivo = (id: number) => {
    setProdutosState(prev => prev.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));
  };

  const addSinonimo = () => {
    if (!novoSinonimo.trim() || !editForm.sinonimos) return;
    setEditForm({ ...editForm, sinonimos: [...editForm.sinonimos, novoSinonimo.trim()] });
    setNovoSinonimo("");
  };

  const removeSinonimo = (idx: number) => {
    if (!editForm.sinonimos) return;
    setEditForm({ ...editForm, sinonimos: editForm.sinonimos.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Catálogo de Produtos" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6 flex-nowrap overflow-hidden">
          <span className="text-sm text-muted-foreground font-mono-kpi whitespace-nowrap shrink-0">1.847 produtos</span>
          <div className="relative flex-1 min-w-0 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="input-matflow w-full pl-9" placeholder="Buscar produto, SKU ou sinônimo..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-matflow w-44 text-sm shrink-0 hidden md:block" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">Todas as categorias</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-muted-foreground shrink-0 whitespace-nowrap cursor-pointer hidden md:flex">
            <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${apenasAtivos ? "bg-primary" : "bg-border"}`} onClick={() => setApenasAtivos(!apenasAtivos)}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${apenasAtivos ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            Apenas ativos
          </label>
          <button className="btn-outline-primary shrink-0 whitespace-nowrap hidden lg:inline-flex"><Upload size={14} /> Importar Planilha</button>
          <button className="btn-primary text-sm shrink-0 whitespace-nowrap">+ Novo Produto</button>
        </div>

        {/* Import banner */}
        {showImport && (
          <div className="mb-6 rounded-xl p-5 relative animate-card-enter" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.20)" }}>
            <button onClick={() => setShowImport(false)} className="absolute top-3 right-3 p-1 hover:bg-secondary rounded cursor-pointer"><X size={16} className="text-muted-foreground" /></button>
            <div className="flex items-start gap-3 mb-4">
              <FileSpreadsheet size={24} style={{ color: "#F97316" }} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-foreground">Importe seu catálogo via planilha</div>
                <div className="text-sm text-muted-foreground">Arraste um arquivo CSV ou XLSX ou clique para selecionar</div>
              </div>
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
              <div className="text-sm text-foreground mb-1">Arraste sua planilha aqui</div>
              <div className="text-xs text-muted-foreground mb-3">CSV ou XLSX — máximo 10MB</div>
              <button className="btn-outline-primary text-xs">Selecionar arquivo</button>
            </div>
            <div className="mt-3 text-center">
              <a href="#" className="text-[13px] font-medium hover:underline" style={{ color: "#F97316" }}>Baixar template padrão</a>
            </div>
          </div>
        )}

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="card-matflow"><EmptyState icon={Search} title="Nenhum produto encontrado" subtitle="Tente buscar por SKU ou sinônimo" /></div>
        ) : (
          <div className="card-matflow overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: 960 }}>
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "4%" }} />
                  <col style={{ width: "4%" }} />
                </colgroup>
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="label-text py-3 px-4">SKU</th>
                    <th className="label-text py-3 px-3">Produto</th>
                    <th className="label-text py-3 px-3">Categoria</th>
                    <th className="label-text py-3 px-3">Preço</th>
                    <th className="label-text py-3 px-3">Un.</th>
                    <th className="label-text py-3 px-3">Estoque</th>
                    <th className="label-text py-3 px-3">Atualizado</th>
                    <th className="label-text py-3 px-3">Status</th>
                    <th className="label-text py-3 px-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id} className="table-row-hover border-t border-border animate-card-enter" style={{ animationDelay: `${i * 30}ms`, height: 52 }}>
                      <td className="py-2 px-4 font-mono-kpi text-xs text-muted-foreground truncate">{p.sku}</td>
                      <td className="py-2 px-3 overflow-hidden">
                        <div className="font-medium text-foreground truncate">{p.nome}</div>
                        <div className="flex gap-1 mt-0.5 overflow-hidden">
                          {p.sinonimos.slice(0, 3).map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground whitespace-nowrap">{s}</span>
                          ))}
                          {p.sinonimos.length > 3 && <span className="text-[10px] text-muted-foreground">+{p.sinonimos.length - 3}</span>}
                        </div>
                      </td>
                      <td className="py-2 px-3"><span className="badge-neutral whitespace-nowrap">{p.categoria}</span></td>
                      <td className="py-2 px-3 font-mono-kpi font-bold whitespace-nowrap" style={{ color: "#F97316", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(p.preco)}</td>
                      <td className="py-2 px-3 text-muted-foreground">{p.unidade}</td>
                      <td className="py-2 px-3">
                        <span className="font-mono-kpi text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{p.estoque.toLocaleString("pt-BR")}</span>
                        {p.estoque < 100 && <span className="badge-attention ml-1.5 text-[9px] py-0 whitespace-nowrap">Estoque baixo</span>}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground truncate">{p.atualizado}</td>
                      <td className="py-2 px-3">
                        <div className={`w-8 h-[18px] rounded-full relative cursor-pointer transition-colors ${p.ativo ? "bg-primary" : "bg-border"}`} onClick={() => toggleAtivo(p.id)}>
                          <div className={`absolute top-[1px] w-4 h-4 rounded-full bg-white shadow transition-transform ${p.ativo ? "translate-x-[14px]" : "translate-x-[1px]"}`} />
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5">
                          <Edit2 size={14} className="text-muted-foreground hover:text-primary cursor-pointer" onClick={(e) => { e.stopPropagation(); openEdit(p); }} />
                          <MoreHorizontal size={14} className="text-muted-foreground hover:text-foreground cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editProduto && (
        <>
          <div className="fixed inset-0 z-40 overlay-backdrop animate-fade-page" style={{ backdropFilter: "blur(8px)" }} onClick={() => setEditProduto(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditProduto(null)}>
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-[560px] animate-modal-enter overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Editar Produto</h2>
                <button onClick={() => setEditProduto(null)} className="p-1 hover:bg-secondary rounded cursor-pointer"><X size={18} className="text-muted-foreground" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="label-text mb-1.5 block">SKU</label>
                  <input className="input-matflow w-full opacity-60" disabled value={editForm.sku || ""} />
                </div>
                <div>
                  <label className="label-text mb-1.5 block">Nome</label>
                  <input className="input-matflow w-full" value={editForm.nome || ""} onChange={e => setEditForm({ ...editForm, nome: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text mb-1.5 block">Preço</label>
                    <input className="input-matflow w-full" type="number" step="0.01" value={editForm.preco ?? ""} onChange={e => setEditForm({ ...editForm, preco: parseFloat(e.target.value) })} />
                  </div>
                  <div>
                    <label className="label-text mb-1.5 block">Unidade</label>
                    <input className="input-matflow w-full" value={editForm.unidade || ""} onChange={e => setEditForm({ ...editForm, unidade: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label-text mb-1.5 block">Categoria</label>
                  <select className="input-matflow w-full" value={editForm.categoria || ""} onChange={e => setEditForm({ ...editForm, categoria: e.target.value })}>
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text mb-1.5 block">Sinônimos</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {editForm.sinonimos?.map((s, i) => (
                      <span key={i} className="badge-neutral flex items-center gap-1">
                        {s}
                        <X size={12} className="cursor-pointer hover:text-destructive" onClick={() => removeSinonimo(i)} />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input className="input-matflow flex-1 min-w-0" placeholder="Ex: cano grosso de esgoto" value={novoSinonimo} onChange={e => setNovoSinonimo(e.target.value)} onKeyDown={e => e.key === "Enter" && addSinonimo()} />
                    <button onClick={addSinonimo} className="btn-outline-primary shrink-0">Adicionar</button>
                  </div>
                  <p className="text-[13px] text-muted-foreground mt-1.5">Sinônimos ajudam a IA a encontrar este produto com qualquer nome que o cliente usar</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="label-text">Ativo</label>
                  <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${editForm.ativo ? "bg-primary" : "bg-border"}`} onClick={() => setEditForm({ ...editForm, ativo: !editForm.ativo })}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${editForm.ativo ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3">
                <button onClick={() => setEditProduto(null)} className="h-10 px-4 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer">Cancelar</button>
                <button onClick={saveEdit} className="btn-primary text-sm">Salvar alterações</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
