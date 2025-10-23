import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Milestone } from "@/hooks/useMilestones";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MilestoneEditDialogProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MilestoneEditDialog = ({
  milestone,
  open,
  onOpenChange,
}: MilestoneEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Milestone>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form data when milestone changes
  useEffect(() => {
    if (milestone) {
      setFormData(milestone);
    }
  }, [milestone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestone) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("milestones")
        .update({
          title: formData.title,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          status: formData.status,
          progress: formData.progress,
        })
        .eq("id", milestone.id);

      if (error) throw error;

      toast.success("Milestone updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Failed to update milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof Milestone,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!milestone) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Milestone</DialogTitle>
          <DialogDescription>
            Update milestone details, dates, status, and progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date || ""}
                onChange={(e) => handleChange("start_date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date || ""}
                onChange={(e) => handleChange("end_date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#93c5fd]" />
                    Planned
                  </div>
                </SelectItem>
                <SelectItem value="In Progress">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#facc15]" />
                    In Progress
                  </div>
                </SelectItem>
                <SelectItem value="Completed">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#4ade80]" />
                    Completed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">
              Progress: {formData.progress || 0}%
            </Label>
            <Slider
              id="progress"
              value={[formData.progress || 0]}
              onValueChange={(value) => handleChange("progress", value[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
