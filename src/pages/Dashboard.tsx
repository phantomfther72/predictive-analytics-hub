
import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-slate-50">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row min-w-0">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col min-w-0">
            <div className={cn(
              "flex-1 py-4 sm:py-6 mobile-transition",
              isMobile ? "px-4" : "container"
            )}>
              <DashboardContent />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
