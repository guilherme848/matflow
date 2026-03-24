import { ExternalLink, MessageSquare } from "lucide-react";
import { conversasCliente } from "@/data/clientePerfilData";
import { useState } from "react";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

const badgeMap: Record<string, string> = {
  "Fechou deal": "badge-success",
  "Bot transferiu": "badge-orange",
  "Follow-up": "badge-warning",
  "Primeiro contato": "badge-info",
  "Sem resolução": "badge-danger",
};

export default function TabConversas() {
  const [filtro, setFiltro] = useState("Todas");
  const filtros = ["Todas", "WhatsApp", "Com IA", "Com vendedor"];

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {filtros.map(f => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              filtro === f ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {conversasCliente.map(conv => (
          <div key={conv.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{conv.data} · {conv.hora}</span>
                <span className="text-xs text-muted-foreground">{conv.duracao}</span>
                <span className="badge-neutral text-[10px]">WhatsApp</span>
              </div>
              <button className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
                <ExternalLink size={11} /> Abrir conversa
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">Atendido por {conv.vendedor}</span>
              <span className={badgeMap[conv.badge] || "badge-neutral"}>
                {conv.badge}{conv.badgeValor ? ` ${fmt(conv.badgeValor)}` : ""}
              </span>
            </div>

            <div className="space-y-1 mb-2">
              {conv.mensagens.map((msg, i) => (
                <div key={i} className="text-[13px] text-muted-foreground truncate">
                  <span className="text-foreground font-medium">{i === 0 ? "Cliente:" : "Vendedor:"}</span> {msg}
                </div>
              ))}
            </div>

            {conv.produtos.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {conv.produtos.map(p => (
                  <span key={p} className="badge-neutral text-[10px] cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">{p}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button className="text-sm text-primary hover:underline cursor-pointer">Carregar mais conversas →</button>
      </div>
    </div>
  );
}
