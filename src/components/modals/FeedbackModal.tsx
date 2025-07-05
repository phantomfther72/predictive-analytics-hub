import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          subject: formData.subject,
          message: formData.message,
          category: formData.category,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Feedback Sent',
        description: 'Thank you for your feedback. We\'ll review it shortly.',
      });

      setFormData({ subject: '', message: '', category: 'general' });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send feedback',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            💬 Send Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve PredictivePulse by sharing your thoughts, reporting bugs, or suggesting new features.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Feedback Type</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="What type of feedback is this?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">💬 General Feedback</SelectItem>
                <SelectItem value="bug">🐛 Bug Report</SelectItem>
                <SelectItem value="feature">✨ Feature Request</SelectItem>
                <SelectItem value="data">📊 Data Issue</SelectItem>
                <SelectItem value="ui">🎨 User Interface</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief summary of your feedback"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Details</Label>
            <Textarea
              id="message"
              placeholder="Please provide as much detail as possible. For bugs, include steps to reproduce the issue."
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <p>📧 Current page: {window.location.pathname}</p>
            {user && <p>👤 Logged in as: {user.email}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </span>
              ) : (
                'Send Feedback'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};