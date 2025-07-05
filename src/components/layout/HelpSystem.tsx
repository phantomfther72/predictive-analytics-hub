import React, { useState } from 'react';
import { HelpCircle, Book, Bug, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const HelpSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpItems = [
    {
      title: 'How to use PredictivePulse',
      description: 'Learn the basics of navigating and using our platform',
      icon: Book,
      action: () => {
        // Could open a tutorial or documentation
        window.open('/docs', '_blank');
      }
    },
    {
      title: 'Understanding Predictions',
      description: 'How our AI generates market forecasts and insights',
      icon: MessageCircle,
      action: () => {
        // Could open prediction methodology documentation
        alert('Prediction methodology documentation coming soon!');
      }
    },
    {
      title: 'Report a Bug',
      description: 'Found something not working? Let us know',
      icon: Bug,
      action: () => {
        // Could open bug report form
        const feedbackButton = document.querySelector('[data-feedback-button]') as HTMLButtonElement;
        if (feedbackButton) {
          feedbackButton.click();
        }
        setIsOpen(false);
      }
    }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-6 left-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-background border-border z-50"
          size="icon"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 ml-6 mb-6" align="start">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Quick Help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {helpItems.map((item, index) => (
              <div key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-accent"
                  onClick={item.action}
                >
                  <div className="flex items-start gap-3">
                    <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                  </div>
                </Button>
                {index < helpItems.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
            
            <Separator className="my-3" />
            
            <div className="text-xs text-muted-foreground text-center">
              Need more help? Contact our support team at{' '}
              <a href="mailto:support@predictivepulse.na" className="text-primary hover:underline">
                support@predictivepulse.na
              </a>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};