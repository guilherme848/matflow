import { useState } from "react";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

export default function ExportModal() {
  const [open, setOpen] = useState(false);
  const [periodo, setPeriodo] = useState("este_mes");
  const [formato, setFormato] = useState("pdf");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const checks = [
    { label: "Resumo executivo", checked: true },
    { label: "Performance por vendedor", checked: true },
    { label: "Leads e conversão", checked: true },
    { label: "Produtos mais orçados", checked: true },
    { label: "LTV por canal", checked: true },
    { label: "Histórico de conversas (pesado)", checked: false },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setGenerating(false); setOpen(false); toast.success("✓ Relatório baixado"); return 100; }
        return p + 20;
      });
    }, 300);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-outline-primary text-sm flex items-center gap-1.5 shrink-0">
        <Download size={14} /> Exportar
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--overlay)" }} onClick={() => !generating && setOpen(false)}>
          <div className="bg-card rounded-2xl border border-border max-w-[440px] w-full mx-4 animate-modal-enter" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <span className="font-semibold text-foreground">Exportar Relatório</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {generating ? (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <div className="text-sm text-foreground">Gerando relatório... {Math.min(progress, 100)}%</div>
                  <div className="h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-2">Período</div>
                    {["este_mes", "mes_anterior", "30_dias"].map(p => (
                      <label key={p} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <input type="radio" name="periodo" checked={periodo === p} onChange={() => setPeriodo(p)} className="accent-primary" />
                        <span className="text-sm text-foreground">{p === "este_mes" ? "Este mês" : p === "mes_anterior" ? "Mês anterior" : "Últimos 30 dias"}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-2">Conteúdo</div>
                    {checks.map(c => (
                      <label key={c.label} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked={c.checked} className="accent-primary" />
                        <span className="text-sm text-foreground">{c.label}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-2">Formato</div>
                    {["pdf", "excel"].map(f => (
                      <label key={f} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <input type="radio" name="formato" checked={formato === f} onChange={() => setFormato(f)} className="accent-primary" />
                        <span className="text-sm text-foreground">{f === "pdf" ? "PDF" : "Excel"}</span>
                      </label>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2 font-mono">MatFlow_Relatorio_Novembro_2024.{formato === "pdf" ? "pdf" : "xlsx"}</div>
                  <button onClick={handleGenerate} className="btn-primary w-full">Gerar relatório</button>
                  <div className="text-xs text-muted-foreground text-center">O arquivo será gerado e baixado automaticamente</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
