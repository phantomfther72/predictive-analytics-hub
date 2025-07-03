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

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: '📊',
    roles: ['admin', 'analyst', 'guest']
  },
  {
    title: 'Industries',
    url: '/dashboard/industries',
    icon: '🏭',
    roles: ['admin', 'analyst', 'guest']
  },
  {
    title: 'Predictions',
    url: '/dashboard/predictions',
    icon: '🔮',
    roles: ['admin', 'analyst', 'guest']
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: '📈',
    roles: ['admin', 'analyst']
  },
  {
    title: 'Admin Panel',
    url: '/dashboard/admin',
    icon: '⚙️',
    roles: ['admin']
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: '🔧',
    roles: ['admin', 'analyst', 'guest']
  }
];

export const DashboardSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { userRole, hasRole } = useAuth();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'analyst': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'guest': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.some(role => hasRole(role as 'admin' | 'analyst' | 'guest'))
  );

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">PredictivePulse</span>
            {!collapsed && userRole && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getRoleColor(userRole.role)}`}
              >
                {userRole.role}
              </Badge>
            )}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {!collapsed && <span>{item.title}</span>}
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