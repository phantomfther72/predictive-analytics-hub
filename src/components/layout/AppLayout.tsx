import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';
import { FeedbackButton } from './FeedbackButton';
import { HelpSystem } from './HelpSystem';
import { OnboardingTour } from './OnboardingTour';
import { SidebarProvider } from '@/components/ui/sidebar';

export const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

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
              <Outlet />
            </div>
          </main>
        </div>

        {/* Floating Elements */}
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