import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
import { Bell, Settings, LogOut, User, RefreshCw, Code, Terminal } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useDevModeShortcut } from '@/hooks/useDevModeShortcut';

export const AppNavbar: React.FC = () => {
  const { user, userRole, signOut, hasRole } = useAuth();
  const { toggleSidebar } = useSidebar();
  const { isDevMode, toggleDevMode } = useDemoMode();
  const navigate = useNavigate();
  
  // Activate dev mode shortcut
  useDevModeShortcut();

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
          <h1 
            className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/')}
          >
            PredictivePulse
          </h1>
          <Badge variant="outline" className="text-xs">
            Intelligence Platform
          </Badge>
          {isDevMode && (
            <Badge variant="outline" className="text-xs bg-terminal-orange/10 text-terminal-orange border-terminal-orange/30">
              <Code className="h-3 w-3 mr-1" />
              Dev Mode
            </Badge>
          )}
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

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/terminal')}
            className="gap-2"
          >
            <Terminal className="h-4 w-4" />
            Terminal
          </Button>
          
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
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Dev Mode {!isDevMode && <span className="text-xs text-muted-foreground">(Ctrl+Alt+D)</span>}
                </span>
                <Switch 
                  checked={isDevMode} 
                  onCheckedChange={toggleDevMode}
                />
              </div>
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