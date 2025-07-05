import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackModal } from '@/components/modals/FeedbackModal';

export const FeedbackButton: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 z-50"
        size="icon"
        data-feedback-button
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      
      <FeedbackModal 
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </>
  );
};