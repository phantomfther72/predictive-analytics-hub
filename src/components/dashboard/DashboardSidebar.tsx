
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, LineChart, Table, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

export const DashboardSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isOpen, close } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) {
      close();
    }
  };

  return (
    <Sidebar defaultCollapsed={isMobile}>
      <SidebarContent>
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
      </SidebarContent>
    </Sidebar>
  );
};
