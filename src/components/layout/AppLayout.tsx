import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

export default function AppLayout() {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
