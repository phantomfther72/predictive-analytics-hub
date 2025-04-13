
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent as SidebarContentWrapper,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  LineChart, 
  Table, 
  User, 
  X, 
  Home, 
  ChevronRight,
  Briefcase
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Interactive Charts",
    icon: LineChart,
    path: "/dashboard/charts",
  },
  {
    title: "Data Tables",
    icon: Table,
    path: "/dashboard/tables",
  },
  {
    title: "Investment Opportunities",
    icon: Briefcase,
    path: "/dashboard/opportunities",
  },
  {
    title: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },
];

const SidebarContentComponent = () => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {isMobile && (
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b">
          <div className="font-display font-semibold text-slate-900 dark:text-white">
            <span className="bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
              Predictive Pulse
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(false)}
            aria-label="Close mobile menu"
            className="touch-target mobile-interactive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={handleNavigate}
              >
                <Link to="/" className={cn(
                  "flex items-center gap-2 mobile-menu-item", 
                  "touch-feedback focus-visible-ring"
                )}>
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                  {isMobile && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  onClick={handleNavigate}
                >
                  <Link to={item.path} className={cn(
                    "flex items-center gap-2 mobile-menu-item",
                    "touch-feedback focus-visible-ring",
                    isMobile && "justify-between"
                  )}>
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    {isMobile && <ChevronRight className="h-4 w-4" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

export const DashboardSidebar = () => {
  const isMobile = useIsMobile();
  const { openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[280px] p-0 border-r shadow-lg">
          <SidebarContentComponent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar className="hidden md:flex border-r shadow-sm">
      <SidebarContentWrapper>
        <SidebarContentComponent />
      </SidebarContentWrapper>
    </Sidebar>
  );
};
