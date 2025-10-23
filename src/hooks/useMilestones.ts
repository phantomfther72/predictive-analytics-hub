import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Milestone {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: "Planned" | "In Progress" | "Completed";
  progress: number;
  created_at: string;
  updated_at: string;
}

export const useMilestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("milestones")
          .select("*")
          .order("start_date", { ascending: true });

        if (error) throw error;

        setMilestones(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching milestones:", err);
        setError(err as Error);
        toast({
          title: "Error loading milestones",
          description: "Failed to load project roadmap data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();

    // Set up real-time subscription
    const channel = supabase
      .channel("milestones-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "milestones",
        },
        (payload) => {
          console.log("Milestone change detected:", payload);

          if (payload.eventType === "INSERT") {
            setMilestones((prev) => [...prev, payload.new as Milestone].sort(
              (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
            ));
            toast({
              title: "New milestone added",
              description: (payload.new as Milestone).title,
            });
          } else if (payload.eventType === "UPDATE") {
            setMilestones((prev) =>
              prev.map((m) =>
                m.id === payload.new.id ? (payload.new as Milestone) : m
              )
            );
            toast({
              title: "Milestone updated",
              description: (payload.new as Milestone).title,
            });
          } else if (payload.eventType === "DELETE") {
            setMilestones((prev) =>
              prev.filter((m) => m.id !== payload.old.id)
            );
            toast({
              title: "Milestone removed",
              description: "A milestone has been deleted",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return { milestones, isLoading, error };
};
