import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  BarChart3, 
  Table, 
  Target, 
  Terminal,
  Building2,
  Pickaxe,
  Wheat,
  Droplets,
  DollarSign,
  Briefcase,
  Globe,
  Zap,
  TrendingUp,
  Settings
} from 'lucide-react';

const mainMenuItems = [
  { icon: Home, label: "Overview", path: "/dashboard", roles: ['guest', 'pro', 'investor', 'admin'] },
  { icon: BarChart3, label: "Charts", path: "/dashboard/charts", roles: ['guest', 'pro', 'investor', 'admin'] },
  { icon: Table, label: "Tables", path: "/dashboard/tables", roles: ['guest', 'pro', 'investor', 'admin'] },
  { icon: Briefcase, label: "Opportunities", path: "/opportunities", roles: ['guest', 'pro', 'investor', 'admin'] },
  { 
    icon: Terminal, 
    label: "Terminal", 
    path: "/terminal",
    roles: ['pro', 'investor', 'admin'],
    isPremium: true,
    description: "InsightOS Command Center"
  },
  { 
    icon: Globe, 
    label: "Global Equity", 
    path: "/global-equity",
    roles: ['guest', 'pro', 'investor', 'admin'],
    isNew: true,
    description: "AI-powered global markets"
  },
];

const industryItems = [
  { icon: TrendingUp, label: "Financial", path: "/financial-market", roles: ['guest', 'pro', 'investor', 'admin'] },
  { icon: Building2, label: "Housing", path: "/housing-market", roles: ['guest', 'pro', 'investor', 'admin'] },
  { icon: Pickaxe, label: "Mining", path: "/mining-market", roles: ['guest', 'pro', 'investor', 'admin'] },
  { icon: Wheat, label: "Agriculture", path: "/agriculture-market", roles: ['guest', 'pro', 'investor', 'admin'] },
  { icon: Droplets, label: "Green Hydrogen", path: "/green-hydrogen-market", roles: ['guest', 'pro', 'investor', 'admin'] },
];

export const DashboardSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { userRole, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'investor': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'guest': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  const hasAccessToItem = (item: any) => {
    // Check if user has any of the required roles
    if (!userRole) return false;
    return item.roles.includes(userRole.role);
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-variant rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg cursor-pointer" onClick={() => navigate('/')}>
                PredictivePulse
              </h2>
              <p className="text-xs text-muted-foreground">Intelligence Platform</p>
            </div>
          )}
        </div>

        {/* User Role Badge */}
        {!collapsed && userRole && (
          <div className="mb-6">
            <Badge className={getRoleColor(userRole.role)}>
              {userRole.role.toUpperCase()}
            </Badge>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.filter(hasAccessToItem).map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span>{item.label}</span>
                          <div className="flex gap-1">
                            {item.isNew && (
                              <Badge variant="secondary" className="text-xs">NEW</Badge>
                            )}
                            {item.isPremium && (
                              <Badge variant="outline" className="text-xs bg-terminal-orange/10 text-terminal-orange border-terminal-orange/30">
                                PRO
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Industry Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Industries</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {industryItems.filter(hasAccessToItem).map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/global-equity"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Zap className="h-4 w-4" />
                    {!collapsed && <span>Create Fund</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/opportunities"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <DollarSign className="h-4 w-4" />
                    {!collapsed && <span>View Opportunities</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    {!collapsed && <span>Settings</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};