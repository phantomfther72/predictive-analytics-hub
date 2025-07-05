import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, LogOut, User, RefreshCw } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export const AppNavbar: React.FC = () => {
  const { user, userRole, signOut, hasRole } = useAuth();
  const { toggleSidebar } = useSidebar();

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'analyst': return 'default';
      case 'guest': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleRefreshData = async () => {
    // Trigger data refresh - could call edge function or refetch queries
    window.location.reload();
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
            PredictivePulse
          </h1>
          <Badge variant="outline" className="text-xs">
            Intelligence Platform
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {hasRole('admin') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {user?.email ? getUserInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none truncate">
                    {user?.email}
                  </p>
                  {userRole && (
                    <Badge 
                      variant={getRoleColor(userRole.role)}
                      className="w-fit text-xs"
                    >
                      {userRole.role.charAt(0).toUpperCase() + userRole.role.slice(1)}
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={signOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};