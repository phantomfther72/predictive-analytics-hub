import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from '@/hooks/useDemoMode';

interface RoleGateProps {
  children: React.ReactNode;
  requiredRole?: 'guest' | 'pro' | 'investor' | 'admin';
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ 
  children, 
  requiredRole = 'pro',
  fallback 
}) => {
  const { user } = useAuth();
  const { isDevMode } = useDemoMode();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const hasAccess = () => {
    // Dev mode bypasses all role checks
    if (isDevMode) return true;
    
    if (!profile) return false;
    
    const roleHierarchy = {
      guest: 0,
      pro: 1,
      investor: 2,
      admin: 3
    };
    
    const userLevel = roleHierarchy[profile.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole];
    
    return userLevel >= requiredLevel;
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Please sign in to access this feature.
          </p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasAccess()) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This feature requires a {requiredRole === 'pro' ? 'Pro' : requiredRole === 'investor' ? 'Investor' : 'Premium'} subscription.
          </p>
          <Button onClick={() => navigate('/pricing')} className="w-full">
            Upgrade to {requiredRole === 'pro' ? 'Pro' : requiredRole === 'investor' ? 'Investor' : 'Premium'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show dev mode indicator when active
  return (
    <>
      {isDevMode && (
        <div className="mb-4">
          <Badge variant="outline" className="gap-2 bg-terminal-orange/10 text-terminal-orange border-terminal-orange/30">
            <Code className="h-3 w-3" />
            Dev Preview Mode
          </Badge>
        </div>
      )}
      {children}
    </>
  );
};