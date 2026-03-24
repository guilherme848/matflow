import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import BottomNav from "./BottomNav";
import GlobalSearch from "@/components/GlobalSearch";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import { useKeyboardShortcuts, ShortcutsModal } from "@/components/KeyboardShortcuts";

export default function AppLayout() {
  const { showHelp, setShowHelp } = useKeyboardShortcuts();

  return (
    <div className="flex w-full h-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden pb-14 md:pb-0">
        <WhatsAppBanner />
        <Outlet />
      </div>
      <BottomNav />
      <GlobalSearch />
      {showHelp && <ShortcutsModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
