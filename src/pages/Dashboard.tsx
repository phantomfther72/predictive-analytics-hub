
import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { Toaster } from "@/components/ui/toaster";

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <DndContext collisionDetection={closestCenter}>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full bg-slate-50 dark:bg-slate-900">
          <DashboardHeader />
          <div className="flex flex-1 flex-col md:flex-row min-w-0">
            <DashboardSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <div className={cn(
                "flex-1 py-3 sm:py-4 md:py-6 mobile-transition",
                isMobile ? "px-3 sm:px-4" : "container"
              )}>
                <DashboardContent />
              </div>
            </main>
          </div>
          <Toaster />
        </div>
      </SidebarProvider>
    </DndContext>
  );
};

export default Dashboard;
