
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./components/ui/use-toast";

// Create error boundary for suspense fallbacks
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
      <p className="mb-4">We're experiencing some technical difficulties.</p>
      <a href="/" className="text-teal-400 hover:text-teal-300 underline">
        Return to Home
      </a>
    </div>
  </div>
);

// Loading state for lazy-loaded components
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="animate-pulse text-teal-400 text-xl">Loading...</div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchInterval: 1000 * 30, // 30 seconds
      retry: 2,
      // Add error handling with our toast notification system
      onError: (error) => {
        console.error("Query error:", error);
      },
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
    return <LoadingFallback />; // Better loading state
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
          <Suspense fallback={<LoadingFallback />}>
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
              {/* Catch-all route - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
