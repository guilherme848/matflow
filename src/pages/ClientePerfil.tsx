import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";
import { clientes } from "@/data/mockData";
import ProfileHeader from "@/components/cliente-perfil/ProfileHeader";
import TabVisaoGeral from "@/components/cliente-perfil/TabVisaoGeral";
import TabObras from "@/components/cliente-perfil/TabObras";
import TabFinanceiro from "@/components/cliente-perfil/TabFinanceiro";
import TabConversas from "@/components/cliente-perfil/TabConversas";
import TabCompras from "@/components/cliente-perfil/TabCompras";
import TabPreferencias from "@/components/cliente-perfil/TabPreferencias";
import TabHistorico from "@/components/cliente-perfil/TabHistorico";
import { useState, useEffect } from "react";

const tabs = [
  { key: "geral", label: "Visão Geral" },
  { key: "obras", label: "Obras & Projetos" },
  { key: "financeiro", label: "Financeiro" },
  { key: "conversas", label: "Conversas", count: 23 },
  { key: "compras", label: "Compras", count: 5 },
  { key: "preferencias", label: "Preferências" },
  { key: "historico", label: "Histórico" },
];

export default function ClientePerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "geral");

  useEffect(() => {
    if (tabParam && tabs.some(t => t.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const cliente = clientes.find(c => c.id === Number(id)) || clientes[0];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchParams(key === "geral" ? {} : { tab: key });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Perfil do Cliente" />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="p-6 lg:px-8 lg:py-6 max-w-[1400px] mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate("/clientes")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para Clientes
          </button>

          {/* Header Card */}
          <ProfileHeader cliente={cliente} />

          {/* Tabs */}
          <div className="sticky top-0 z-10 bg-background mt-6 -mx-6 lg:-mx-8 px-6 lg:px-8 border-b border-border">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-1.5 text-[11px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "geral" && <TabVisaoGeral cliente={cliente} />}
            {activeTab === "obras" && <TabObras />}
            {activeTab === "financeiro" && <TabFinanceiro />}
            {activeTab === "conversas" && <TabConversas />}
            {activeTab === "compras" && <TabCompras />}
            {activeTab === "preferencias" && <TabPreferencias />}
            {activeTab === "historico" && <TabHistorico />}
          </div>
        </div>
      </div>
    </div>
  );
}
