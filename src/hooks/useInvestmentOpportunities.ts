
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentOpportunity } from "@/types/investment";
import { useToast } from "@/components/ui/use-toast";

export const useInvestmentOpportunities = () => {
  const { toast } = useToast();

  return useQuery<InvestmentOpportunity[]>({
    queryKey: ["investmentOpportunities"],
    queryFn: async () => {
      try {
        console.log("Fetching investment opportunities...");
        const { data, error } = await supabase
          .from("investment_opportunities")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching investment opportunities:", error);
          toast({
            title: "Error",
            description: "Failed to load investment opportunities",
            variant: "destructive",
          });
          throw error;
        }

        console.log("Retrieved opportunities:", data?.length || 0);
        
        // The as unknown as InvestmentOpportunity[] cast is necessary because
        // the structure from Supabase doesn't perfectly match our TypeScript interface
        return (data || []) as unknown as InvestmentOpportunity[];
      } catch (error) {
        console.error("Unexpected error in useInvestmentOpportunities:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading opportunities",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};
