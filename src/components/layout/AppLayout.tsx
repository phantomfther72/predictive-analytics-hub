import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';
import { FeedbackButton } from './FeedbackButton';
import { HelpSystem } from './HelpSystem';
import { OnboardingTour } from './OnboardingTour';
import { UpgradeBanner } from './UpgradeBanner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DevModeIndicator } from '@/components/DevModeIndicator';
import { ContinuousWatchMonitor } from '@/components/ContinuousWatchMonitor';

export const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);

  // Fetch user profile to check role
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user,
  });

  React.useEffect(() => {
    // Show onboarding for first-time users
    if (user && !localStorage.getItem('onboarding_completed')) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AppNavbar />
          
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/30">
            <div className="container mx-auto p-6 space-y-6">
              {/* Show upgrade banner for guest users */}
              {profile?.role === 'guest' && showUpgradeBanner && (
                <UpgradeBanner onDismiss={() => setShowUpgradeBanner(false)} />
              )}
              <Outlet />
            </div>
          </main>
        </div>

        {/* Floating Elements */}
        <DevModeIndicator />
        <ContinuousWatchMonitor />
        <FeedbackButton />
        <HelpSystem />
        
        {/* Onboarding Tour */}
        {showOnboarding && (
          <OnboardingTour onComplete={handleOnboardingComplete} />
        )}
      </div>
    </SidebarProvider>
  );
};