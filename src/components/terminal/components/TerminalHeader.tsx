import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Command, 
  Search, 
  Settings, 
  User, 
  LogOut,
  Terminal as TerminalIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const TerminalHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="border-b" style={{ 
      borderColor: 'hsl(var(--terminal-border))',
      background: 'hsl(var(--terminal-card))'
    }}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg" style={{ 
                background: 'linear-gradient(45deg, hsl(var(--pulse-orange)), hsl(var(--electric-blue)))'
              }}>
                <TerminalIcon className="h-5 w-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'hsl(var(--terminal-text-bright))' }}>
                  PredictivePulse Terminal
                </h1>
                <p className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                  InsightOS - Command Center for African Markets
                </p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="border-[hsl(var(--electric-blue))] text-[hsl(var(--electric-blue))]"
            >
              PRO
            </Badge>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ 
                color: 'hsl(var(--terminal-text-dim))' 
              }} />
              <input
                type="text"
                placeholder="Search markets, insights..."
                className="pl-10 pr-4 py-2 rounded-lg border bg-transparent text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--pulse-orange))]"
                style={{ 
                  borderColor: 'hsl(var(--terminal-border))',
                  color: 'hsl(var(--terminal-text))'
                }}
              />
            </div>

            {/* Command Palette */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-[hsl(var(--terminal-border))]"
            >
              <Command className="h-4 w-4" style={{ color: 'hsl(var(--terminal-text-dim))' }} />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1 hover:bg-[hsl(var(--terminal-border))]">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[hsl(var(--pulse-orange))] text-black text-sm">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 border bg-[hsl(var(--terminal-card))] border-[hsl(var(--terminal-border))]"
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium" style={{ color: 'hsl(var(--terminal-text))' }}>
                    {user?.email}
                  </p>
                  <p className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                    Pro Terminal Access
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-[hsl(var(--terminal-border))]" />
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="hover:bg-[hsl(var(--terminal-border))]"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-[hsl(var(--terminal-border))]"
                >
                  <User className="mr-2 h-4 w-4" />
                  Standard Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[hsl(var(--terminal-border))]" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="hover:bg-[hsl(var(--terminal-border))] text-[hsl(var(--terminal-error))]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};