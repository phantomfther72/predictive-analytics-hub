
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
import { LayoutDashboard, LineChart, Table, User, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
        <div className="flex items-center justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(false)}
            aria-label="Close mobile menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  onClick={handleNavigate}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
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
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContentComponent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar>
      <SidebarContentWrapper>
        <SidebarContentComponent />
      </SidebarContentWrapper>
    </Sidebar>
  );
};
