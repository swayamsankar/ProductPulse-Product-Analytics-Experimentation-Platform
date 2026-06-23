import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen md:flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
