import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const shortcuts = [
  { keys: ["⌘", "K"], desc: "Busca global" },
  { keys: ["⌘", "N"], desc: "Nova conversa" },
  { keys: ["Esc"], desc: "Fechar modal / dropdown" },
  { keys: ["G", "C"], desc: "Ir para Conversas" },
  { keys: ["G", "P"], desc: "Ir para Pipeline" },
  { keys: ["G", "L"], desc: "Ir para Clientes" },
  { keys: ["G", "D"], desc: "Ir para Dashboard" },
];

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [gPressed, setGPressed] = useState(false);

  useEffect(() => {
    let gTimeout: ReturnType<typeof setTimeout>;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (e.key === "?" && !isInput) { e.preventDefault(); setShowHelp(v => !v); return; }

      if (!isInput && e.key === "g") {
        setGPressed(true);
        gTimeout = setTimeout(() => setGPressed(false), 800);
        return;
      }

      if (gPressed && !isInput) {
        setGPressed(false);
        clearTimeout(gTimeout);
        if (e.key === "c") { e.preventDefault(); navigate("/conversas"); }
        if (e.key === "p") { e.preventDefault(); navigate("/pipeline"); }
        if (e.key === "l") { e.preventDefault(); navigate("/clientes"); }
        if (e.key === "d") { e.preventDefault(); navigate("/dashboard"); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => { window.removeEventListener("keydown", handler); clearTimeout(gTimeout); };
  }, [navigate, gPressed]);

  return { showHelp, setShowHelp };
}

export function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--overlay)" }} onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border max-w-[480px] w-full mx-4 animate-modal-enter" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">Atalhos de teclado</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-5">
          <table className="w-full text-sm">
            <tbody>
              {shortcuts.map((s, i) => (
                <tr key={i} className={i > 0 ? "border-t border-border" : ""}>
                  <td className="py-2.5 flex gap-1">
                    {s.keys.map(k => (
                      <kbd key={k} className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono text-[11px] text-muted-foreground">{k}</kbd>
                    ))}
                  </td>
                  <td className="py-2.5 text-muted-foreground">{s.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
