import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Building2, 
  Pickaxe, 
  Wheat, 
  Droplets, 
  DollarSign,
  Stethoscope,
  TrendingUp,
  Settings,
  MessageSquare,
  Target,
  Landmark,
  GraduationCap,
  Wrench
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    roles: ['admin', 'analyst', 'guest']
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
    roles: ['admin', 'analyst']
  },
  {
    title: 'Predictions',
    url: '/dashboard/predictions',
    icon: TrendingUp,
    roles: ['admin', 'analyst', 'guest']
  },
  {
    title: 'Industries',
    url: '/dashboard/industries',
    icon: Target,
    roles: ['admin', 'analyst', 'guest']
  }
];

const industryItems = [
  {
    title: 'Mining',
    url: '/mining-market',
    icon: Pickaxe,
    color: 'text-orange-500'
  },
  {
    title: 'Housing',
    url: '/housing-market',
    icon: Building2,
    color: 'text-blue-500'
  },
  {
    title: 'Agriculture',
    url: '/agriculture-market',
    icon: Wheat,
    color: 'text-green-500'
  },
  {
    title: 'Green Hydrogen',
    url: '/green-hydrogen-market',
    icon: Droplets,
    color: 'text-teal-500'
  },
  {
    title: 'Financial',
    url: '/financial-market',
    icon: DollarSign,
    color: 'text-emerald-500'
  },
  {
    title: 'Medical',
    url: '/medical-market',
    icon: Stethoscope,
    color: 'text-purple-500'
  },
  {
    title: 'Tourism',
    url: '/tourism',
    icon: Landmark,
    color: 'text-pink-500'
  },
  {
    title: 'Education',
    url: '/education',
    icon: GraduationCap,
    color: 'text-indigo-500'
  },
  {
    title: 'Infrastructure',
    url: '/infrastructure',
    icon: Wrench,
    color: 'text-slate-500'
  }
];

const bottomItems = [
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    roles: ['admin', 'analyst', 'guest']
  },
  {
    title: 'Feedback',
    url: '/dashboard/feedback',
    icon: MessageSquare,
    roles: ['admin', 'analyst', 'guest']
  }
];

export const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { userRole, hasRole } = useAuth();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'analyst': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'guest': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.some(role => hasRole(role as 'admin' | 'analyst' | 'guest'))
  );

  const filteredBottomItems = bottomItems.filter(item => 
    item.roles.some(role => hasRole(role as 'admin' | 'analyst' | 'guest'))
  );

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-variant rounded-lg flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-foreground">PredictivePulse</span>
                {userRole && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs w-fit ${getRoleColor(userRole.role)}`}
                  >
                    {userRole.role}
                  </Badge>
                )}
              </div>
            )}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const active = isActive(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          active 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && 'Industries'}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {industryItems.map((item) => {
                const active = isActive(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          active 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${!active ? item.color : ''}`} />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredBottomItems.map((item) => {
                const active = isActive(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          active 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};