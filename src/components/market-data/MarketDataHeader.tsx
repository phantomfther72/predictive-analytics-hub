
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MarketDataHeader: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
          title: "Error",
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
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-slate-900">Market Data</h2>
      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};
