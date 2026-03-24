import { useState, useEffect } from "react";
import { WifiOff, CheckCircle, Loader2, X } from "lucide-react";

type Status = "connected" | "disconnected" | "connecting";

export default function WhatsAppBanner() {
  const [status, setStatus] = useState<Status>("connected");
  const [dismissed, setDismissed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReconnect = () => {
    setStatus("connecting");
    setTimeout(() => {
      setStatus("connected");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  // Expose for testing from Configurações
  useEffect(() => {
    const handler = () => { setStatus("disconnected"); setDismissed(false); };
    window.addEventListener("matflow-whatsapp-disconnect", handler);
    return () => window.removeEventListener("matflow-whatsapp-disconnect", handler);
  }, []);

  if (status === "connected" && !showSuccess) return null;
  if (dismissed && status === "disconnected") return null;

  return (
    <div className={`shrink-0 px-4 md:px-8 py-2.5 flex items-center gap-3 text-sm transition-all ${
      status === "disconnected" ? "border-b" : status === "connecting" ? "border-b" : ""
    }`} style={{
      background: status === "disconnected" ? "rgba(239,68,68,0.08)" : status === "connecting" ? "rgba(234,179,8,0.08)" : "rgba(15,118,110,0.08)",
      borderColor: status === "disconnected" ? "rgba(239,68,68,0.20)" : status === "connecting" ? "rgba(234,179,8,0.20)" : "rgba(15,118,110,0.20)",
    }}>
      {status === "disconnected" && (
        <>
          <WifiOff size={16} className="text-destructive shrink-0" />
          <span className="text-foreground flex-1">WhatsApp desconectado — novos leads não estão sendo recebidos</span>
          <button onClick={handleReconnect} className="text-xs font-semibold px-3 py-1 rounded-lg text-white shrink-0 cursor-pointer" style={{ background: "hsl(var(--destructive))" }}>Reconectar agora</button>
          <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0"><X size={14} /></button>
        </>
      )}
      {status === "connecting" && (
        <>
          <Loader2 size={16} className="text-primary animate-spin shrink-0" />
          <span className="text-foreground">Reconectando ao WhatsApp...</span>
        </>
      )}
      {showSuccess && (
        <>
          <CheckCircle size={16} className="text-success shrink-0" />
          <span className="text-foreground">WhatsApp reconectado com sucesso!</span>
        </>
      )}
    </div>
  );
}
