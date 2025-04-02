
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Menu, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isSmall = useBreakpoint('sm');
  const { setOpenMobile } = useSidebar();

  const handleSignOut = async () => {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        navigate("/auth");
        return;
      }

      if (!session) {
        // If no session, just redirect to auth
        navigate("/auth");
        return;
      }

      // If we have a session, attempt to sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate("/auth");
      }
    } catch (error: any) {
      console.error("Unexpected error during sign out:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      // Still redirect to auth page on error
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpenMobile(true)}
              aria-label="Toggle mobile menu"
              className="touch-target mobile-interactive mr-1"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <span className={cn(
            "font-display font-semibold text-slate-900 dark:text-white truncate transition-all",
            isMobile ? "text-base max-w-[160px]" : "text-lg sm:text-xl"
          )}>
            <span className="bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
              Predictive Pulse
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <Button variant="ghost" size={isSmall ? "icon" : "sm"} asChild className={cn(
            isSmall ? "" : "mr-1 sm:mr-2",
            "touch-feedback"
          )}>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              {!isSmall && <span>Home</span>}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="touch-target mobile-interactive">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer mobile-menu-item">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer mobile-menu-item">
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
