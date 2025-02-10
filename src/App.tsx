
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchInterval: 1000 * 30, // 30 seconds
    },
  },
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          toast({
            title: "Session Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          setSession(false);
          return;
        }
        setSession(!!currentSession);
      } catch (error) {
        console.error("Session check error:", error);
        setSession(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, navigate]);

  if (session === null) {
    return null; // Loading state
  }

  return session ? <>{children}</> : <Navigate to="/auth" />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
