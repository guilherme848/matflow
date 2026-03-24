import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

export default function AppLayout() {
  return (
    <div className="flex w-full h-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
